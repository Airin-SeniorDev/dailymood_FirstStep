import { useEffect, useState } from 'react'
import Link from 'next/link'

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

export default function RecommendPage() {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null)

  useEffect(() => {
    const mood = localStorage.getItem('todayMood')
    if (mood && moodMap[mood]) {
      setRecommendation(moodMap[mood])
    }
  }, [])

 
}
