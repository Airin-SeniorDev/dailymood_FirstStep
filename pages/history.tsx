// ✅ pages/history.tsx – ปรับให้คอมเมนต์บันทึกลง Firestore ถาวร
import { useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  doc
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

type MoodRecord = {
  id?: string
  mood: string
  comment: string
  createdAt: any
  feedback?: string
}

const moodLabels: Record<string, string> = {
  happy: '😄 มีความสุข',
  sad: '😢 เศร้า',
  angry: '😠 โกรธ',
  stressed: '😰 เครียด',
  tired: '😴 เหนื่อยล้า',
  calm: '😌 สงบ'
}

export default function HistoryPage() {
  const [history, setHistory] = useState<MoodRecord[]>([])
  const [commentInput, setCommentInput] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchData = async () => {
      const moodsRef = collection(db, 'moods')
      const q = query(moodsRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MoodRecord))
      setHistory(data)
    }
    fetchData()
  }, [])

  const moodCounts = history.reduce((acc: Record<string, number>, item) => {
    acc[item.mood] = (acc[item.mood] || 0) + 1
    return acc
  }, {})

  const chartData = Object.entries(moodCounts).map(([mood, count]) => ({
    name: moodLabels[mood] || mood,
    count
  }))

  const handleSaveComment = async (id: string) => {
    const text = commentInput[id] || ''
    const docRef = doc(db, 'moods', id)
    await updateDoc(docRef, { feedback: text })

    setHistory(prev => prev.map(entry => entry.id === id ? { ...entry, feedback: text } : entry))
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">📊 ประวัติอารมณ์</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#a78bfa" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {history.map((item) => (
        <div key={item.id} className="bg-white p-4 rounded shadow mb-4 border">
          <p className="text-sm text-gray-500">
            📅 {item.createdAt?.toDate?.().toISOString().split('T')[0]} — {moodLabels[item.mood] || item.mood}
          </p>
          <p className="mt-1 text-green-600 italic">💬 {item.comment || 'ไม่มีคำอธิบาย'}</p>

          <div className="flex mt-3 gap-2">
            <input
              type="text"
              className={`flex-1 px-3 py-2 border rounded ${!item.feedback ? 'text-red-500' : ''}`}
              placeholder="พิมพ์ข้อความให้กำลังใจ..."
              value={commentInput[item.id!] || ''}
              onChange={(e) =>
                setCommentInput(prev => ({ ...prev, [item.id!]: e.target.value }))
              }
            />
            <button
              onClick={() => handleSaveComment(item.id!)}
              className="bg-blue-500 text-white px-3 py-2 rounded"
            >
              💬 ให้กำลังใจ
            </button>
          </div>

          {item.feedback && (
            <p className="mt-2 text-blue-600">{item.feedback}</p>
          )}
        </div>
      ))}
    </div>
  )
}