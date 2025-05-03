import React, { useState } from "react";

import BaseballGame from "./BaseballGame";
import { getGames, GameGetRequest, GameGetResponse } from "./api";

function GameLookup() {
  const [games, setGames] = useState<GameGetResponse[]>([]);

  const [awayR, setAwayR] = useState<number>(0);
  const [awayH, setAwayH] = useState<number>(0);
  const [awayE, setAwayE] = useState<number>(0);

  const [homeR, setHomeR] = useState<number>(0);
  const [homeH, setHomeH] = useState<number>(0);
  const [homeE, setHomeE] = useState<number>(0);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    try {
      const rhe = [awayR, awayH, awayE, homeR, homeH, homeE];
      const request: GameGetRequest = {
        offset: 0,
        count: 30,
        filter_statuses: ["STATUS_FINAL"],
        rhe: rhe,
      };
      const games = await getGames(request);
      setGames(games);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          id="awayR"
          onChange={(e) => setAwayR(e.target.valueAsNumber)}
        ></input>
        <input
          type="number"
          id="awayH"
          onChange={(e) => setAwayH(e.target.valueAsNumber)}
        ></input>
        <input
          type="number"
          id="awayE"
          onChange={(e) => setAwayE(e.target.valueAsNumber)}
        ></input>
        <br />
        <input
          type="number"
          id="homeR"
          onChange={(e) => setHomeR(e.target.valueAsNumber)}
        ></input>
        <input
          type="number"
          id="homeH"
          onChange={(e) => setHomeH(e.target.valueAsNumber)}
        ></input>
        <input
          type="number"
          id="homeE"
          onChange={(e) => setHomeE(e.target.valueAsNumber)}
        ></input>
        <button type="submit">Submit</button>
      </form>
      {games.map((game) => (
        <BaseballGame
          key={game.id}
          game={game}
          show_scorhegami={false}
          show_date={true}
        />
      ))}
    </>
  );
}

export default GameLookup;
