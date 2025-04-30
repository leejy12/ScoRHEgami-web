import React, { useState } from "react";

import { GameGetResponse } from "./scorhegami";
import BaseballGame from "./BaseballGame";
import { getGames } from "./api";

function GameLookup() {
  const [date, setDate] = useState<Date | null>(null);
  const [games, setGames] = useState<GameGetResponse[]>([]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    try {
      if (date !== null) {
        const games = await getGames([date], ["STATUS_FINAL"]);
        setGames(games);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          id="gameDate"
          onChange={(e) => setDate(e.target.valueAsDate)}
        ></input>
        <button type="submit">Submit</button>
      </form>
      {games.map((game) => (
        <BaseballGame game={game} key={game.id} />
      ))}
    </>
  );
}

export default GameLookup;
