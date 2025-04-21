// ✅ pages/recommend.tsx – ดึงอารมณ์ล่าสุดจาก Firestore
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore'
import { db } from '../lib/firebase'

type Recommendation = {
  mood: string
  quote: string
  song: string
}

const moodMap: Record<string, Recommendation> = {
  happy: {
    mood: '😄 มีความสุข',
    quote: '"จงมีความสุขกับสิ่งที่มี และทำสิ่งที่ดีที่สุดกับสิ่งที่ขาดไป"',
    song: 'Happy – Pharrell Williams',
  },
  sad: {
    mood: '😢 เศร้า',
    quote: '"แม้จะเหนื่อยล้า แต่อย่ายอมแพ้"',
    song: 'Someone Like You – Adele',
  },
  angry: {
    mood: '😠 โกรธ',
    quote: '"หายใจลึก ๆ แล้วปล่อยวาง"',
    song: 'Lose Yourself – Eminem',
  },
  stressed: {
    mood: '😰 เครียด',
    quote: '"พักก่อน แล้วค่อยไปต่อ"',
    song: 'Weightless – Marconi Union',
  },
  tired: {
    mood: '😴 เหนื่อยล้า',
    quote: '"การพักผ่อนก็เป็นส่วนหนึ่งของความสำเร็จ"',
    song: 'Let Her Go – Passenger',
  },
  calm: {
    mood: '😌 สงบ',
    quote: '"ความสงบคือพลังที่ยิ่งใหญ่ที่สุด"',
    song: 'Bloom – The Paper Kites',
  },
}

const tipsByMood: Record<string, string> = {
  happy: 'รักษาความรู้สึกดี ๆ นี้ไว้นะ! ลองแบ่งปันรอยยิ้มให้คนอื่นดูสิ 😊',
  sad: 'ลองออกไปเดินเล่น หรือฟังเพลงเบา ๆ ดูนะ 💛',
  angry: 'ลองหายใจลึก ๆ และหาสิ่งที่ทำให้ใจเย็น เช่นการเขียนระบาย ✍️',
  stressed: 'พักสายตา ทำสมาธิสั้น ๆ หรือนอนหลับให้เพียงพอ 😴',
  tired: 'พักผ่อนให้เพียงพอ แล้วค่อยลุยต่อพรุ่งนี้! 🌙',
  calm: 'คุณกำลังอยู่ในจังหวะที่ดีของชีวิต อย่าลืมเติมพลังให้ตัวเองเสมอ 🌿',
}

export default function RecommendPage() {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null)
  const [tip, setTip] = useState<string | null>(null)

  useEffect(() => {
    const fetchLatestMood = async () => {
      const moodsRef = collection(db, 'moods')
      const q = query(moodsRef, orderBy('createdAt', 'desc'), limit(1))
      const snapshot = await getDocs(q)
      if (!snapshot.empty) {
        const latest = snapshot.docs[0].data()
        const mood = latest.mood
        if (moodMap[mood]) {
          setRecommendation(moodMap[mood])
          setTip(tipsByMood[mood])
        }
      }
    }

    fetchLatestMood()
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 p-6 text-center">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">🎧 คำแนะนำวันนี้</h1>

      {recommendation ? (
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
          <p className="text-4xl mb-4">{recommendation.mood}</p>
          <p className="text-base mb-2">💬 <i>{recommendation.quote}</i></p>
          <p className="text-base mb-4">🎵 <b>{recommendation.song}</b></p>

          {tip && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-left">
              <p className="text-yellow-800 font-semibold mb-1">💡 แนวทางรับมือ:</p>
              <p className="text-yellow-700">{tip}</p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-red-500 mt-6">⚠️ ไม่พบข้อมูลอารมณ์ล่าสุด กรุณาลองใหม่อีกครั้ง</p>
      )}

      <Link href="/mood">
        <button className="mt-8 px-6 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition">
          🔄 เปลี่ยนอารมณ์
        </button>
      </Link>
    </div>
  )
}