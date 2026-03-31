export interface PlanModalProps {
  isOpen: boolean
  mode: 'add' | 'edit'
  formData: {
    day: number
    start_time: string
    emd_time: string
    place: string
    contents: string
  }
  setFormData: (data: any) => void
  onSave: () => void
  onClose: () => void
}

export const PlanModal = ({
  isOpen,
  mode,
  formData,
  setFormData,
  onSave,
  onClose,
}: PlanModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
        <h3 className="text-xl font-bold mb-4 text-[#171717]">
          {mode === 'add' ? '일정 추가' : '일정 수정'} (DAY {formData.day})
        </h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-neutral-500 mb-1">
                시작 시간
              </label>
              <input
                type="time"
                className="w-full border border-[#ebebeb] rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary text-[#171717]"
                value={formData.start_time}
                onChange={(e) =>
                  setFormData({ ...formData, start_time: e.target.value })
                }
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-neutral-500 mb-1">
                종료 시간
              </label>
              <input
                type="time"
                className="w-full border border-[#ebebeb] rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary text-[#171717]"
                value={formData.emd_time}
                onChange={(e) =>
                  setFormData({ ...formData, emd_time: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-500 mb-1">
              장소명
            </label>
            <input
              type="text"
              className="w-full border border-[#ebebeb] rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary text-[#171717]"
              placeholder="예: 안동역"
              value={formData.place}
              onChange={(e) =>
                setFormData({ ...formData, place: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-500 mb-1">
              상세 내용
            </label>
            <textarea
              rows={3}
              className="w-full border border-[#ebebeb] rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary resize-none text-[#171717]"
              placeholder="일정 상세 내용을 적어주세요"
              value={formData.contents}
              onChange={(e) =>
                setFormData({ ...formData, contents: e.target.value })
              }
            />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-neutral-100 font-bold rounded-xl text-neutral-500 hover:bg-neutral-200 cursor-pointer"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onSave}
            className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark cursor-pointer"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  )
}
