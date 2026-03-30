// app/api/delete-account/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!  // 서버에서만 사용
)

export async function DELETE(request: Request) {
    const { userId } = await request.json()
    console.log('삭제 요청 userId:', userId)  // 확인용
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (error) {
        console.error('삭제 실패:', error.message)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
}