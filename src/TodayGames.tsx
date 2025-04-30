import { useState, useEffect } from "react";
import BaseballGame from "./BaseballGame";
import { GameGetResponse } from "./scorhegami";

import { getGames } from "./api";

function TodayGames() {
  const [games, setGames] = useState<GameGetResponse[]>([]);

  useEffect(() => {
    const setGameData = async () => {
      const resp = await fetch(
        "http://127.0.0.1:8000/game/latest_completed_date"
      );
      const lastDate = new Date(await resp.text());
      console.log(lastDate);

      const games = await getGames([lastDate], ["STATUS_FINAL"]);
      setGames(games);
    };

    setGameData();
  }, []);

  return (
    <>
      {games.map((game) => (
        <BaseballGame game={game} key={game.id} />
      ))}
    </>
  );
}

export default TodayGames;
