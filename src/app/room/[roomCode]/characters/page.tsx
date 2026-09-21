import React from "react";
import DetectiveSelectScreen from "@/components/room/DetectiveSelectScreen";

export const metadata = {
  title: "Select Your Detective | Bhorer Shahar: Case Files",
  description: "Select your investigative persona for this case investigation.",
};

export default async function RoomCharactersPage({
  params,
  searchParams,
}: {
  params: Promise<{ roomCode: string }>;
  searchParams?: Promise<{ preferredDetective?: string }>;
}) {
  const { roomCode } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const preferredDetective = resolvedSearchParams?.preferredDetective;

  return (
    <DetectiveSelectScreen 
      roomCode={roomCode} 
      preferredDetective={preferredDetective} 
    />
  );
}
