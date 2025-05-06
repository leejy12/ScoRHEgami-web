import { useEffect, useState } from "react";
import { GameGetRequest, GameGetResponse, getGames } from "./api";
import BaseballGameTable from "./BaseballGameTable";

function MostRecent() {
  const [games, setGames] = useState<GameGetResponse[]>([]);

  useEffect(() => {
    const setGameData = async () => {
      const request: GameGetRequest = {
        offset: 0,
        count: 10,
        filter_statuses: ["STATUS_FINAL"],
        is_scorhegami: true,
      };
      const games = await getGames(request);
      setGames(games);
    };

    setGameData();
  }, []);

  return (
    <BaseballGameTable games={games} show_scorhegami={false} show_date={true} />
  );
}

export default MostRecent;
