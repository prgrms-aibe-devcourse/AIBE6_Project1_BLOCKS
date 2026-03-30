export interface DayScheduleProps {
  dayNum: number
  dayPlans: any[]
  currentDayDate: Date
  isCollapsed: boolean
  toggleDay: (dayNum: number) => void
  handleOpenEdit: (plan: any) => void
  handleDelete: (planId: number) => void
  handleOpenAdd: (dayNum: number) => void
}

export const DaySchedule = ({
  dayNum,
  dayPlans,
  currentDayDate,
  isCollapsed,
  toggleDay,
  handleOpenEdit,
  handleDelete,
  handleOpenAdd,
}: DayScheduleProps) => {
  return (
    <div className="relative bg-white p-6 rounded-2xl shadow-sm border border-[#ebebeb]">
      <div
        className="flex items-center gap-4 cursor-pointer group"
        onClick={() => toggleDay(dayNum)}
      >
        <div className="bg-primary text-white w-16 h-16 rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-primary/20 shrink-0 transition-transform group-hover:scale-105">
          <span className="text-[10px] font-bold">DAY</span>
          <span className="text-2xl font-black">
            {String(dayNum).padStart(2, '0')}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#171717] group-hover:text-primary transition-colors">
            DAY {dayNum} 스케줄
          </h3>
          <p className="text-neutral-500 text-sm">
            {!isNaN(currentDayDate.getTime())
              ? `${currentDayDate.getFullYear()}년 ${currentDayDate.getMonth() + 1}월 ${currentDayDate.getDate()}일`
              : ''}
          </p>
        </div>
        <div className="ml-auto">
          <span className="material-symbols-outlined text-3xl text-neutral-300 group-hover:text-primary transition-colors">
            {isCollapsed ? 'expand_more' : 'expand_less'}
          </span>
        </div>
      </div>

      <div
        className={`transition-all duration-300 overflow-hidden ${
          isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[5000px] opacity-100 mt-8'
        }`}
      >
        <div className="space-y-6 relative ml-8 border-l-2 border-dashed border-[#ebebeb] pl-8 pb-4">
          {dayPlans.map((plan: any) => (
            <div
              key={plan.plan_id}
              className="bg-white p-5 rounded-xl border border-[#ebebeb] group hover:shadow-md hover:border-primary/30 transition-all duration-300 relative"
            >
              <div className="absolute -left-[41px] top-8 w-4 h-4 rounded-full bg-primary ring-4 ring-white"></div>
              
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-sm font-bold text-primary mb-1 block">
                      {plan.start_time
                        ? plan.start_time.substring(0, 5)
                        : ''}{' '}
                      -{' '}
                      {plan.emd_time
                        ? plan.emd_time.substring(0, 5)
                        : ''}
                    </span>
                    <h4 className="text-lg font-bold text-[#171717]">
                      {plan.place}
                    </h4>
                  </div>
                  <div className="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => handleOpenEdit(plan)}
                      className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-primary transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xl">
                        edit
                      </span>
                    </button>
                    <button
                      onClick={() => handleDelete(plan.plan_id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xl">
                        delete
                      </span>
                    </button>
                  </div>
                </div>

                {plan.contents && (
                  <div className="bg-[#fcfcfc] p-4 rounded-lg border border-neutral-100">
                    <p className="text-neutral-500 text-sm leading-relaxed whitespace-pre-wrap">
                      {plan.contents}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={() => handleOpenAdd(dayNum)}
            className="flex items-center gap-2 px-6 py-4 rounded-xl border-2 border-dashed border-primary/30 text-primary font-bold w-full justify-center hover:bg-primary/5 transition-colors group cursor-pointer"
          >
            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
              add_circle
            </span>
            일정 추가하기
          </button>
        </div>
      </div>
    </div>
  )
}
