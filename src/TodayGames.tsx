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
  const [lastDate, setLastDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setGameData = async () => {
      try {
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
      } catch (error) {
        console.error("Error loading game data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setGameData();
  }, []);

  if (isLoading) {
    return <div>Loading games...</div>;
  }

  const numScorhegami = games.filter((game) => game.is_scorhegami).length;
  const singular = numScorhegami === 1;

  return (
    <>
      <h3>
        Games on{" "}
        {new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "UTC",
        }).format(new Date(lastDate))}
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