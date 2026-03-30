import { useState } from 'react'

export interface FestivalCardProps {
  festival_id: number
  title: string
  rating: number
  contents: string
  start_date: string
  end_date: string
  picture: string
  isSelected: boolean
  onSelect: (id: number) => void
  onDateChange?: (date: string) => void
}

export const FestivalCard = ({
  festival_id,
  title,
  rating,
  contents,
  start_date,
  end_date,
  picture,
  isSelected,
  onSelect,
  onDateChange,
}: FestivalCardProps) => {
  const start = new Date(start_date)
  const end = new Date(end_date)
  const options: { label: string; value: string }[] = []

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토']

  const currentDate = new Date(start)
  while (currentDate <= end) {
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const date = String(currentDate.getDate()).padStart(2, '0')
    const day = daysOfWeek[currentDate.getDay()]
    const yyyy = currentDate.getFullYear()
    
    options.push({
      label: `${month}.${date} (${day})`,
      value: `${yyyy}-${month}-${date}`
    })
    currentDate.setDate(currentDate.getDate() + 1)
  }

  const dateRange = `${start_date.split('-').slice(1).join('.')} - ${end_date.split('-').slice(1).join('.')}`

  const [selectedDate, setSelectedDate] = useState(options[0]?.value || '')

  return (
    <article
      className={`bg-white border border-[#D1D1D1] rounded-2xl overflow-hidden flex flex-col sm:flex-row group transition-all duration-300 ${isSelected ? 'ring-2 ring-[#f26565]' : 'hover:shadow-md'}`}
    >
      <div className="w-full sm:w-48 h-48 relative overflow-hidden bg-zinc-100 flex-shrink-0">
        {picture ? (
          <img
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            src={picture}
            alt={title}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400">
            <span className="material-symbols-outlined text-4xl mb-1">
              image_not_supported
            </span>
            <span className="text-xs">이미지 없음</span>
          </div>
        )}
        {isSelected && (
          <div className="absolute top-3 left-3 bg-primary px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-widest">
            Selected
          </div>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-on-surface">{title}</h3>
            <span
              className={`${isSelected ? 'text-primary' : 'text-on-surface-variant'} font-bold`}
            >
              {rating || '0.0'} ★
            </span>
          </div>
          <p className="text-on-surface-variant text-sm line-clamp-2 mb-4">
            {contents}
          </p>
          <div className="flex items-center text-sm text-on-surface-variant font-medium mb-4">
            <span className="material-symbols-outlined mr-2 text-primary">
              festival
            </span>
            <span>{dateRange}</span>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1.5">
            방문 예정 날짜 선택
          </label>
          <div className="relative">
            <select
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-[#D1D1D1] rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#f26565] focus:border-[#f26565] appearance-none"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value)
                if (onDateChange) {
                  onDateChange(e.target.value)
                }
              }}
            >
              {options.map((opt: any, idx: number) => (
                <option key={idx} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-lg">
              expand_more
            </span>
          </div>
        </div>
        <button
          onClick={() => onSelect(festival_id)}
          className={`mt-4 w-full py-3 rounded-full font-bold text-sm transition-all flex items-center justify-center cursor-pointer border border-primary ${
            isSelected
              ? 'bg-primary text-white'
              : 'bg-white text-primary hover:bg-primary hover:text-white'
          }`}
        >
          {isSelected && (
            <span
              className="material-symbols-outlined mr-2 text-lg"
              style={{ fontVariationSettings: '"FILL" 1' }}
            ></span>
          )}
          {isSelected ? '선택됨' : '선택하기'}
        </button>
      </div>
    </article>
  )
}
