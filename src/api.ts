import config from "./config";

export interface TeamModel {
  id: number;
  short_name: string | null;
  name: string;
}

export type GameStatusEnum =
  | "STATUS_SCHEDULED"
  | "STATUS_IN_PROGRESS"
  | "STATUS_FINAL"
  | "STATUS_POSTPONED"
  | "STATUS_RAIN_DELAY";

export interface GameGetResponse {
  id: number;
  balldontlie_id?: number | null;
  away_team: TeamModel;
  home_team: TeamModel;
  start_time: string | null;
  end_time: string | null;
  status: GameStatusEnum;
  box_score: number[];
  rhe: number[] | null;
  is_scorhegami: boolean | null;
  bref_url: string | null;
  date: string;
}

function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // +1 because months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export type GameGetRequest = {
  offset: number;
  count: number;
  filter_dates?: Date[];
  filter_statuses?: GameStatusEnum[];
  is_scorhegami?: boolean;
  rhe?: number[];
};

export type GameCountGetRequest = {
  filter_dates?: Date[];
  filter_statuses?: GameStatusEnum[];
  is_scorhegami?: boolean;
  rhe?: number[];
};

export async function getGames(
  request: GameGetRequest
): Promise<GameGetResponse[]> {
  const params = new URLSearchParams();

  params.append("offset", request.offset.toString());
  params.append("count", request.count.toString());

  if (request.filter_dates?.length) {
    request.filter_dates.forEach((date) => {
      params.append("filter_dates", formatDateToYYYYMMDD(date));
    });
  }

  if (request.filter_statuses?.length) {
    request.filter_statuses.forEach((status) => {
      params.append("filter_statuses", status);
    });
  }

  if (request.is_scorhegami) {
    params.append("is_scorhegami", request.is_scorhegami.toString());
  }

  if (request.rhe?.length) {
    request.rhe.forEach((n) => {
      params.append("rhe", n.toString());
    });
  }

  const resp = await fetch(`${config.apiUrl}/game?${params.toString()}`);

  return await resp.json();
}

export async function getGamesCount(
  request: GameCountGetRequest
): Promise<number> {
  const params = new URLSearchParams();

  if (request.filter_dates?.length) {
    request.filter_dates.forEach((date) => {
      params.append("filter_dates", formatDateToYYYYMMDD(date));
    });
  }

  if (request.filter_statuses?.length) {
    request.filter_statuses.forEach((status) => {
      params.append("filter_statuses", status);
    });
  }

  if (request.is_scorhegami) {
    params.append("is_scorhegami", request.is_scorhegami.toString());
  }

  if (request.rhe?.length) {
    request.rhe.forEach((n) => {
      params.append("rhe", n.toString());
    });
  }

  const resp = await fetch(`${config.apiUrl}/game/count?${params.toString()}`);

  return await resp.json();
}
