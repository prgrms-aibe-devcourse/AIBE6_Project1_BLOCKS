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

export interface DbComment {
  comment_id: number
  created_at: string
  contents: string
  review_id: number
  parent_id: number | null
  like_count: number
  updated_at?: string | null
  user_id: string
  user: { user_name: string }[]
}
