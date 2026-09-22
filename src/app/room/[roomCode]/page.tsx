import { redirect } from 'next/navigation';

export default async function RoomIndexPage({
  params,
}: {
  params: Promise<{ roomCode: string }>;
}) {
  const { roomCode } = await params;
  redirect(`/room/${encodeURIComponent(roomCode)}/characters`);
}
