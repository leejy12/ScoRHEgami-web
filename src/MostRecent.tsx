import { useEffect, useState } from "react";
import { GameGetRequest, GameGetResponse, getGames } from "./api";
import BaseballGame from "./BaseballGame";

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
    <>
      {games.map((game) => (
        <BaseballGame key={game.id} game={game} show_scorhegami={false} />
      ))}
    </>
  );
}

export default MostRecent;
