import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing Supabase admin environment variables')
}

/**
 * 서버 전용 Admin 클라이언트 (Service Role Key 사용)
 * RLS를 우회하므로 반드시 서버 사이드(Route Handlers, Server Actions)에서만 사용할 것.
 * 클라이언트 컴포넌트에 절대 노출하지 말 것.
 */
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
