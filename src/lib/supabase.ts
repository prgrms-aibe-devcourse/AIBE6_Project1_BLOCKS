import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

// Strip stray dot from env if it exists
const cleanKey = supabasePublishableKey?.endsWith('.') 
  ? supabasePublishableKey.slice(0, -1) 
  : supabasePublishableKey

if (!supabaseUrl || !cleanKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, cleanKey)
