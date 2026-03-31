import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId, nickname, address } = await request.json()

    if (!userId || !nickname || !address) {
      return NextResponse.json(
        { error: '필수 항목이 누락되었습니다.' },
        { status: 400 },
      )
    }

    // Service Role Key를 사용하여 RLS를 우회하고 profile 생성
    // (이메일 확인 대기 상태에서도 안전하게 insert 가능)
    const { error } = await supabaseAdmin.from('profiles').insert({
      user_id: userId,
      nickname,
      address,
    })

    if (error) {
      console.error('[API /signup] Profile insert error:', error)
      return NextResponse.json(
        { error: '프로필 생성 중 오류가 발생했습니다.' },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('[API /signup] Unexpected error:', err)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 },
    )
  }
}
