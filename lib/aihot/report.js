export const AIHOT_BASE_URL = 'https://aihot.virxact.com'

export const AIHOT_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 aihot-skill/0.2.0 CLuKing-agent-page/0.1'

export const CATEGORY_LABELS = {
  'ai-models': '模型发布/更新',
  'ai-products': '产品发布/更新',
  industry: '行业动态',
  paper: '论文研究',
  tip: '技巧与观点'
}

export const STAT_KEYS = {
  'ai-models': 'models',
  'ai-products': 'products',
  industry: 'industry',
  paper: 'papers',
  tip: 'tips'
}

const ALLOWED_VIEWS = new Set(['items', 'daily'])
const ALLOWED_MODES = new Set(['selected', 'all'])
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const UNKNOWN_LABEL = '其他动态'

function isValidCalendarDate(date) {
  if (!DATE_PATTERN.test(date)) {
    return false
  }

  const [yearText, monthText, dayText] = date.split('-')
  const year = Number.parseInt(yearText, 10)
  const month = Number.parseInt(monthText, 10)
  const day = Number.parseInt(dayText, 10)
  const parsedDate = new Date(Date.UTC(year, month - 1, day))

  return (
    parsedDate.getUTCFullYear() === year &&
    parsedDate.getUTCMonth() === month - 1 &&
    parsedDate.getUTCDate() === day
  )
}

function pickFirstValue(value) {
  if (Array.isArray(value)) {
    return value[0]
  }

  return value
}

function normalizeString(value) {
  const scalar = pickFirstValue(value)

  if (scalar === undefined || scalar === null) {
    return ''
  }

  return String(scalar)
}

function createBaseStats() {
  return {
    total: 0,
    models: 0,
    products: 0,
    industry: 0,
    papers: 0,
    tips: 0
  }
}

function buildReportTitle(view) {
  return view === 'daily' ? 'AI HOT 每日简报' : 'AI HOT 热点追踪'
}

function buildDefaultSummary(normalizedQuery) {
  if (normalizedQuery.view === 'daily') {
    return normalizedQuery.date
      ? `AI HOT ${normalizedQuery.date} 每日简报`
      : 'AI HOT 最新每日简报'
  }

  if (normalizedQuery.category) {
    return `AI HOT ${CATEGORY_LABELS[normalizedQuery.category]} 热点列表`
  }

  return 'AI HOT 热点列表'
}

function createReportShell(normalizedQuery, now, overrides = {}) {
  return {
    ok: true,
    view: normalizedQuery.view,
    updatedAt: now.toISOString(),
    source: {
      name: 'AI HOT',
      url: buildAihotUrl(normalizedQuery)
    },
    title: buildReportTitle(normalizedQuery.view),
    summary: buildDefaultSummary(normalizedQuery),
    stats: createBaseStats(),
    groups: [],
    daily: null,
    error: null,
    ...overrides
  }
}

function normalizeItem(item) {
  return {
    id: item?.id ?? '',
    title: item?.title ?? '',
    url: item?.url ?? '',
    source: item?.source ?? '',
    publishedAt: item?.publishedAt ?? '',
    summary: item?.summary ?? '',
    category: item?.category ?? null
  }
}

function getKnownCategoryKeys() {
  return Object.keys(CATEGORY_LABELS)
}

function getCategoryKeyByLabel(label) {
  return getKnownCategoryKeys().find(key => CATEGORY_LABELS[key] === label) || null
}

export function normalizeReportQuery(query = {}) {
  const view = normalizeString(query.view) || 'items'
  if (!ALLOWED_VIEWS.has(view)) {
    throw new Error('Invalid view')
  }

  const mode = normalizeString(query.mode) || 'selected'
  if (!ALLOWED_MODES.has(mode)) {
    throw new Error('Invalid mode')
  }

  const category = normalizeString(query.category)
  if (category && !Object.prototype.hasOwnProperty.call(CATEGORY_LABELS, category)) {
    throw new Error('Invalid category')
  }

  const q = normalizeString(query.q).trim().slice(0, 200)
  const date = normalizeString(query.date).trim()
  if (date && !isValidCalendarDate(date)) {
    throw new Error('Invalid date')
  }

  const parsedTake = Number.parseInt(normalizeString(query.take), 10)
  const take = Number.isFinite(parsedTake)
    ? Math.max(1, Math.min(100, parsedTake))
    : 50

  return {
    view,
    mode,
    category,
    q,
    date,
    take
  }
}

export function buildAihotUrl(normalizedQuery) {
  const url = new URL(AIHOT_BASE_URL)

  if (normalizedQuery.view === 'daily') {
    url.pathname = normalizedQuery.date
      ? `/api/public/daily/${normalizedQuery.date}`
      : '/api/public/daily'

    return url.toString()
  }

  url.pathname = '/api/public/items'
  url.searchParams.set('mode', normalizedQuery.mode)
  url.searchParams.set('take', String(normalizedQuery.take))

  if (normalizedQuery.category) {
    url.searchParams.set('category', normalizedQuery.category)
  }

  if (normalizedQuery.q) {
    url.searchParams.set('q', normalizedQuery.q)
  }

  return url.toString()
}

export function normalizeItemsReport(payload, normalizedQuery, now = new Date()) {
  const report = createReportShell(normalizedQuery, now)
  const stats = createBaseStats()
  const grouped = new Map()
  const items = Array.isArray(payload?.items) ? payload.items : []

  for (const item of items) {
    const normalizedItem = normalizeItem(item)
    const categoryKey = Object.prototype.hasOwnProperty.call(
      CATEGORY_LABELS,
      normalizedItem.category
    )
      ? normalizedItem.category
      : null
    const label = categoryKey ? CATEGORY_LABELS[categoryKey] : UNKNOWN_LABEL

    if (!grouped.has(label)) {
      grouped.set(label, [])
    }

    grouped.get(label).push(normalizedItem)
    stats.total += 1

    if (categoryKey) {
      stats[STAT_KEYS[categoryKey]] += 1
    }
  }

  const groups = []
  for (const categoryKey of getKnownCategoryKeys()) {
    const label = CATEGORY_LABELS[categoryKey]
    const categoryItems = grouped.get(label)
    if (categoryItems?.length) {
      groups.push({
        key: categoryKey,
        label,
        items: categoryItems
      })
    }
  }

  const unknownItems = grouped.get(UNKNOWN_LABEL)
  if (unknownItems?.length) {
    groups.push({
      key: 'unknown',
      label: UNKNOWN_LABEL,
      items: unknownItems
    })
  }

  return {
    ...report,
    summary: items.length === 0 ? '暂无内容' : buildDefaultSummary(normalizedQuery),
    stats,
    groups
  }
}

export function normalizeDailyReport(payload, normalizedQuery, now = new Date()) {
  const report = createReportShell(normalizedQuery, now)
  const stats = createBaseStats()
  const sections = Array.isArray(payload?.sections) ? payload.sections : []

  const groups = sections.map((section, sectionIndex) => {
    const label = section?.label ?? UNKNOWN_LABEL
    const categoryKey = getCategoryKeyByLabel(label)
    const sectionItems = Array.isArray(section?.items) ? section.items : []
    const items = sectionItems.map((item, itemIndex) => {
      const normalizedItem = {
        id: `${payload?.date || normalizedQuery.date || 'daily'}-${sectionIndex}-${itemIndex}`,
        title: item?.title ?? '',
        url: item?.sourceUrl ?? '',
        source: item?.sourceName ?? '',
        publishedAt: payload?.date || normalizedQuery.date || '',
        summary: item?.summary ?? '',
        category: categoryKey
      }

      stats.total += 1
      if (categoryKey) {
        stats[STAT_KEYS[categoryKey]] += 1
      }

      return normalizedItem
    })

    return {
      key: categoryKey || `section-${sectionIndex}`,
      label,
      items
    }
  })

  return {
    ...report,
    summary: payload?.lead || buildDefaultSummary(normalizedQuery),
    stats,
    groups,
    daily: {
      date: payload?.date || normalizedQuery.date || '',
      generatedAt: payload?.generatedAt || '',
      windowStart: payload?.windowStart || '',
      windowEnd: payload?.windowEnd || '',
      lead: payload?.lead || '',
      sections: groups,
      flashes: Array.isArray(payload?.flashes) ? payload.flashes : []
    }
  }
}

export function createEmptyReport(normalizedQuery, message, now = new Date()) {
  return {
    ...createReportShell(normalizedQuery, now),
    summary: message,
    stats: createBaseStats(),
    groups: [],
    daily: null,
    error: null
  }
}

export function createErrorReport(normalizedQuery, message, now = new Date()) {
  return {
    ...createReportShell(normalizedQuery, now, { ok: false }),
    summary: message,
    stats: createBaseStats(),
    groups: [],
    daily: null,
    error: message
  }
}
