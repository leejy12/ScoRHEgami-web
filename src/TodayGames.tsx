import { useState, useEffect } from "react";
import {
  GameGetRequest,
  GameGetResponse,
  getLastCompletedDate,
  getGames,
} from "./api";
import BaseballGameTable from "./BaseballGameTable";

function TodayGames() {
  const [games, setGames] = useState<GameGetResponse[]>([]);
  const [lastDate, setLastDate] = useState<Date>();

  useEffect(() => {
    const setGameData = async () => {
      const lastDate = await getLastCompletedDate();
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
      <BaseballGameTable
        games={games}
        show_scorhegami={true}
        show_date={false}
      />
    </>
  );
}

export default TodayGames;
