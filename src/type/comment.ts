export interface Comment {
  id: string
  created_at: string
  content: string
  user_id: string
  review_id: string
  user_name: string
  like_count: number
  is_liked: boolean
  parent_id?: string
  replies?: Comment[]
}
