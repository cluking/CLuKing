'use client'

import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import CONFIG from '../config'

const CATEGORY_OPTIONS = [
  { value: '', label: '全部' },
  { value: 'ai-models', label: '模型' },
  { value: 'ai-products', label: '产品' },
  { value: 'industry', label: '行业' },
  { value: 'paper', label: '论文' },
  { value: 'tip', label: '技巧' }
]

const VIEW_OPTIONS = [
  { value: 'items', label: '实时条目' },
  { value: 'daily', label: '每日简报' }
]

const DEFAULT_ERROR_MESSAGE = '暂时无法加载 AI HOT 报告，请稍后再试。'
const SAFE_ERROR_MESSAGES = new Set([
  DEFAULT_ERROR_MESSAGE,
  '参数不正确，请调整筛选条件后重试。',
  'AI HOT 数据暂时不可用，请稍后重试。'
])
const UNSAFE_ERROR_PATTERNS = [/\/api\//i, /https?:\/\//i, /status/i, /cursor/i, /[?&][^\s=]+=.+/]

const sanitizeErrorMessage = value => {
  if (typeof value !== 'string') {
    return DEFAULT_ERROR_MESSAGE
  }

  const message = value.trim()
  if (!message || UNSAFE_ERROR_PATTERNS.some(pattern => pattern.test(message))) {
    return DEFAULT_ERROR_MESSAGE
  }

  return SAFE_ERROR_MESSAGES.has(message) ? message : DEFAULT_ERROR_MESSAGE
}

const normalizeExternalUrl = value => {
  if (typeof value !== 'string' || !value.trim()) {
    return ''
  }

  try {
    const normalizedUrl = new URL(value.trim())
    return ['http:', 'https:'].includes(normalizedUrl.protocol) ? normalizedUrl.toString() : ''
  } catch {
    return ''
  }
}

const formatPublishedAt = value => {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const buildRequestUrl = ({ view, category, keyword }) => {
  const params = new URLSearchParams()

  if (view === 'daily') {
    params.set('view', 'daily')
    return `/api/aihot/report?${params.toString()}`
  }

  params.set('view', 'items')
  params.set('mode', 'all')
  params.set('take', '50')

  if (category) {
    params.set('category', category)
  }

  if (keyword) {
    params.set('q', keyword)
  }

  return `/api/aihot/report?${params.toString()}`
}

const getAllowedValue = (value, allowedValues, fallback = '') => {
  const scalar = Array.isArray(value) ? value[0] : value
  return allowedValues.includes(scalar) ? scalar : fallback
}

const getQueryString = value => {
  const scalar = Array.isArray(value) ? value[0] : value
  return typeof scalar === 'string' ? scalar : ''
}

const buildRouteQuery = ({ view, category, keyword }) => {
  const query = { view }

  if (view === 'items' && category) {
    query.category = category
  }

  if (view === 'items' && keyword) {
    query.q = keyword
  }

  return query
}

const StatCard = ({ label, value }) => (
  <div className='fuwari-card fuwari-dashboard-widget p-4'>
    <div className='fuwari-dashboard-widget-head mb-3'>
      <h3 className='fuwari-dashboard-widget-title'>{label}</h3>
    </div>
    <div className='text-2xl font-bold text-[var(--fuwari-text)]'>{value ?? 0}</div>
  </div>
)

const ItemCard = ({ item }) => {
  const safeUrl = normalizeExternalUrl(item.url)

  return (
    <article className='fuwari-card fuwari-card-hover p-4'>
      <div className='flex flex-wrap items-center gap-2 text-xs text-[var(--fuwari-muted)] mb-3'>
        {item.source ? <span className='fuwari-chip'>{item.source}</span> : null}
        {item.publishedAt ? <span>{formatPublishedAt(item.publishedAt)}</span> : null}
      </div>
      <h3 className='text-lg font-semibold leading-snug text-[var(--fuwari-text)]'>
        {safeUrl ? (
          <a
            href={safeUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='hover:opacity-85 transition-opacity'>
            {item.title || '未命名条目'}
          </a>
        ) : (
          item.title || '未命名条目'
        )}
      </h3>
      {item.summary ? (
        <p className='mt-3 text-sm leading-7 text-[var(--fuwari-muted)]'>{item.summary}</p>
      ) : null}
    </article>
  )
}

const DailyLeadCard = ({ daily, summary }) => {
  if (!daily && !summary) return null

  return (
    <section className='fuwari-card fuwari-dashboard-widget p-5'>
      <div className='fuwari-dashboard-widget-head'>
        <h2 className='fuwari-dashboard-widget-title'>
          <span className='fuwari-agent-status-dot' aria-hidden='true' />
          今日摘要
        </h2>
        {daily?.date ? <span className='fuwari-dashboard-widget-code'>{daily.date}</span> : null}
      </div>
      <p className='text-sm leading-7 text-[var(--fuwari-muted)]'>{daily?.lead || summary}</p>
    </section>
  )
}

const AgentReport = props => {
  const router = useRouter()
  const title = siteConfig('FUWARI_AGENT_TITLE', CONFIG.FUWARI_AGENT_TITLE, CONFIG)
  const subtitle = siteConfig('FUWARI_AGENT_SUBTITLE', CONFIG.FUWARI_AGENT_SUBTITLE, CONFIG)
  const refreshInterval = Number(
    siteConfig(
      'FUWARI_AGENT_REFRESH_INTERVAL',
      CONFIG.FUWARI_AGENT_REFRESH_INTERVAL,
      CONFIG
    )
  ) || 300000

  const hasInitialReport = Boolean(props.initialReport)
  const [report, setReport] = useState(props.initialReport || null)
  const [view, setView] = useState('items')
  const [category, setCategory] = useState('')
  const [keyword, setKeyword] = useState('')
  const [pendingKeyword, setPendingKeyword] = useState('')
  const [loading, setLoading] = useState(!hasInitialReport)
  const [error, setError] = useState('')
  const inFlightRef = useRef(false)

  const requestUrl = useMemo(
    () => buildRequestUrl({ view, category, keyword }),
    [view, category, keyword]
  )

  const statItems = useMemo(() => {
    const stats = report?.stats || {}

    return [
      { label: '总览', value: stats.total || 0 },
      { label: '模型', value: stats.models || 0 },
      { label: '产品', value: stats.products || 0 },
      { label: '行业', value: stats.industry || 0 },
      { label: '论文', value: stats.papers || 0 },
      { label: '技巧', value: stats.tips || 0 }
    ]
  }, [report])

  const groups = useMemo(() => {
    return Array.isArray(report?.groups) ? report.groups : []
  }, [report])

  const hasContent = useMemo(() => {
    return groups.some(group => Array.isArray(group?.items) && group.items.length > 0)
  }, [groups])

  useEffect(() => {
    if (!router.isReady) return

    const nextView = getAllowedValue(
      router.query?.view,
      VIEW_OPTIONS.map(option => option.value),
      'items'
    )
    const nextCategory = nextView === 'items'
      ? getAllowedValue(
          router.query?.category,
          CATEGORY_OPTIONS.map(option => option.value),
          ''
        )
      : ''
    const nextKeyword = nextView === 'items' ? getQueryString(router.query?.q).trim() : ''

    setView(nextView)
    setCategory(nextCategory)
    setKeyword(nextKeyword)
    setPendingKeyword(nextKeyword)
  }, [router.isReady, router.query?.category, router.query?.q, router.query?.view])

  useEffect(() => {
    let activeController = null

    const loadReport = async ({ showLoading = false } = {}) => {
      if (inFlightRef.current) {
        return
      }

      const controller = new AbortController()
      activeController = controller
      inFlightRef.current = true

      if (showLoading) {
        setLoading(true)
      }

      try {
        const response = await fetch(requestUrl, {
          cache: 'no-store',
          signal: controller.signal,
          headers: {
            Accept: 'application/json'
          }
        })
        const data = await response.json().catch(() => null)

        if (!response.ok || data?.ok === false) {
          throw new Error(sanitizeErrorMessage(data?.error))
        }

        if (controller.signal.aborted) return

        setReport(data)
        setError('')
      } catch (err) {
        if (err?.name === 'AbortError' || controller.signal.aborted) {
          return
        }

        setReport(null)
        setError(sanitizeErrorMessage(err?.message))
      } finally {
        if (activeController === controller) {
          activeController = null
        }
        inFlightRef.current = false

        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadReport({ showLoading: !hasInitialReport })
    const timer = window.setInterval(() => {
      loadReport()
    }, refreshInterval)

    return () => {
      activeController?.abort()
      inFlightRef.current = false
      window.clearInterval(timer)
    }
  }, [hasInitialReport, requestUrl, refreshInterval])

  const pushReportRoute = nextState => {
    const nextView = nextState.view ?? view
    const nextCategory = nextView === 'items' ? nextState.category ?? category : ''
    const nextKeyword = nextView === 'items' ? nextState.keyword ?? keyword : ''

    router.push(
      {
        pathname: router.pathname || '/agent',
        query: buildRouteQuery({ view: nextView, category: nextCategory, keyword: nextKeyword })
      },
      undefined,
      { shallow: true, scroll: false }
    )
  }

  const handleViewChange = nextView => {
    setView(nextView)
    if (nextView === 'daily') {
      setCategory('')
      setKeyword('')
      setPendingKeyword('')
    }
    pushReportRoute({ view: nextView })
  }

  const handleCategoryChange = nextCategory => {
    setView('items')
    setCategory(nextCategory)
    pushReportRoute({ view: 'items', category: nextCategory })
  }

  const handleSearchSubmit = event => {
    event.preventDefault()
    const nextKeyword = pendingKeyword.trim()
    setView('items')
    setKeyword(nextKeyword)
    pushReportRoute({ view: 'items', keyword: nextKeyword })
  }

  return (
    <div className='space-y-4'>
      <section className='fuwari-card fuwari-dashboard-widget fuwari-agent-hero p-5 md:p-6 overflow-hidden'>
        <div className='fuwari-dashboard-widget-head'>
          <h1 className='fuwari-dashboard-widget-title'>
            <span className='fuwari-agent-status-dot' aria-hidden='true' />
            {title}
          </h1>
          <span className='fuwari-dashboard-widget-code'>AI HOT / LIVE</span>
        </div>
        <div className='space-y-3'>
          <h2 className='fuwari-section-title text-3xl md:text-4xl font-black leading-tight'>
            <span className='fuwari-title-gradient'>{title}</span>
          </h2>
          <p className='max-w-3xl text-sm md:text-base leading-7 text-[var(--fuwari-muted)]'>
            {subtitle}
          </p>
          <p className='text-xs text-[var(--fuwari-muted)]'>
            数据来自 AI HOT，摘要请以原文为准
          </p>
        </div>
      </section>

      <section className='fuwari-card p-4 md:p-5'>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-wrap gap-2'>
            {VIEW_OPTIONS.map(option => {
              const active = view === option.value
              return (
                <button
                  key={option.value}
                  type='button'
                  className='fuwari-chip'
                  aria-pressed={active}
                  onClick={() => handleViewChange(option.value)}
                  style={active
                    ? {
                        color: 'var(--fuwari-primary)',
                        borderColor: 'color-mix(in oklab, var(--fuwari-primary) 32%, var(--fuwari-border))',
                        background: 'color-mix(in oklab, var(--fuwari-primary) 10%, var(--fuwari-surface))'
                      }
                    : undefined}>
                  {option.label}
                </button>
              )
            })}
          </div>

          <div className='flex flex-wrap gap-2'>
            {CATEGORY_OPTIONS.map(option => {
              const active = category === option.value
              return (
                <button
                  key={option.value || 'all'}
                  type='button'
                  className='fuwari-chip'
                  aria-pressed={active}
                  onClick={() => handleCategoryChange(option.value)}
                  style={active
                    ? {
                        color: 'var(--fuwari-primary)',
                        borderColor: 'color-mix(in oklab, var(--fuwari-primary) 32%, var(--fuwari-border))',
                        background: 'color-mix(in oklab, var(--fuwari-primary) 10%, var(--fuwari-surface))'
                      }
                    : undefined}>
                  {option.label}
                </button>
              )
            })}
          </div>

          <form className='flex flex-col sm:flex-row gap-3' onSubmit={handleSearchSubmit}>
            <input
              type='search'
              aria-label='搜索 AI HOT 条目'
              value={pendingKeyword}
              onChange={event => setPendingKeyword(event.target.value)}
              placeholder='搜索关键词，例如 agent、GPT、论文'
              className='min-w-0 flex-1 rounded-2xl border border-[var(--fuwari-border)] bg-[var(--fuwari-surface)] px-4 py-3 text-sm text-[var(--fuwari-text)] outline-none transition focus:border-[var(--fuwari-primary)] focus:ring-2 focus:ring-[var(--fuwari-primary-soft)]'
            />
            <button type='submit' className='fuwari-chip justify-center px-5 py-3 text-sm font-semibold'>
              搜索
            </button>
          </form>
        </div>
      </section>

      {loading ? (
        <section className='fuwari-card fuwari-dashboard-widget p-6'>
          <div className='fuwari-dashboard-widget-head'>
            <h2 className='fuwari-dashboard-widget-title'>
              <span className='fuwari-agent-status-dot' aria-hidden='true' />
              正在同步
            </h2>
            <span className='fuwari-dashboard-widget-code'>SYNCING</span>
          </div>
          <p className='text-sm leading-7 text-[var(--fuwari-muted)]'>
            正在拉取最新动态，请稍候片刻。
          </p>
        </section>
      ) : null}

      {!loading && error ? (
        <section className='fuwari-card fuwari-dashboard-widget p-6'>
          <div className='fuwari-dashboard-widget-head'>
            <h2 className='fuwari-dashboard-widget-title'>加载提醒</h2>
            <span className='fuwari-dashboard-widget-code'>RETRY</span>
          </div>
          <p className='text-sm leading-7 text-[var(--fuwari-muted)]'>{error}</p>
        </section>
      ) : null}

      {!loading && !error && report ? (
        <>
          <section className='fuwari-agent-report-grid'>
            {statItems.map(item => (
              <StatCard key={item.label} label={item.label} value={item.value} />
            ))}
          </section>

          {view === 'daily' ? (
            <DailyLeadCard daily={report.daily} summary={report.summary} />
          ) : null}

          {!hasContent ? (
            <section className='fuwari-card fuwari-dashboard-widget p-6'>
              <div className='fuwari-dashboard-widget-head'>
                <h2 className='fuwari-dashboard-widget-title'>当前为空</h2>
                <span className='fuwari-dashboard-widget-code'>EMPTY</span>
              </div>
              <p className='text-sm leading-7 text-[var(--fuwari-muted)]'>
                当前筛选条件下暂无内容，请稍后刷新或调整关键词。
              </p>
            </section>
          ) : (
            <div className='space-y-4'>
              {groups.map(group => {
                if (!Array.isArray(group?.items) || group.items.length === 0) {
                  return null
                }

                return (
                  <section key={group.key || group.label} className='space-y-3'>
                    <div className='fuwari-card fuwari-dashboard-widget p-4'>
                      <div className='fuwari-dashboard-widget-head mb-0'>
                        <h2 className='fuwari-section-title text-xl font-bold'>{group.label}</h2>
                        <span className='fuwari-dashboard-widget-code'>{group.items.length} 条</span>
                      </div>
                    </div>
                    <div className='grid gap-3'>
                      {group.items.map(item => (
                        <ItemCard key={item.id || `${group.label}-${item.title}`} item={item} />
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          )}
        </>
      ) : null}
    </div>
  )
}

export default AgentReport
