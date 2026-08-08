import {
  GameGetRequest,
  GameGetResponse,
  getGames,
  getLastCompletedDate,
} from "./api";

export interface TodayGamesData {
  games: GameGetResponse[];
  lastDate: string;
}

export async function getTodayGamesData(): Promise<TodayGamesData> {
  const lastDate = await getLastCompletedDate();
  const request: GameGetRequest = {
    offset: 0,
    count: 30,
    filter_dates: [lastDate],
    filter_statuses: ["STATUS_FINAL"],
  };
  const games = await getGames(request);

  return { games, lastDate };
}

export function getMostRecentGames(): Promise<GameGetResponse[]> {
  const request: GameGetRequest = {
    offset: 0,
    count: 10,
    filter_statuses: ["STATUS_FINAL"],
    is_scorhegami: true,
  };

  return getGames(request);
}
