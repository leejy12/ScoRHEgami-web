import { useState, useEffect } from "react";
import BaseballGame from "./BaseballGame";

import { GameGetRequest, GameGetResponse, getGames } from "./api";

function TodayGames() {
  const [games, setGames] = useState<GameGetResponse[]>([]);

  useEffect(() => {
    const setGameData = async () => {
      const resp = await fetch(
        "http://127.0.0.1:8000/game/latest_completed_date"
      );
      const lastDate = new Date(await resp.text());

      const request: GameGetRequest = {
        offset: 0,
        count: 30,
        filter_dates: [lastDate],
        filter_statuses: ["STATUS_FINAL"],
      };
      const games = await getGames(request);
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
