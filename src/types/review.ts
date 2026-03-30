import { Profile } from "./profile";

export interface Review {
  id: number;
  festival_id: number;
  user_id : string;
  contents: string;
  pictures?: string[] | null;
  like_count: number;
  rating: number;        // 1 ~ 5
  created_at: string;

  author: Profile;
  comments?: Comment[];
}