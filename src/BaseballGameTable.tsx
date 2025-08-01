import { useState, useEffect } from "react";
import { GameGetResponse, getGamesCount } from "./api";
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
  const [rheCounts, setRheCounts] = useState<Map<number, number>>(new Map());

  useEffect(() => {
    const fetchRheCounts = async () => {
      const newCounts = new Map<number, number>();
      
      // Create array of promises for parallel execution
      const promises = games
        .filter(game => show_scorhegami && !game.is_scorhegami && game.rhe)
        .map(async (game) => {
          try {
            const count = await getGamesCount({ 
              rhe: game.rhe!,
              filter_statuses: ["STATUS_FINAL"]
            });
            return { gameId: game.id, count };
          } catch (error) {
            console.error(`Failed to fetch RHE count for game ${game.id}:`, error);
            return null;
          }
        });
      
      // Execute all promises in parallel
      const results = await Promise.all(promises);
      
      // Process results and update counts map
      results.forEach(result => {
        if (result) {
          newCounts.set(result.gameId, result.count);
        }
      });
      
      setRheCounts(newCounts);
    };

    if (show_scorhegami) {
      fetchRheCounts();
    }
  }, [games, show_scorhegami]);

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
                  {game.is_scorhegami 
                    ? "ScoRHEgami!" 
                    : rheCounts.has(game.id) 
                      ? `${rheCounts.get(game.id)} times`
                      : "Loading..."
                  }
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
