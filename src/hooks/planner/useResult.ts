import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/providers/AuthProvider'

export function useResult() {
  const searchParams = useSearchParams()
  const plannerId = searchParams.get('id')
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [planner, setPlanner] = useState<any>(null)
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  const fetchLock = useRef(false)

  // Folding State
  const [collapsedDays, setCollapsedDays] = useState<number[]>([])

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [editingPlan, setEditingPlan] = useState<any>(null)
  const [formData, setFormData] = useState({
    day: 1,
    start_time: '10:00',
    emd_time: '12:00',
    place: '',
    contents: '',
  })

  useEffect(() => {
    if (!plannerId) return
    if (fetchLock.current) return
    
    fetchLock.current = true
    fetchData().finally(() => {
      fetchLock.current = false
    })
  }, [plannerId])

  useEffect(() => {
    if (authLoading || loading || !planner) return
    
    if (planner.user_id !== user?.id) {
      alert('본인이 생성한 플랜만 조회할 수 있습니다.')
      router.replace('/')
    }
  }, [planner, user, authLoading, loading, router])

  const fetchData = async () => {
    try {
      setLoading(true)
      setErrorMsg('')

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Supabase request timed out after 8s')), 8000)
      )

      const fetchPromise = async () => {
        const fetchWithRetry = async (queryFn: () => any, retries = 2) => {
          for (let i = 0; i < retries; i++) {
            const res = await queryFn()
            if (res.error?.message?.includes('stole it') || res.error?.message?.includes('Lock')) {
              await new Promise(r => setTimeout(r, 400 * (i + 1)))
              continue
            }
            return res
          }
          return await queryFn()
        }

        const pRes = await fetchWithRetry(() => supabase
          .from('planner')
          .select('*')
          .eq('planner_id', plannerId)
          .single()
        )
        
        if (pRes.error) throw new Error(`Planner fetch error: ${pRes.error.message || JSON.stringify(pRes.error)}`)

        const plannerData = pRes.data

        if (plannerData.festival_id) {
          const fRes = await fetchWithRetry(() => supabase
            .from('festivals')
            .select('picture')
            .eq('festival_id', plannerData.festival_id)
            .single()
          )
          
          if (!fRes.error && fRes.data?.picture) {
            plannerData.pictureUrl = supabase.storage.from('festival').getPublicUrl(fRes.data.picture).data.publicUrl
          }
        }

        const plRes = await fetchWithRetry(() => supabase
          .from('plans')
          .select('*')
          .eq('planner_id', plannerId)
          .order('day')
          .order('start_time')
        )

        if (plRes.error) throw new Error(`Plans fetch error: ${plRes.error.message || JSON.stringify(plRes.error)}`)

        return { plannerData, plansData: plRes.data }
      }

      const { plannerData, plansData }: any = await Promise.race([fetchPromise(), timeoutPromise])

      setPlanner(plannerData)
      setPlans(plansData || [])
    } catch (error: any) {
      console.error('Error fetching data:', error)
      setErrorMsg(error.message)
      setPlanner(null)
      setPlans([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (planId: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    const { error } = await supabase.from('plans').delete().eq('plan_id', planId)
    if (error) {
      console.error('Delete error:', error)
      alert(`삭제 중 오류가 발생했습니다: ${error.message}`)
      return
    }
    fetchData()
  }

  const handleOpenAdd = (day: number) => {
    setModalMode('add')
    setFormData({
      day,
      start_time: '12:00',
      emd_time: '13:00',
      place: '',
      contents: '',
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (plan: any) => {
    setModalMode('edit')
    setEditingPlan(plan)
    const st = plan.start_time ? plan.start_time.substring(0, 5) : ''
    const et = plan.emd_time ? plan.emd_time.substring(0, 5) : ''
    setFormData({
      day: plan.day,
      start_time: st,
      emd_time: et,
      place: plan.place,
      contents: plan.contents,
    })
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.place) return alert('장소명을 입력해주세요.')

    const { day, start_time, emd_time, place, contents } = formData
    const formattedStart = `${start_time}:00+09:00`
    const formattedEnd = `${emd_time}:00+09:00`

    if (modalMode === 'add') {
      const { error } = await supabase.from('plans').insert({
        planner_id: plannerId,
        day,
        start_time: formattedStart,
        emd_time: formattedEnd,
        place,
        contents,
      })
      if (error) {
        console.error('Insert error:', error)
        alert(`추가 중 오류가 발생했습니다: ${error.message}`)
        return
      }
    } else {
      const { error } = await supabase
        .from('plans')
        .update({
          day,
          start_time: formattedStart,
          emd_time: formattedEnd,
          place,
          contents,
        })
        .eq('plan_id', editingPlan.plan_id)
      if (error) {
        console.error('Update error:', error)
        alert(`수정 중 오류가 발생했습니다: ${error.message}`)
        return
      }
    }

    setIsModalOpen(false)
    fetchData()
  }

  const toggleDay = (dayNum: number) => {
    setCollapsedDays((prev) =>
      prev.includes(dayNum) ? prev.filter((d) => d !== dayNum) : [...prev, dayNum]
    )
  }

  return {
    plannerId,
    planner,
    plans,
    loading,
    errorMsg,
    isModalOpen,
    setIsModalOpen,
    modalMode,
    formData,
    setFormData,
    collapsedDays,
    toggleDay,
    handleSave,
    handleOpenAdd,
    handleOpenEdit,
    handleDelete
  }
}
