import { useState, useEffect } from "react";
import BaseballGame from "./BaseballGame";

import { GameGetRequest, GameGetResponse, getGames } from "./api";

function TodayGames() {
  const [games, setGames] = useState<GameGetResponse[]>([]);
  const [lastDate, setLastDate] = useState<Date>();

  useEffect(() => {
    const setGameData = async () => {
      const resp = await fetch(
        "http://127.0.0.1:8000/game/latest_completed_date"
      );
      const lastDate = new Date(await resp.text());
      setLastDate(lastDate);

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

  const numScorhegami = games.filter((game) => game.is_scorhegami).length;
  const singular = numScorhegami === 1;

  return (
    <>
      <h3>
        Games on{" "}
        {lastDate?.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </h3>
      <p>
        There {singular ? "was" : "were"} {numScorhegami}{" "}
        {singular ? "game" : "games"} that were ScoRHEgamis.
      </p>
      {games.map((game) => (
        <BaseballGame key={game.id} game={game} show_scorhegami={true} />
      ))}
    </>
  );
}

export default TodayGames;
