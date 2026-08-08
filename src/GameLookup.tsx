import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  getGames,
  GameGetRequest,
  GameGetResponse,
  getGamesCount,
  GameStatusEnum,
} from "./api";
import BaseballGameTable from "./BaseballGameTable";

type RheValues = [number, number, number, number, number, number];

const DEFAULT_RHE: RheValues = [0, 0, 0, 0, 0, 0];
const GAMES_PER_PAGE = 10;
const RHE_PARAM_ERROR =
  "RHE must contain exactly six non-negative integers separated by commas.";

function parseRheParam(value: string | null): RheValues | null {
  if (value === null) return null;

  const parts = value.split(",").map((part) => part.trim());
  if (parts.length !== 6 || parts.some((part) => !/^\d+$/.test(part))) {
    return null;
  }

  const values = parts.map(Number);
  if (values.some((number) => !Number.isSafeInteger(number))) return null;

  return values as RheValues;
}

async function loadGames(page: number, rhe: RheValues) {
  const requestParams = {
    filter_statuses: ["STATUS_FINAL"] as GameStatusEnum[],
    rhe,
  };

  const gamesRequest: GameGetRequest = {
    offset: (page - 1) * GAMES_PER_PAGE,
    count: GAMES_PER_PAGE,
    ...requestParams,
  };

  const [totalCount, games] = await Promise.all([
    getGamesCount(requestParams),
    getGames(gamesRequest),
  ]);

  return { games, totalCount };
}

interface GameLookupFormProps {
  rheParam: string | null;
}

function GameLookupForm({ rheParam }: GameLookupFormProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const parsedRhe = parseRheParam(rheParam);
  const initialRhe = parsedRhe ?? DEFAULT_RHE;

  const [games, setGames] = useState<GameGetResponse[]>([]);
  const [totalGames, setTotalGames] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(parsedRhe !== null);
  const [activeRhe, setActiveRhe] = useState<RheValues | null>(parsedRhe);
  const [inputError, setInputError] = useState<string>("");
  const requestId = useRef(0);

  const [awayR, setAwayR] = useState<string>(String(initialRhe[0]));
  const [awayH, setAwayH] = useState<string>(String(initialRhe[1]));
  const [awayE, setAwayE] = useState<string>(String(initialRhe[2]));

  const [homeR, setHomeR] = useState<string>(String(initialRhe[3]));
  const [homeH, setHomeH] = useState<string>(String(initialRhe[4]));
  const [homeE, setHomeE] = useState<string>(String(initialRhe[5]));

  const fetchGames = useCallback(async (page: number, rhe: RheValues) => {
    const currentRequestId = ++requestId.current;
    setIsLoading(true);
    setActiveRhe(rhe);

    try {
      const result = await loadGames(page, rhe);

      if (requestId.current !== currentRequestId) return;

      setTotalGames(result.totalCount);
      setGames(result.games);
      setCurrentPage(page);
    } catch (err) {
      if (requestId.current === currentRequestId) console.log(err);
    } finally {
      if (requestId.current === currentRequestId) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const rhe = parseRheParam(rheParam);
    if (!rhe) return;

    let ignore = false;
    const currentRequestId = ++requestId.current;

    const setGameData = async () => {
      try {
        const result = await loadGames(1, rhe);
        if (ignore || requestId.current !== currentRequestId) return;

        setTotalGames(result.totalCount);
        setGames(result.games);
        setCurrentPage(1);
      } catch (err) {
        if (!ignore && requestId.current === currentRequestId) console.log(err);
      } finally {
        if (!ignore && requestId.current === currentRequestId) {
          setIsLoading(false);
        }
      }
    };

    void setGameData();

    return () => {
      ignore = true;
    };
  }, [rheParam]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const rhe = parseRheParam(
      [awayR, awayH, awayE, homeR, homeH, homeE].join(","),
    );
    if (!rhe) {
      setInputError(RHE_PARAM_ERROR);
      return;
    }

    setInputError("");
    const encodedRhe = rhe.join(",");

    if (rheParam === encodedRhe) {
      void fetchGames(1, rhe);
      return;
    }

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("rhe", encodedRhe);
    setSearchParams(nextSearchParams);
  };

  const handlePageChange = (page: number) => {
    if (
      !activeRhe ||
      page < 1 ||
      page > getTotalPages() ||
      page === currentPage
    ) {
      return;
    }

    void fetchGames(page, activeRhe);
  };

  const getTotalPages = () => {
    return Math.ceil(totalGames / GAMES_PER_PAGE);
  };

  const queryParamError =
    rheParam !== null && parseRheParam(rheParam) === null
      ? RHE_PARAM_ERROR
      : "";

  return (
    <>
      <form className="game-lookup-form" onSubmit={handleSubmit}>
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
                  min={0}
                  step={1}
                  required
                  id="awayR"
                  value={awayR}
                  onChange={(e) => setAwayR(e.target.value)}
                ></input>
              </td>
              <td>
                <input
                  type="number"
                  min={0}
                  step={1}
                  required
                  id="awayH"
                  value={awayH}
                  onChange={(e) => setAwayH(e.target.value)}
                ></input>
              </td>
              <td>
                <input
                  type="number"
                  min={0}
                  step={1}
                  required
                  id="awayE"
                  value={awayE}
                  onChange={(e) => setAwayE(e.target.value)}
                ></input>
              </td>
            </tr>
            <tr>
              <td>Home</td>
              <td>
                <input
                  type="number"
                  min={0}
                  step={1}
                  required
                  id="homeR"
                  value={homeR}
                  onChange={(e) => setHomeR(e.target.value)}
                ></input>
              </td>
              <td>
                <input
                  type="number"
                  min={0}
                  step={1}
                  required
                  id="homeH"
                  value={homeH}
                  onChange={(e) => setHomeH(e.target.value)}
                ></input>
              </td>
              <td>
                <input
                  type="number"
                  min={0}
                  step={1}
                  required
                  id="homeE"
                  value={homeE}
                  onChange={(e) => setHomeE(e.target.value)}
                ></input>
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit">Submit</button>
      </form>

      {(inputError || queryParamError) && (
        <div role="alert">{inputError || queryParamError}</div>
      )}

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
              <BaseballGameTable
                games={games}
                show_scorhegami={false}
                show_date={true}
              />

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

function GameLookup() {
  const [searchParams] = useSearchParams();
  const rheParam = searchParams.get("rhe");

  return (
    <GameLookupForm key={rheParam ?? "no-rhe"} rheParam={rheParam} />
  );
}

export default GameLookup;
