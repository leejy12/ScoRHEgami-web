import { GameGetResponse, GameStatusEnum } from "./scorhegami";

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
};

export async function getGames(
  request: GameGetRequest
): Promise<GameGetResponse[]> {
  const params = new URLSearchParams();

  params.append("offset", request.offset.toString());
  params.append("count", request.count.toString());

  if (request.filter_dates && request.filter_dates.length > 0) {
    request.filter_dates.forEach((date) => {
      params.append("filter_dates", formatDateToYYYYMMDD(date));
    });
  }

  if (request.filter_statuses && request.filter_statuses.length > 0) {
    request.filter_statuses.forEach((status) => {
      params.append("filter_statuses", status);
    });
  }

  const resp = await fetch(`http://127.0.0.1:8000/game?${params.toString()}`);

  return await resp.json();
}
