'use client'
import React, { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

// window.kakao 인식 설정
declare global {
  interface Window {
    kakao: any
  }
}

interface MapContainerProps {
  address: string // 상세주소 props
}

export default function MapContainer({ address }: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!window.kakao || !mapRef.current) return

    window.kakao.maps.load(() => {
      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(37.5665, 126.978),
        level: 3,
      })
      const geocoder = new window.kakao.maps.services.Geocoder()

      geocoder.addressSearch(address, (result: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x)

          // 결과값으로 받은 위치를 마커로 표시
          const marker = new window.kakao.maps.Marker({
            map: map,
            position: coords,
          })
          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="width:150px;text-align:center;padding:6px 0;">${address}</div>`,
          })
          infowindow.open(map, marker)

          // 지도의 중심을 결과값으로 받은 위치로 이동
          map.setCenter(coords)
        } else {
          console.error('주소 검색 실패:', status)
        }
      })
    })
  }, [])

  return <div ref={mapRef} style={{ width: '100%', height: '256' }} />
}
