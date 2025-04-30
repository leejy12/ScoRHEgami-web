import { GameGetResponse } from "./scorhegami";

function BaseballGame({ game }: { game: GameGetResponse }) {
  const boxScore = game.box_score;

  const awayPart: number[] | string[] =
    game.status === "STATUS_SCHEDULED"
      ? Array(12).fill("-")
      : boxScore.slice(0, boxScore.length / 2);

  const homePart: number[] | string[] =
    game.status === "STATUS_SCHEDULED"
      ? Array(12).fill("-")
      : boxScore.slice(boxScore.length / 2);

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

export default BaseballGame;
