'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

function FormMain({
  onSubmit,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}) {
  const router = useRouter()
  useEffect(() => {
    const now = new Date()
    // 한국 시간: const now = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);

    // 2. YYYY-MM-DD 형식으로 변환
    const today = now.toISOString().split('T')[0]

    // 3. input 요소의 value 설정
    const dateInput = document.getElementById('Festadate') as HTMLInputElement
    if (dateInput) {
      dateInput.value = today
    }
  }, [])

  const addFesta = () => {
    router.push('/add')
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="flex">
          <input
            type="text"
            id="festivalName"
            placeholder="축제이름을 입력하세요"
            className="border border-black"
          />
          <button>검색</button>
        </div>
        <div className="flex">
          <select id="themeitems" name="items" className="border border-black">
            <option value="모두">모두</option>
            <option value="음악">음악</option>
            <option value="꽃">꽃</option>
            <option value="동물">동물</option>
            <option value="음식">음식</option>
            <option value="문화">문화</option>
            <option value="레저">레저</option>
            <option value="과학">과학</option>
            <option value="종교">종교</option>
          </select>
          <input
            type="text"
            id="FestaLocation"
            placeholder="지역을 입력하세요"
            className="border border-black"
          />
          <input type="date" id="Festadate" className="border border-black" />
        </div>
        <button onClick={addFesta}>축제 추가</button>
      </form>
    </>
  )
}

export default FormMain
