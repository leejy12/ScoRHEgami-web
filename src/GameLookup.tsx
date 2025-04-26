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
  date: string;
}

async function getGames(date: Date | null): Promise<GameGetResponse[]> {
  const params = new URLSearchParams();
  params.append("offset", "0");
  params.append("count", "30");

  if (date !== null) {
    params.append("filter_date", date.toISOString().split("T")[0]);
  }

  const resp = await fetch(`http://127.0.0.1:8000/game?${params.toString()}`);

  return await resp.json();
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
      <thead>
        <tr>
          <td>&nbsp;</td>
          {Array.from({ length: numInnings }, (_, i) => (
            <th key={i}>{i + 1}</th>
          ))}
          <th>R</th>
          <th>H</th>
          <th>E</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{game.away_team.name}</td>
          {awayPart.map((n, i) => (
            <td key={`away-${i}`}>{n}</td>
          ))}
        </tr>
        <tr>
          <td>{game.home_team.name}</td>
          {homePart.map((n, i) => (
            <td key={`home-${i}`}>{n}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

function GameLookup() {
  const [date, setDate] = useState<Date | null>(null);
  const [games, setGames] = useState<GameGetResponse[]>([]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    try {
      const games = await getGames(date);
      setGames(games);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          id="gameDate"
          onChange={(e) => setDate(e.target.valueAsDate)}
        ></input>
        <button type="submit">Submit</button>
      </form>
      {games.map((game) => (
        <BaseballGame game={game} key={game.id} />
      ))}
    </>
  );
}

export default GameLookup;
