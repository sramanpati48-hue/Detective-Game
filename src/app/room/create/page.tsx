import { redirect } from "next/navigation";

interface RoomCreateProps {
  searchParams?: Promise<{
    preferredDetective?: string;
  }>;
}

export default async function RoomCreatePage({ searchParams }: RoomCreateProps) {
  const resolved = searchParams ? await searchParams : undefined;
  const preferredDetective = resolved?.preferredDetective;

  // Generate a random 3-digit investigation room code (e.g. ROOM-842)
  const roomCode = `ROOM-${Math.floor(100 + Math.random() * 900)}`;

  const dest = preferredDetective
    ? `/room/${roomCode}/characters?preferredDetective=${encodeURIComponent(preferredDetective)}`
    : `/room/${roomCode}/characters`;

  redirect(dest);
}
