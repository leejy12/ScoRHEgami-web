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
