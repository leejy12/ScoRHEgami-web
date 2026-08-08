import { useEffect } from "react";
import { GameGetResponse } from "./api";
import { getMostRecentGames } from "./gameData";
import BaseballGameTable from "./BaseballGameTable";

interface MostRecentProps {
  cachedGames?: GameGetResponse[];
  onGamesLoaded: (games: GameGetResponse[]) => void;
}

function MostRecent({ cachedGames, onGamesLoaded }: MostRecentProps) {
  useEffect(() => {
    if (cachedGames !== undefined) return;

    let ignore = false;

    const setGameData = async () => {
      const games = await getMostRecentGames();
      if (!ignore) onGamesLoaded(games);
    };

    setGameData();

    return () => {
      ignore = true;
    };
  }, [cachedGames, onGamesLoaded]);

  return (
    <BaseballGameTable
      games={cachedGames ?? []}
      show_scorhegami={false}
      show_date={true}
    />
  );
}

export default MostRecent;
