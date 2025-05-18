import { GameGetResponse } from "./api";
import BaseballGame from "./BaseballGame";

type BaseballGameTableProps = {
  games: GameGetResponse[];
  show_scorhegami: boolean;
  show_date: boolean;
};

function BaseballGameTable({
  games,
  show_scorhegami,
  show_date,
}: BaseballGameTableProps) {
  return (
    <>
      <table className="baseball-game-table">
        <thead>
          <tr>
            <th>Game</th>
            {show_scorhegami ? (
              <th className="baseball-game-table-extra-th">Is ScoRHEgami?</th>
            ) : (
              <></>
            )}
            {show_date ? (
              <th className="baseball-game-table-extra-th">Date</th>
            ) : (
              <></>
            )}
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr>
              <td>
                <BaseballGame key={game.id} game={game} />
              </td>
              {show_scorhegami ? (
                <td className="baseball-game-table-extra-td">
                  {game.is_scorhegami ? "ScoRHEgami!" : ""}
                </td>
              ) : (
                <></>
              )}
              {show_date ? (
                <td className="baseball-game-table-extra-td">{game.date}</td>
              ) : (
                <></>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default BaseballGameTable;
