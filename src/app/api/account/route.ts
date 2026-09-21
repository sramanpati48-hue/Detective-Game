import { NextRequest, NextResponse } from "next/server";

interface UserAccount {
  playerId: string;
  hasCompletedTutorial: boolean;
  tutorialCompletedAt?: string | null;
  casesSolved: number;
  reputation: number;
  updatedAt: string;
}

// In-memory store for server runtime (keyed by playerId)
const accountStore = new Map<string, UserAccount>();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const playerId = searchParams.get("playerId") || "default_investigator";

  let account = accountStore.get(playerId);
  if (!account) {
    account = {
      playerId,
      hasCompletedTutorial: false,
      tutorialCompletedAt: null,
      casesSolved: 0,
      reputation: 100,
      updatedAt: new Date().toISOString(),
    };
    accountStore.set(playerId, account);
  }

  return NextResponse.json({ success: true, account });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const playerId = body.playerId || "default_investigator";

    const existing = accountStore.get(playerId) || {
      playerId,
      hasCompletedTutorial: false,
      tutorialCompletedAt: null,
      casesSolved: 0,
      reputation: 100,
      updatedAt: new Date().toISOString(),
    };

    const updated: UserAccount = {
      ...existing,
      ...body,
      playerId,
      updatedAt: new Date().toISOString(),
    };

    accountStore.set(playerId, updated);

    return NextResponse.json({ success: true, account: updated });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request payload" },
      { status: 400 }
    );
  }
}
