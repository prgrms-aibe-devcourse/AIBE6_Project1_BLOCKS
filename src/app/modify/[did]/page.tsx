'use client'
import FestivalForm from '@/components/festival/FestivalForm'
import { useParams } from 'next/navigation'

export default function ModifyFestaPage() {
  const { did } = useParams()
  return <FestivalForm festivalId={did} />
}
