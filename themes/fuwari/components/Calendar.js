import { siteConfig } from '@/lib/config'
import { useState } from 'react'

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

const Calendar = ({ postDates = [] }) => {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)

  const highlightSet = new Set(postDates)

  const daysInMonth = new Date(year, month, 0).getDate()
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay()

  const prevMonth = () => {
    if (month === 1) { setYear(year - 1); setMonth(12) } else setMonth(month - 1)
  }
  const nextMonth = () => {
    if (month === 12) { setYear(year + 1); setMonth(1) } else setMonth(month + 1)
  }

  const cells = []
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(<div key={`empty-${i}`} />)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const isToday = d === today.getDate() && month === today.getMonth() + 1 && year === today.getFullYear()
    const hasPost = highlightSet.has(dateStr)
    cells.push(
      <div
        key={d}
        className={`fuwari-cal-day ${isToday ? 'fuwari-cal-today' : ''} ${hasPost ? 'fuwari-cal-has-post' : ''}`}
        title={hasPost ? '有文章' : ''}>
        {d}
      </div>
    )
  }

  const lang = siteConfig('LANG', 'zh-CN')
  const monthLabel = lang?.startsWith('en')
    ? new Date(year, month - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : `${year}年${month}月`

  return (
    <section className='fuwari-card p-4'>
      <div className='flex items-center justify-between mb-3'>
        <button onClick={prevMonth} className='fuwari-cal-nav' aria-label='上个月'>
          <i className='fas fa-chevron-left' />
        </button>
        <span className='text-sm font-semibold'>{monthLabel}</span>
        <button onClick={nextMonth} className='fuwari-cal-nav' aria-label='下个月'>
          <i className='fas fa-chevron-right' />
        </button>
      </div>
      <div className='fuwari-cal-grid'>
        {WEEKDAYS.map(w => (
          <div key={w} className='fuwari-cal-weekday'>{w}</div>
        ))}
        {cells}
      </div>
    </section>
  )
}

export default Calendar
