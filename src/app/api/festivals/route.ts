import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const rawKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  ''
const supabaseKey = rawKey.endsWith('.') ? rawKey.slice(0, -1) : rawKey
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryQuery = searchParams.get('category') || ''

    // 평점 높은 순으로 정렬
    let query = supabase
      .from('festivals')
      .select('*')
      .order('rating', { ascending: false, nullsFirst: false })

    const words = categoryQuery.split('/').filter(Boolean)

    if (words.length > 0) {
      // 슬래시로 구분된 단어 중 하나라도 option1에 포함되면 가져오기 (OR 조건)
      const orConditions = words
        .map((word) => `option1.ilike.%${word}%`)
        .join(',')

      query = query.or(orConditions)
    }

    const { data: festivals, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    // picture 경로를 Supabase Storage 공개 URL로 변환
    const festivalsWithUrls = (festivals ?? []).map((f) => {
      const pictureUrl = f.picture
        ? supabase.storage.from('festival').getPublicUrl(f.picture).data.publicUrl
        : null
      return { ...f, picture: pictureUrl }
    })

    return NextResponse.json({ festivals: festivalsWithUrls })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Festivals fetch error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
