'use client'
import { supabase } from '@/app/supabse/supabse'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import FormMain from '@/components/Form/FormMain'
import FestaList from '@/components/List/FestaList'

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
    const newDate = new Date(ddate)
    const datel = newDate.toISOString()
    if (op1 != '모두' && loc != '모두') {
      const { data, error } = await supabase
        .from('festivals')
        .select('*')
        .gte('end_date', datel)
        .lte('start_date', datel)
        .like('option1', `%${op1}%`)
        .like('option2', `%${loc}%`)
        .like('title', `%${ffname}%`)
      if (error) {
        console.log(error)
      } else {
        setFestivalName(data)
      }
    } else if (op1 != '모두' && loc == '모두') {
      const { data, error } = await supabase
        .from('festivals')
        .select('*')
        .gte('end_date', datel)
        .lte('start_date', datel)
        .like('option1', `%${op1}%`)
        .like('title', `%${ffname}%`)
      if (error) {
        console.log(error)
      } else {
        setFestivalName(data)
      }
    } else if (op1 == '모두' && loc != '모두') {
      const { data, error } = await supabase
        .from('festivals')
        .select('*')
        .gte('end_date', datel)
        .lte('start_date', datel)
        .like('option2', `${loc}%`)
        .like('title', `%${ffname}%`)
      if (error) {
        console.log(error)
      } else {
        setFestivalName(data)
      }
    } else if (op1 == '모두' && loc == '모두') {
      const { data, error } = await supabase
        .from('festivals')
        .select('*')
        .gte('end_date', datel)
        .lte('start_date', datel)
        .like('title', `%${ffname}%`)
      if (error) {
        console.log(error)
      } else {
        setFestivalName(data)
      }
    }
  }
  useEffect(() => {
    selectFesta()
  }, [])
  const FestivalListForm = () => {
    setFestivalName(festivalName)
  }

  return (
    <>
      <FormMain onSubmit={onSubmit} />
      <FestaList
        FestivalListForm={FestivalListForm}
        festivalName={festivalName}
      />
    </>
  )
}

export default App
