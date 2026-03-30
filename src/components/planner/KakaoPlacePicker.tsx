'use client'

import { useEffect, useRef, useState } from 'react'

interface PlaceResult {
  place_name: string
  road_address_name: string
  address_name: string
  x: string // longitude
  y: string // latitude
}

interface KakaoPlacePickerProps {
  onSelect: (placeName: string, lat: number, lng: number) => void
  selectedPlace: string
}

declare global {
  interface Window {
    kakao: any
  }
}

export default function KakaoPlacePicker({
  onSelect,
  selectedPlace,
}: KakaoPlacePickerProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PlaceResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [sdkReady, setSdkReady] = useState(false)
  const [selectedInfo, setSelectedInfo] = useState<PlaceResult | null>(null)

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const loadingRef = useRef(false)

  const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY

  // SDK 로딩 — autoload=false + kakao.maps.load() 콜백 안에서 ready 처리
  useEffect(() => {
    if (!kakaoKey || kakaoKey === '여기에_카카오_JavaScript키_입력') return
    if (sdkReady) return
    if (loadingRef.current) return

    // 이미 kakao.maps.services가 준비된 경우
    if (window.kakao?.maps?.services?.Places) {
      setSdkReady(true)
      return
    }

    // kakao 객체는 있지만 아직 load() 미호출인 경우
    if (window.kakao?.maps && !window.kakao.maps.services) {
      loadingRef.current = true
      window.kakao.maps.load(() => {
        loadingRef.current = false
        setSdkReady(true)
      })
      return
    }

    // 스크립트 자체가 없는 경우 동적 삽입
    loadingRef.current = true
    const existing = document.querySelector(
      `script[src*="dapi.kakao.com/v2/maps/sdk.js"]`,
    )
    if (existing) {
      // 스크립트는 있는데 kakao가 아직 없음 — load 이벤트 대기
      existing.addEventListener('load', () => {
        window.kakao.maps.load(() => {
          loadingRef.current = false
          setSdkReady(true)
        })
      })
      return
    }

    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&libraries=services&autoload=false`
    script.async = true
    script.onload = () => {
      window.kakao.maps.load(() => {
        loadingRef.current = false
        setSdkReady(true)
      })
    }
    document.head.appendChild(script)
  }, [kakaoKey, sdkReady])

  // 지도 렌더링 — selectedInfo 변경 시
  useEffect(() => {
    if (!sdkReady || !selectedInfo || !mapRef.current) return

    const lat = parseFloat(selectedInfo.y)
    const lng = parseFloat(selectedInfo.x)
    const latlng = new window.kakao.maps.LatLng(lat, lng)

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, {
        center: latlng,
        level: 4,
      })
    } else {
      mapInstanceRef.current.setCenter(latlng)
    }

    if (markerRef.current) markerRef.current.setMap(null)

    markerRef.current = new window.kakao.maps.Marker({
      position: latlng,
      map: mapInstanceRef.current,
    })
  }, [sdkReady, selectedInfo])

  const handleSearch = () => {
    if (!query.trim()) return

    // 안전 체크
    if (!sdkReady || !window.kakao?.maps?.services?.Places) {
      alert('카카오 지도가 아직 로딩 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }

    setIsSearching(true)
    const ps = new window.kakao.maps.services.Places()
    ps.keywordSearch(query, (data: PlaceResult[], status: string) => {
      setIsSearching(false)
      if (status === window.kakao.maps.services.Status.OK) {
        setResults(data.slice(0, 6))
        setShowResults(true)
      } else {
        setResults([])
        setShowResults(true)
      }
    })
  }

  const handleSelect = (place: PlaceResult) => {
    setSelectedInfo(place)
    setShowResults(false)
    setQuery(place.place_name)
    onSelect(place.place_name, parseFloat(place.y), parseFloat(place.x))
  }

  if (!kakaoKey || kakaoKey === '여기에_카카오_JavaScript키_입력') {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
        <p className="font-bold mb-1">⚠️ 카카오 지도 API 키 필요</p>
        <p className="text-xs">
          <code>.env.local</code>에 <code>NEXT_PUBLIC_KAKAO_MAP_KEY</code>를
          설정해주세요.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* 검색 입력 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={
            sdkReady ? '출발지 장소를 검색하세요' : '지도 로딩 중...'
          }
          disabled={!sdkReady}
          className="flex-1 px-4 py-3 bg-[#F4F4F4] border-0 rounded-xl focus:ring-2 focus:ring-primary text-sm font-medium transition-all outline-none disabled:opacity-60"
        />
        <button
          onClick={handleSearch}
          disabled={isSearching || !sdkReady}
          className="px-4 py-3 bg-primary text-white rounded-xl text-sm font-bold flex items-center gap-1 hover:bg-[#d94f4f] transition-all disabled:opacity-50 flex-shrink-0"
        >
          <span className="material-symbols-outlined text-base">search</span>
          {isSearching ? '...' : '검색'}
        </button>
      </div>

      {/* 검색 결과 */}
      {showResults && (
        <div className="border border-[#D1D1D1] rounded-xl overflow-hidden shadow-sm">
          {results.length === 0 ? (
            <div className="p-4 text-center text-sm text-zinc-400">
              검색 결과가 없습니다.
            </div>
          ) : (
            <ul className="divide-y divide-[#F0F0F0] max-h-52 overflow-y-auto">
              {results.map((place, i) => (
                <li
                  key={i}
                  onClick={() => handleSelect(place)}
                  className="px-4 py-3 hover:bg-primary/5 cursor-pointer transition-colors"
                >
                  <p className="text-sm font-bold text-on-surface">
                    {place.place_name}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {place.road_address_name || place.address_name}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* 선택된 장소 표시 */}
      {selectedInfo && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 rounded-xl">
            <span className="material-symbols-outlined text-primary text-base">
              location_on
            </span>
            <div>
              <p className="text-sm font-bold text-primary">
                {selectedInfo.place_name}
              </p>
              <p className="text-xs text-zinc-500">
                {selectedInfo.road_address_name || selectedInfo.address_name}
              </p>
            </div>
          </div>
          {/* 지도 영역 */}
          <div
            ref={mapRef}
            className="w-full h-48 rounded-xl overflow-hidden border border-[#D1D1D1]"
          />
        </div>
      )}

      {/* 아직 선택 전이지만 기존 값이 있을 때 */}
      {!selectedInfo && selectedPlace && (
        <p className="text-xs text-zinc-500 px-1">
          현재 출발지: <span className="font-bold">{selectedPlace}</span>
        </p>
      )}
    </div>
  )
}
