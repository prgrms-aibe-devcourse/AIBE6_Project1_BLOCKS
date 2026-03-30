export interface PlanSummaryCardProps {
  planner: any
  totalDays: number
}

export const PlanSummaryCard = ({ planner, totalDays }: PlanSummaryCardProps) => {
  return (
    <div className="bg-white p-8 rounded-xl border border-[#ebebeb] shadow-sm sticky top-28">
      <div className="aspect-[4/3] rounded-lg overflow-hidden mb-6">
        <img
          alt="선택한 축제 이미지"
          className="w-full h-full object-cover"
          src={
            planner.pictureUrl ||
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBZqv8pgUBfv4NQ68r894LVsw56erH8K-EQ7-THJ8Am4RpqqmbJA_t7yLCeVbG5KH9GkkGTsxtVEbVD290epNvzgfrxICy7mpkE5hBmaJtno4WGWHUcO81jw3-_YsWUpElwXdgBs45KFtwdI5i-MA-iZZfy-yKOyvxEyMQ_6IHmFq8EWtnKnzlaL8sG8qomhmnoWEqMc3NnNt8lhg_6-rhERoemQzlEQpqwkgqYZuIYwOOaSBDYYfF_QnJ2rT0G9CtR6M5tgL0F03w'
          }
        />
      </div>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[#171717]">
        <span className="material-symbols-outlined text-primary">
          event_available
        </span>
        여행 요약
      </h2>
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
            여행 제목
          </span>
          <span className="text-lg font-semibold text-[#171717]">
            {planner.title}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
            선택 범위
          </span>
          <span className="text-lg font-semibold text-primary">
            AI 커스텀 플랜
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
            기간
          </span>
          <span className="text-lg font-semibold text-[#171717]">
            {planner.start_date && planner.end_date
              ? `${planner.start_date.replace(/-/g, '.')} - ${planner.end_date.replace(/-/g, '.')} (${totalDays - 1}박 ${totalDays}일)`
              : '날짜 미지정'}
          </span>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-[#ebebeb]">
        <div className="flex items-center justify-between text-neutral-500 mb-4">
          <span className="text-sm">예상 이동 거리</span>
          <span className="font-bold text-[#171717]">
            {planner.distance || '0km'}
          </span>
        </div>
        <div className="flex items-center justify-between text-neutral-500">
          <span className="text-sm">AI 신뢰도</span>
          <span className="font-bold text-primary">
            {planner.confidence || '98%'}
          </span>
        </div>
      </div>
    </div>
  )
}
