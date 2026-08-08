import { useState, useEffect } from "react";
import { getTodayGamesData, TodayGamesData } from "./gameData";
import BaseballGameTable from "./BaseballGameTable";

interface TodayGamesProps {
  cachedData?: TodayGamesData;
  onDataLoaded: (data: TodayGamesData) => void;
}

function TodayGames({ cachedData, onDataLoaded }: TodayGamesProps) {
  const [isLoading, setIsLoading] = useState(cachedData === undefined);

  useEffect(() => {
    if (cachedData) return;

    let ignore = false;

    const setGameData = async () => {
      try {
        const data = await getTodayGamesData();
        if (!ignore) onDataLoaded(data);
      } catch (error) {
        console.error("Error loading game data:", error);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    setGameData();

    return () => {
      ignore = true;
    };
  }, [cachedData, onDataLoaded]);

  if (!cachedData) {
    if (!isLoading) return <div>Unable to load games.</div>;
    return <div>Loading games...</div>;
  }

  const { games, lastDate } = cachedData;
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
