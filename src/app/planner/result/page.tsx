export default function Result() {
  return (
    <>
      <main className="pt-24 pb-32 px-4 max-w-7xl mx-auto">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-container rounded-full mb-4">
            <span
              className="material-symbols-outlined text-[#ff7676] text-sm"
              style={{ fontVariationSettings: 'FILL' }}
            >
              auto_awesome
            </span>
            <span className="text-on-secondary-container text-xs font-bold tracking-wider uppercase">
              AI Recommendation
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
            AI가 추천하는 <br className="md:hidden" />{' '}
            <span className="text-[#ff7676]">최적의 여행 플랜</span>
          </h1>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-xl border border-outline-variant shadow-sm sticky top-28">
              <div className="aspect-[4/3] rounded-lg overflow-hidden mb-6">
                <img
                  alt="vibrant traditional korean festival with colorful lanterns"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZqv8pgUBfv4NQ68r894LVsw56erH8K-EQ7-THJ8Am4RpqqmbJA_t7yLCeVbG5KH9GkkGTsxtVEbVD290epNvzgfrxICy7mpkE5hBmaJtno4WGWHUcO81jw3-_YsWUpElwXdgBs45KFtwdI5i-MA-iZZfy-yKOyvxEyMQ_6IHmFq8EWtnKnzlaL8sG8qomhmnoWEqMc3NnNt8lhg_6-rhERoemQzlEQpqwkgqYZuIYwOOaSBDYYfF_QnJ2rT0G9CtR6M5tgL0F03w"
                />
              </div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff7676]">
                  event_available
                </span>
                여행 요약
              </h2>
              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-on-surface/40 uppercase tracking-widest">
                    출발지
                  </span>
                  <span className="text-lg font-semibold">서울역 (KTX)</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-on-surface/40 uppercase tracking-widest">
                    선택한 축제
                  </span>
                  <span className="text-lg font-semibold text-[#ff7676]">
                    안동 국제 탈춤 페스티벌
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-on-surface/40 uppercase tracking-widest">
                    기간
                  </span>
                  <span className="text-lg font-semibold">
                    2024. 10. 02 - 10. 04 (2박 3일)
                  </span>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-outline-variant">
                <div className="flex items-center justify-between text-on-surface/60 mb-4">
                  <span className="text-sm">예상 이동 거리</span>
                  <span className="font-bold">245 km</span>
                </div>
                <div className="flex items-center justify-between text-on-surface/60">
                  <span className="text-sm">AI 신뢰도</span>
                  <span className="font-bold text-[#ff7676]">98%</span>
                </div>
              </div>
            </div>
          </aside>
          <section className="lg:col-span-8 space-y-12">
            <div className="relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-[#ff7676] text-on-[#ff7676] w-16 h-16 rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-[#ff7676]/20">
                  <span className="text-[10px] font-bold">DAY</span>
                  <span className="text-2xl font-black">01</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">축제의 시작, 안동으로</h3>
                  <p className="text-on-surface/60 text-sm">
                    2024년 10월 2일 수요일
                  </p>
                </div>
              </div>
              <div className="space-y-6 relative ml-8 border-l-2 border-dashed border-outline-variant pl-8">
                <div className="bg-white p-6 rounded-xl border border-outline-variant group hover:shadow-md transition-shadow duration-300 relative">
                  <div className="absolute -left-[41px] top-8 w-4 h-4 rounded-full bg-[#ff7676] ring-4 ring-surface"></div>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <span className="text-sm font-bold text-[#ff7676] mb-1 block">
                        10:00 AM
                      </span>
                      <h4 className="text-lg font-bold mb-2">서울역 출발</h4>
                      <p className="text-on-surface/60 text-sm leading-relaxed">
                        KTX-이음 701열차를 이용하여 안동역으로 이동합니다. 차창
                        밖 풍경을 즐겨보세요.
                      </p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-surface rounded-lg text-on-surface/40">
                        <span className="material-symbols-outlined text-xl">
                          edit
                        </span>
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg text-red-400">
                        <span className="material-symbols-outlined text-xl">
                          delete
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-outline-variant group hover:shadow-md transition-shadow duration-300 relative">
                  <div className="absolute -left-[41px] top-8 w-4 h-4 rounded-full bg-[#ff7676] ring-4 ring-surface"></div>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <span className="text-sm font-bold text-[#ff7676] mb-1 block">
                        01:30 PM
                      </span>
                      <h4 className="text-lg font-bold mb-2">
                        안동 찜닭 골목 중식
                      </h4>
                      <p className="text-on-surface/60 text-sm leading-relaxed">
                        안동 구시장에서 정통 안동 찜닭으로 든든한 점심 식사를
                        합니다. 매콤달콤한 맛이 일품입니다.
                      </p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-surface rounded-lg text-on-surface/40">
                        <span className="material-symbols-outlined text-xl">
                          edit
                        </span>
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg text-red-400">
                        <span className="material-symbols-outlined text-xl">
                          delete
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-outline-variant group hover:shadow-md transition-shadow duration-300 relative">
                  <div className="absolute -left-[41px] top-8 w-4 h-4 rounded-full bg-[#ff7676] ring-4 ring-surface"></div>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <span className="text-sm font-bold text-[#ff7676] mb-1 block">
                        03:30 PM
                      </span>
                      <h4 className="text-lg font-bold mb-2">
                        탈춤공원 축제장 관람
                      </h4>
                      <p className="text-on-surface/60 text-sm leading-relaxed">
                        국제 탈춤 페스티벌 메인 행사장 관람. 세계 각국의 탈춤
                        공연과 체험 부스를 즐깁니다.
                      </p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-surface rounded-lg text-on-surface/40">
                        <span className="material-symbols-outlined text-xl">
                          edit
                        </span>
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg text-red-400">
                        <span className="material-symbols-outlined text-xl">
                          delete
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-6 py-4 rounded-xl border-2 border-dashed border-[#ff7676]/30 text-[#ff7676] font-bold w-full justify-center hover:bg-[#ff7676]/5 transition-colors">
                  <span className="material-symbols-outlined">add_circle</span>
                  일정 추가하기
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-white text-on-surface/40 border border-outline-variant w-16 h-16 rounded-2xl flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold">DAY</span>
                  <span className="text-2xl font-black">02</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">전통의 숨결 속으로</h3>
                  <p className="text-on-surface/60 text-sm">
                    2024년 10월 3일 목요일
                  </p>
                </div>
              </div>
              <div className="space-y-6 relative ml-8 border-l-2 border-dashed border-outline-variant pl-8">
                <div className="bg-white p-6 rounded-xl border border-outline-variant group hover:shadow-md transition-shadow duration-300 relative">
                  <div className="absolute -left-[41px] top-8 w-4 h-4 rounded-full bg-on-surface/20 ring-4 ring-surface"></div>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <span className="text-sm font-bold text-[#ff7676] mb-1 block">
                        09:00 AM
                      </span>
                      <h4 className="text-lg font-bold mb-2">하회마을 산책</h4>
                      <p className="text-on-surface/60 text-sm leading-relaxed">
                        유네스코 세계문화유산 하회마을을 여유롭게 산책하며
                        한옥의 아름다움을 만끽합니다.
                      </p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-surface rounded-lg text-on-surface/40">
                        <span className="material-symbols-outlined text-xl">
                          edit
                        </span>
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg text-red-400">
                        <span className="material-symbols-outlined text-xl">
                          delete
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-6 py-4 rounded-xl border-2 border-dashed border-[#ff7676]/30 text-[#ff7676] font-bold w-full justify-center hover:bg-[#ff7676]/5 transition-colors">
                  <span className="material-symbols-outlined">add_circle</span>
                  일정 추가하기
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
      <footer className="fixed bottom-0 left-0 w-full z-40 bg-white/90 backdrop-blur-xl border-t border-outline-variant p-4 md:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="hidden md:flex items-center gap-4">
            <div className="flex -space-x-3">
              <img
                alt="user profile"
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwcvkbsNeY8W8v2wzhCR1UtdbwRBt4f-WQDjxZsU1FqxAvXDc8EbgZm6DreHBfymxci30fsHq9mlG2AZv040EaVnVsy8dFnRh1KGmJyzcqJgsZYDBvHgsI7dXqD6NuDPTkp9osw05y_rHEoJdwYg3pB-WmibIvVgYTFxS3gKzWW8iqoughic3Ym4yMWIofgcRPNDrw53pQafM01C2zNdgFL4fBJ1_AVN3gnp-5hdWrLrcChj_R7ddDLY-i1I7Sy_FkPN3W-QvDLbw"
              />
              <img
                alt="user profile"
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCe83anknyZOdTv94kbKkVsnmc3-MnHjyCfimvyYTw0TqB23nD0SNB7fHjGS6GqhMtoy11JOAWOQwZMWi-9FeyslTa0lXS0Sw1wgzSpgsb-L1aooQ--ecMHYqChra7f7siJss8TGEdMXb0IukDJfFeiKve9RoNPMc85ytSkEER07PDU1GPWkwd748Q6ypy6BzUEe6F6duDtt4fjBeGB_AIBCh5i6D5o37oC9Bj-0I-Ds46M-y15IInApcCUI8iFMuEpm-sGQIMQbkw"
              />
              <div className="w-10 h-10 rounded-full bg-surface border-2 border-white flex items-center justify-center text-xs font-bold text-on-surface/60">
                +12
              </div>
            </div>
            <p className="text-sm text-on-surface/60">
              <span className="font-bold text-on-surface">14명</span>이 이
              플랜을 함께 검토하고 있습니다.
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-8 py-4 bg-surface text-on-surface font-bold rounded-full border border-outline-variant hover:bg-outline-variant transition-colors">
              공유하기
            </button>
            <button className="flex-1 md:flex-none px-12 py-4 bg-[#ff7676] text-on-[#ff7676] font-bold rounded-full shadow-lg shadow-[#ff7676]/30 hover:opacity-90 active:scale-95 transition-all">
              플랜 저장하기
            </button>
          </div>
        </div>
      </footer>
    </>
  )
}
