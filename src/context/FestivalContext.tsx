'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react'

export type Festival = {
  name: string
  theme: string
  loc: string
  date: string
}

type FestivalContextType = {
  festivalName: Festival[]
  setFestivalName: React.Dispatch<React.SetStateAction<Festival[]>>
}

const FestivalContext = createContext<FestivalContextType | undefined>(undefined)

export function FestivalProvider({ children }: { children: ReactNode }) {
  const [festivalName, setFestivalName] = useState<Festival[]>([])

  return (
    <FestivalContext.Provider value={{ festivalName, setFestivalName }}>
      {children}
    </FestivalContext.Provider>
  )
}

export function useFestival() {
  const context = useContext(FestivalContext)
  if (context === undefined) {
    throw new Error('useFestival must be used within a FestivalProvider')
  }
  return context
}
