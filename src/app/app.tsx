'use client'
import { supabase } from '@/app/supabse/supabse'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import FormMain from '@/components/Form/FormMain'
import FestaList from '@/components/List/FestaList'

function App() {
  const [festivalName, setFestivalName] = useState<
    {
      id: number
      created_at: string
      option1: string
      content: string
      title: string
      fsd: string
      ffd: string
      dl: string
      fname: string
      uid: number
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
    if (op1 != '모두') {
      const { data, error } = await supabase
        .from('festivals')
        .select('*')
        .gte('ffd', datel)
        .lte('fsd', datel)
        .like('option1', `%${op1}%`)
        .like('dl', `%${loc}%`)
        .like('fname', `%${ffname}%`)
      if (error) {
        console.log(error)
      } else {
        setFestivalName(data)
      }
    } else {
      const { data, error } = await supabase
        .from('festivals')
        .select('*')
        .gte('ffd', datel)
        .lte('fsd', datel)
        .like('dl', `%${loc}%`)
        .like('fname', `%${ffname}%`)
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
