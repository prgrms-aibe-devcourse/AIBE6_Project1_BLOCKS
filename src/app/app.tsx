'use client'
import FormMain from '@/components/Form/FormMain'
import FestaList from '@/components/List/FestaList'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

function App() {
  const [festivalName, setFestivalName] = useState<
    {
      festival_id: number
      created_at: string
      option1: string
      contents: string
      title: string
      start_date: string
      end_date: string
      address: string
      option2: string
      user_id: string
      rating: number
      picture: string
    }[]
  >([])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    selectjoinFesta(
      e.currentTarget.Festadate.value,
      e.currentTarget.themeitems.value,
      e.currentTarget.FestaLocation.value,
      e.currentTarget.festivalName.value,
    )
  }

  const selectAllFesta = async (fes: any) => {
    const { data: festivalName, error } = await supabase
      .from('festivals')
      .select('*')
    if (error) {
      console.log(error)
    } else {
      setFestivalName(festivalName)
      return festivalName
    }
  }
  const selectFesta = async () => {
    const { data: festivalName, error } = await supabase
      .from('festivals')
      .select('*')
    if (error) {
      console.log(error)
    } else {
      setFestivalName(festivalName)
    }
  }
  const selectjoinFesta = async (
    ddate: string,
    op1: string,
    loc: string,
    ffname: string,
  ) => {
    let query = supabase.from('festivals').select('*')

    // 날짜 조건: 입력한 날짜가 축제 기간 안에 포함되도록
    if (ddate) {
      query = query.gte('end_date', ddate).lte('start_date', ddate)
    }

    // 테마 조건
    if (op1 && op1 !== '모두') {
      query = query.like('option1', `%${op1}%`)
    }

    // 지역 조건
    if (loc && loc !== '모두') {
      query = query.like('option2', `%${loc}%`)
    }

    // 제목 조건
    if (ffname) {
      query = query.like('title', `%${ffname}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error(error)
    } else {
      setFestivalName(data || [])
    }
  }
  useEffect(() => {
    selectFesta()
  }, [])
  const FestivalListForm = () => {
    selectFesta()
  }

  return (
    <>
      <FormMain onSubmit={onSubmit} />
      <FestaList
        FestivalListForm={FestivalListForm}
        festivalName={festivalName}
        selectAllFesta={selectFesta}
      />
    </>
  )
}

export default App
