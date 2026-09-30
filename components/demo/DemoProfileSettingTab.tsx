"use client";

import { useDemoData } from "@/components/demo/DemoModeProvider";
import AccountProfileForm from "@/components/settings/profile/AccountProfileForm";
import MyPlayerProfileForm from "@/components/settings/profile/MyPlayerProfileForm";
import type { PlayerDetailPosition } from "@/types/player";
import { useState } from "react";

export default function DemoProfileSettingsTab() {
  const { players, updatePlayer } = useDemoData();
  const [name, setName] = useState("김민수");
  const [email, setEmail] = useState("minsu@squadflow.demo");

  const myPlayer = players.find((player) => player.userId === "demo-user");

  const handleSavePlayer = async (
    playerId: string,
    number: number | undefined,
    detailPositions: PlayerDetailPosition[],
  ) => {
    const player = players.find((item) => item.id === playerId);
    if (!player) return false;

    updatePlayer(
      {
        ...player,
        number,
        detailPositions,
      },
      player.teamMemberRole ?? "owner",
    );

    return true;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <AccountProfileForm
        name={name}
        email={email}
        onSaveName={async (nextName) => {
          setName(nextName);
          return true;
        }}
        onChangeEmail={async (nextEmail) => {
          setEmail(nextEmail);
          return true;
        }}
      />

      {myPlayer && (
        <MyPlayerProfileForm
          player={{
            id: myPlayer.id,
            name: myPlayer.name,
            number: myPlayer.number,
            detailPositions: myPlayer.detailPositions ?? [],
          }}
          onSave={handleSavePlayer}
        />
      )}
    </div>
  );
}
