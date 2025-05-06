import React, { useState } from "react";

import BaseballGame from "./BaseballGame";
import {
  getGames,
  GameGetRequest,
  GameGetResponse,
  getGamesCount,
  GameStatusEnum,
} from "./api";

function GameLookup() {
  const [games, setGames] = useState<GameGetResponse[]>([]);
  const [totalGames, setTotalGames] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const gamesPerPage = 10;

  const [awayR, setAwayR] = useState<number>(0);
  const [awayH, setAwayH] = useState<number>(0);
  const [awayE, setAwayE] = useState<number>(0);

  const [homeR, setHomeR] = useState<number>(0);
  const [homeH, setHomeH] = useState<number>(0);
  const [homeE, setHomeE] = useState<number>(0);

  const fetchGames = async (page: number) => {
    setIsLoading(true);

    try {
      const rhe = [awayR, awayH, awayE, homeR, homeH, homeE];
      const requestParams = {
        filter_statuses: ["STATUS_FINAL"] as GameStatusEnum[],
        rhe: rhe,
      };

      const countRequest = { ...requestParams };
      const totalCount = await getGamesCount(countRequest);
      setTotalGames(totalCount);

      const gamesRequest: GameGetRequest = {
        offset: (page - 1) * gamesPerPage,
        count: gamesPerPage,
        ...requestParams,
      };
      const fetchedGames = await getGames(gamesRequest);
      setGames(fetchedGames);
      setCurrentPage(page);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    fetchGames(1);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > getTotalPages() || page === currentPage) return;
    fetchGames(page);
  };

  const getTotalPages = () => {
    return Math.ceil(totalGames / gamesPerPage);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <table>
          <thead>
            <tr>
              <td></td>
              <td>R</td>
              <td>H</td>
              <td>E</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Away</td>
              <td>
                <input
                  type="number"
                  id="awayR"
                  onChange={(e) => setAwayR(e.target.valueAsNumber)}
                ></input>
              </td>
              <td>
                <input
                  type="number"
                  id="awayH"
                  onChange={(e) => setAwayH(e.target.valueAsNumber)}
                ></input>
              </td>
              <td>
                <input
                  type="number"
                  id="awayE"
                  onChange={(e) => setAwayE(e.target.valueAsNumber)}
                ></input>
              </td>
            </tr>
            <tr>
              <td>Home</td>
              <td>
                <input
                  type="number"
                  id="homeR"
                  onChange={(e) => setHomeR(e.target.valueAsNumber)}
                ></input>
              </td>
              <td>
                <input
                  type="number"
                  id="homeH"
                  onChange={(e) => setHomeH(e.target.valueAsNumber)}
                ></input>
              </td>
              <td>
                <input
                  type="number"
                  id="homeE"
                  onChange={(e) => setHomeE(e.target.valueAsNumber)}
                ></input>
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit">Submit</button>
      </form>

      {totalGames > 0 && !isLoading && (
        <div>
          Found {totalGames} game{totalGames !== 1 ? "s" : ""}.
        </div>
      )}

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {games.length > 0 ? (
            <>
              {games.map((game) => (
                <BaseballGame
                  key={game.id}
                  game={game}
                  show_scorhegami={false}
                  show_date={true}
                />
              ))}

              {getTotalPages() > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                  >
                    First
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>

                  <span>
                    Page {currentPage} of {getTotalPages()}
                  </span>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === getTotalPages()}
                  >
                    Next
                  </button>
                  <button
                    onClick={() => handlePageChange(getTotalPages())}
                    disabled={currentPage === getTotalPages()}
                  >
                    Last
                  </button>
                </div>
              )}
            </>
          ) : (
            games.length === 0 && (
              <div>No games found with this RHE combination.</div>
            )
          )}
        </>
      )}
    </>
  );
}

export default GameLookup;
