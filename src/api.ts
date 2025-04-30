import { GameGetResponse, GameStatusEnum } from "./scorhegami";

function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // +1 because months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export async function getGames(
  game_dates: Date[] | null,
  filter_statuses: GameStatusEnum[] | null
): Promise<GameGetResponse[]> {
  const params = new URLSearchParams();
  params.append("offset", "0");
  params.append("count", "30");

  if (game_dates !== null) {
    game_dates.forEach((game_date) => {
      params.append("filter_dates", formatDateToYYYYMMDD(game_date));
    });
  }

  if (filter_statuses !== null) {
    filter_statuses.forEach((game_status) => {
      params.append("filter_statuses", game_status);
    });
  }

  const resp = await fetch(`http://127.0.0.1:8000/game?${params.toString()}`);

  return await resp.json();
}
