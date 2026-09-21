export interface UserAccount {
  playerId: string;
  hasCompletedTutorial: boolean;
  tutorialCompletedAt?: string | null;
  casesSolved: number;
  reputation: number;
  updatedAt: string;
}

const LOCAL_STORAGE_KEY = "bhorer_investigator_account";

export function getStoredPlayerId(): string {
  if (typeof window === "undefined") return "default_investigator";
  let pid = localStorage.getItem("bhorer_global_player_id");
  if (!pid) {
    pid = `inv_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    localStorage.setItem("bhorer_global_player_id", pid);
  }
  return pid;
}

export async function getAccountProfile(playerId?: string): Promise<UserAccount> {
  const pid = playerId || getStoredPlayerId();

  // Try fetching from server-side account API first
  try {
    const res = await fetch(`/api/account?playerId=${encodeURIComponent(pid)}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.account) {
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.account));
        }
        return data.account;
      }
    }
  } catch (err) {
    console.warn("Could not fetch account from server, falling back to local storage:", err);
  }

  // Fallback to local storage
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          playerId: pid,
          hasCompletedTutorial: Boolean(parsed.hasCompletedTutorial),
          tutorialCompletedAt: parsed.tutorialCompletedAt || null,
          casesSolved: parsed.casesSolved || 0,
          reputation: parsed.reputation || 100,
          updatedAt: parsed.updatedAt || new Date().toISOString(),
        };
      }
    } catch {
      // ignore
    }
  }

  return {
    playerId: pid,
    hasCompletedTutorial: false,
    tutorialCompletedAt: null,
    casesSolved: 0,
    reputation: 100,
    updatedAt: new Date().toISOString(),
  };
}

export async function setTutorialCompleted(
  completed: boolean,
  playerId?: string
): Promise<void> {
  const pid = playerId || getStoredPlayerId();
  const payload = {
    playerId: pid,
    hasCompletedTutorial: completed,
    tutorialCompletedAt: completed ? new Date().toISOString() : null,
  };

  // Sync client-side cache immediately
  if (typeof window !== "undefined") {
    try {
      const current = localStorage.getItem(LOCAL_STORAGE_KEY);
      const updated = {
        ...(current ? JSON.parse(current) : {}),
        ...payload,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  // Sync server-side account record
  try {
    await fetch("/api/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn("Could not sync tutorial completion to server:", err);
  }
}

export async function checkHasCompletedTutorial(playerId?: string): Promise<boolean> {
  // First check fast local cache for instantaneous UI rendering
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.hasCompletedTutorial === true) {
          return true;
        }
      }
    } catch {
      // ignore
    }
  }

  const profile = await getAccountProfile(playerId);
  return profile.hasCompletedTutorial;
}

export async function resetTutorial(playerId?: string): Promise<void> {
  await setTutorialCompleted(false, playerId);
}
