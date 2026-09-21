import { NextRequest, NextResponse } from "next/server";

interface RoomPlayerRecord {
  slotNumber: number;
  detectiveId: string;
  userId?: string;
  updatedAt: number;
}

// In-memory store for room player assignments
// Map<roomCode, Map<slotNumber, RoomPlayerRecord>>
declare global {
  var __bhorerRoomStore: Map<string, Map<number, RoomPlayerRecord>> | undefined;
}

const roomStore = globalThis.__bhorerRoomStore ?? new Map<string, Map<number, RoomPlayerRecord>>();
if (process.env.NODE_ENV !== "production") {
  globalThis.__bhorerRoomStore = roomStore;
}

function getRoomSlots(roomCode: string): Map<number, RoomPlayerRecord> {
  let slots = roomStore.get(roomCode);
  if (!slots) {
    slots = new Map<number, RoomPlayerRecord>();
    roomStore.set(roomCode, slots);
  }
  return slots;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomCode: string }> }
) {
  const { roomCode } = await params;
  const slots = getRoomSlots(roomCode);

  const players: RoomPlayerRecord[] = Array.from(slots.values());
  const takenByOthers: string[] = players.map((p) => p.detectiveId);

  return NextResponse.json({
    roomCode,
    takenByOthers,
    players,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomCode: string }> }
) {
  const { roomCode } = await params;
  try {
    let body: { detectiveId?: string; slotNumber?: number; userId?: string } | null = null;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { detectiveId, slotNumber = 1, userId = "player-1" } = body || {};

    if (!detectiveId) {
      return NextResponse.json(
        { error: "Detective ID is required" },
        { status: 400 }
      );
    }

    const slots = getRoomSlots(roomCode);

    // Check race condition: Is this detective already claimed by a DIFFERENT slot in this room?
    for (const [existingSlot, record] of slots.entries()) {
      if (record.detectiveId === detectiveId && existingSlot !== slotNumber) {
        return NextResponse.json(
          {
            error: "This detective has just been claimed by another investigator in this room.",
            conflict: true,
          },
          { status: 409 }
        );
      }
    }

    // Save selection for this slot
    const record: RoomPlayerRecord = {
      slotNumber: Number(slotNumber),
      detectiveId,
      userId,
      updatedAt: Date.now(),
    };

    slots.set(Number(slotNumber), record);

    return NextResponse.json({
      success: true,
      roomCode,
      selection: record,
    });
  } catch (e) {
    console.error("Room character assignment error:", e);
    return NextResponse.json(
      { error: "Internal server error assigning detective" },
      { status: 500 }
    );
  }
}
