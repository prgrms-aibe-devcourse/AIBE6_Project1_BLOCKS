import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const rawKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  ''
const supabaseKey = rawKey.endsWith('.') ? rawKey.slice(0, -1) : rawKey
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { address, startDate, endDate, festival, preferences } = body

    let generated: any = null

    const geminiKey = process.env.GEMINI_API_KEY
    if (geminiKey) {
      // 1. Call Gemini LLM if key exists
      const prompt = `
당신은 최고의 여행 플래너입니다.
다음 조건에 맞게 여행 일정을 JSON 형식으로 작성해주세요.
출발지: ${address}
여행기간: ${startDate} ~ ${endDate}
방문할 축제: ${festival.title} (이 축제는 ${festival.date}에 방문하도록 일정을 짜주세요)
여행취향: 카테고리(${preferences?.category || '상관없음'}), 스타일(${preferences?.style || '상관없음'}), 동행자(${preferences?.companion || '상관없음'})

JSON 응답 형식:
{
  "title": "여행 제목 (예: 진해 벚꽃 커플 힐링 투어)",
  "distance": "예상 총 이동 거리 (예: 120km 공간 이동 거리만 km 단위로 적으세요.)",
  "confidence": "98% (이 플랜이 얼마나 완벽한지 100점 만점으로 표현하세요)",
  "plans": [
    { "day": 1, "start_time": "10:00", "end_time": "12:00", "place": "장소명", "contents": "일정 상세 내용" }
  ]
}
반드시 순수 JSON 텍스트만 출력하세요. 마크다운(\`\`\`json 등)은 제외하세요.
`
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        },
      )

      const aiData = await response.json()
      if (aiData.error) throw new Error(aiData.error.message)

      const textResp = aiData.candidates?.[0]?.content?.parts?.[0]?.text || ''
      const cleanJson = textResp
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim()

      try {
        generated = JSON.parse(cleanJson)
      } catch (e) {
        console.error('Failed to parse AI JSON:', cleanJson)
        throw new Error('AI returned invalid JSON')
      }
    } else {
      // 2. Fallback Mock Data if no API key
      console.log('No GEMINI_API_KEY found, using mock data for testing.')
      generated = {
        title: `${festival.title} 맞춤형 가이드`,
        distance: '45km',
        confidence: '99%',
        plans: [
          {
            day: 1,
            start_time: '09:00',
            end_time: '11:00',
            place: address,
            contents: '출발지 집결 및 여행 출발',
          },
          {
            day: 1,
            start_time: '12:00',
            end_time: '14:00',
            place: '축제 근처 맛집',
            contents: '점심 식사',
          },
          {
            day: 1,
            start_time: '14:00',
            end_time: '18:00',
            place: festival.title,
            contents: '축제 즐기기',
          },
          {
            day: 2,
            start_time: '10:00',
            end_time: '12:00',
            place: '주변 명소',
            contents: '근처 아름다운 경치 구경',
          },
          {
            day: 2,
            start_time: '13:00',
            end_time: '15:00',
            place: address,
            contents: '귀가',
          },
        ],
      }
    }

    // 3. Insert into DB "planner"
    // Postgres Date format relies on standardized date strings
    const { data: plannerData, error: plannerError } = await supabase
      .from('planner')
      .insert({
        title: generated.title,
        start_date: startDate,
        end_date: endDate,
        user_id: null, // auth.user() integration goes here when ready
        distance: generated.distance,
        confidence: generated.confidence,
      })
      .select('planner_id')
      .single()

    if (plannerError)
      throw new Error(`Planner DB Error: ${plannerError.message}`)
    const plannerId = plannerData.planner_id

    // 4. Insert into DB "plans"
    // We append a basic timestamp syntax for postgres `time with time zone` (e.g. "10:00:00+09")
    const formattedPlans = generated.plans.map((p: any) => ({
      planner_id: plannerId,
      day: p.day,
      start_time: `${p.start_time}:00+09:00`,
      emd_time: `${p.end_time}:00+09:00`, // Using db schema typo name `emd_time`
      place: p.place,
      contents: p.contents,
    }))

    const { error: plansError } = await supabase
      .from('plans')
      .insert(formattedPlans)

    if (plansError) throw new Error(`Plans DB Error: ${plansError.message}`)

    return NextResponse.json({ planner_id: plannerId })
  } catch (err: any) {
    console.error('API Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
