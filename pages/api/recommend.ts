// ✅ pages/api/recommend.ts
import type { NextApiRequest, NextApiResponse } from 'next'

type Song = {
  title: string
  url: string
}

type Recommendation = {
  mood: string
  quote: string
  songs: Song[]
}

const moodMap: Record<string, Recommendation> = {
  happy: {
    mood: '😄 มีความสุข',
    quote: 'จงมีความสุขกับสิ่งที่มี และทำสิ่งที่ดีที่สุดกับสิ่งที่ขาดไป',
    songs: [
      { title: 'Billie Eilish - BIRDS OF A FEATHER ', url: 'https://youtu.be/V9PVRfjEBTI?si=Qk099iiIZaL4dnJR' },
      { title: 'Billie Eilish - Happier Than Ever ', url: 'https://youtu.be/5GJWxDKyk3A?si=DlXToeSkVC20uuqW' },
      { title: 'Post Malone, Swae Lee - Sunflower', url: 'https://youtu.be/ApXoWvfEYVU?si=OKyYsM3OuGoOpBl1' },
    ],
  },
  // ... (เพิ่ม mood อื่น ๆ เหมือนหน้า UI)
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const mood = req.query.mood as string

  if (!mood || !moodMap[mood]) {
    return res.status(400).json({ error: 'Invalid or missing mood' })
  }

  const recommendation = moodMap[mood]
  return res.status(200).json(recommendation)
}
