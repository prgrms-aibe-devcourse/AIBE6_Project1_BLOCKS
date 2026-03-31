'use client'

import React, { useState, useEffect, useRef } from 'react'

interface KakaoMapModalProps {
  isOpen: boolean
  onClose: () => void
  onAddressSelect: (address: string) => void
  initialAddress?: string
}

export default function KakaoMapModal({
  isOpen,
  onClose,
  onAddressSelect,
  initialAddress = '',
}: KakaoMapModalProps) {
  const [address, setAddress] = useState(initialAddress)
  const [searchKeyword, setSearchKeyword] = useState('')
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstance = useRef<any>(null)
  const markerInstance = useRef<any>(null)

  useEffect(() => {
    if (isOpen && mapRef.current && window.kakao) {
      window.kakao.maps.load(() => {
        const mapContainer = mapRef.current
        const mapOption = {
          center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울시청 기준
          level: 3,
        }

        const map = new window.kakao.maps.Map(mapContainer, mapOption)
        const marker = new window.kakao.maps.Marker()
        const geocoder = new window.kakao.maps.services.Geocoder()

        mapInstance.current = map
        markerInstance.current = marker

        window.kakao.maps.event.addListener(
          map,
          'click',
          function (mouseEvent: any) {
            const latlng = mouseEvent.latLng
            marker.setPosition(latlng)
            marker.setMap(map)

            geocoder.coord2Address(
              latlng.getLng(),
              latlng.getLat(),
              (result: any, status: any) => {
                if (status === window.kakao.maps.services.Status.OK) {
                  const roadAddr = result[0].road_address?.address_name
                  const jibunAddr = result[0].address?.address_name
                  setAddress(roadAddr || jibunAddr || '') // 도로명 우선, 없으면 지번
                }
              },
            )
          },
        )
      })
    }

    if (!isOpen) {
      setSearchKeyword('')
    }
  }, [isOpen])

  const searchPlace = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!searchKeyword.trim()) return

    if (!window.kakao || !mapInstance.current) {
      alert('지도가 아직 로드되지 않았습니다.')
      return
    }

    const ps = new window.kakao.maps.services.Places()

    ps.keywordSearch(searchKeyword, (data: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
        const firstResult = data[0]
        const latlng = new window.kakao.maps.LatLng(
          firstResult.y,
          firstResult.x,
        )

        mapInstance.current.setCenter(latlng)
        markerInstance.current.setPosition(latlng)
        markerInstance.current.setMap(mapInstance.current)

        const addr = firstResult.road_address_name || firstResult.address_name
        setAddress(addr)
      } else {
        alert('해당 검색어에 대한 장소를 찾을 수 없습니다.')
      }
    })
  }

  const handleConfirm = () => {
    if (address) {
      onAddressSelect(address)
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-neutral-100">
          <h3 className="font-bold text-lg text-neutral-900">
            장소 추가하기
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-neutral-500 block">
              close
            </span>
          </button>
        </div>

        {/* 검색 UI */}
        <div className="p-4 bg-neutral-50 border-b border-neutral-100">
          <form onSubmit={searchPlace} className="flex gap-2 mb-3">
            <input
              type="text"
              className="flex-1 bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="예: 서울숲, 코엑스, 해운대해수욕장"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button
              type="submit"
              className="px-5 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shrink-0"
            >
              검색
            </button>
          </form>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <span className="text-sm text-neutral-500 break-all leading-relaxed">
              {address ? (
                <>
                  <span className="font-bold text-primary">
                    선택된 주소:
                  </span>{' '}
                  {address}
                </>
              ) : (
                '검색어로 장소를 찾거나 지도를 클릭해주세요.'
              )}
            </span>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-6 py-2.5 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors shrink-0"
            >
              {address ? '이 장소로 확인' : '닫기'}
            </button>
          </div>
        </div>

        {/* 지도 컨테이너 */}
        <div ref={mapRef} className="w-full h-[400px] md:h-[450px]" />
      </div>
    </div>
  )
}
