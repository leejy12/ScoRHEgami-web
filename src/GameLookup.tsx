import React, { useState } from "react";

interface TeamModel {
  id: number;
  short_name: string | null;
  name: string;
}

type GameStatusEnum =
  | "STATUS_SCHEDULED"
  | "STATUS_IN_PROGRESS"
  | "STATUS_FINAL"
  | "STATUS_POSTPONED"
  | "STATUS_RAIN_DELAY";

interface GameGetResponse {
  id: number;
  balldontlie_id?: number | null;
  away_team: TeamModel;
  home_team: TeamModel;
  start_time: string | null;
  end_time: string | null;
  status: GameStatusEnum;
  box_score: number[] | null;
  rhe: number[] | null;
  is_scorhegami: boolean | null;
  bref_url: string | null;
}

function BaseballGame({ game }: { game: GameGetResponse }) {
  const boxScore = game.box_score;

  const awayPart: number[] | string[] =
    boxScore !== null
      ? boxScore.slice(0, boxScore.length / 2)
      : Array(12).fill("-");

  const homePart: number[] | string[] =
    boxScore !== null
      ? boxScore.slice(boxScore.length / 2)
      : Array(12).fill("-");

  const numInnings = Math.max(awayPart.length - 3, 9);
  return (
    <table>
      <tr>
        <td>&nbsp;</td>
        {Array.from({ length: numInnings }, (_, i) => (
          <th key={i}>{i + 1}</th>
        ))}
        <th>R</th>
        <th>H</th>
        <th>E</th>
      </tr>
      <tr>
        <td>{game.away_team.name}</td>
        {awayPart.map((score, _) => (
          <td>{score}</td>
        ))}
      </tr>
      <tr>
        <td>{game.home_team.name}</td>
        {homePart.map((score, _) => (
          <td>{score}</td>
        ))}
      </tr>
    </table>
  );
}

function GameLookup() {
  const [gameId, setGameId] = useState("");
  const [game, setGame] = useState<GameGetResponse | null>(null);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!gameId.trim()) {
      return;
    }

    setGame(null);

    try {
      const response = await fetch(`http://127.0.0.1:8000/game/${gameId}`);
      if (!response.ok) {
        throw new Error(`Error! ${response}`);
      }

      const data = await response.json();
      console.log(data);
      setGame(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          id="gameId"
          onChange={(e) => setGameId(e.target.value)}
        ></input>
        <button type="submit">Submit</button>
      </form>
      {game && <BaseballGame game={game} />}
    </>
  );
}

export default GameLookup;
