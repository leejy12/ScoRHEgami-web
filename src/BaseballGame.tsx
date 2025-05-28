import { GameGetResponse } from "./api";

type BaseballGameProps = {
  game: GameGetResponse;
};

function BaseballGame({ game }: BaseballGameProps) {
  const boxScore = game.box_score;

  const awayPart: number[] | string[] =
    game.status === "STATUS_SCHEDULED"
      ? Array(12).fill("-")
      : boxScore.slice(0, boxScore.length / 2);

  const awayInnings = awayPart.slice(0, -3);
  const awayRHE = awayPart.slice(-3);

  const homePart: number[] | string[] =
    game.status === "STATUS_SCHEDULED"
      ? Array(12).fill("-")
      : boxScore.slice(boxScore.length / 2);

  const homeInnings = homePart.slice(0, -3);
  const homeRHE = homePart.slice(-3);

  const numInnings = Math.max(awayPart.length - 3, 5);
  return (
    <div style={{ overflowX: "auto", maxWidth: "100vw" }}>
    <table className="box-score-table" >
      <colgroup>
        <col className="box-score-table-teamname" />
        {Array.from({ length: numInnings }).map((_, i) => (
          <col key={`inning-${i}`} style={{ minWidth: "1.3rem" }} />
        ))}
        <col className="box-score-table-rhe" />
        <col className="box-score-table-rhe" />
        <col className="box-score-table-rhe" />
      </colgroup>
      <thead>
        <tr>
          <th>&nbsp;</th>
          {Array.from({ length: numInnings }, (_, i) => (
            <th className="box-score-table-inning" key={i}>{i + 1}</th>
          ))}
          <th>R</th>
          <th>H</th>
          <th>E</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{game.away_team.name}</td>
          {awayInnings.map((n, i) => (
            <td className="box-score-table-inning" key={`away-inning-${i}`}>
              {n}
            </td>
          ))}
          {awayRHE.map((n, i) => (
            <td className="box-score-table-rhe" key={`away-rhe-${i}`}>
              {n}
            </td>
          ))}
        </tr>
        <tr>
          <td>{game.home_team.name}</td>
          {homeInnings.map((n, i) => (
            <td className="box-score-table-inning" key={`home-inning-${i}`}>
              {n}
            </td>
          ))}
          {homeRHE.map((n, i) => (
            <td className="box-score-table-rhe" key={`home-rhe-${i}`}>
              {n}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
    </div>
  );
}

export default BaseballGame;
