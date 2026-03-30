'use client'
import { useParams } from 'next/navigation'
import FestivalForm from '@/components/festival/FestivalForm'

export default function ModifyFestaPage() {
  const { did } = useParams()
  return <FestivalForm festivalId={did} />
}
