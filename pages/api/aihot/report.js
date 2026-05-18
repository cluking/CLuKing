import {
  AIHOT_USER_AGENT,
  buildAihotUrl,
  createErrorReport,
  normalizeDailyReport,
  normalizeItemsReport,
  normalizeReportQuery
} from '@/lib/aihot/report'

const NO_STORE_CACHE_CONTROL = 'no-store'
const REQUEST_TIMEOUT_MS = 8000
const INVALID_QUERY_MESSAGE = '参数不正确，请调整筛选条件后重试。'
const UPSTREAM_ERROR_MESSAGE = 'AI HOT 数据暂时不可用，请稍后重试。'

function createSafeApiReport(report) {
  return {
    ...report,
    source: {
      name: report.source?.name || 'AI HOT'
    }
  }
}

function createSafeApiErrorReport(normalizedQuery, message) {
  return createSafeApiReport(createErrorReport(normalizedQuery, message))
}

function createSafeFallbackQuery(query = {}) {
  try {
    return normalizeReportQuery({
      view: query?.view === 'daily' || query?.view === 'items' ? query.view : 'items'
    })
  } catch {
    return normalizeReportQuery({})
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Cache-Control', NO_STORE_CACHE_CONTROL)
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' })
  }

  let normalizedQuery
  try {
    normalizedQuery = normalizeReportQuery(req.query)
  } catch {
    res.setHeader('Cache-Control', NO_STORE_CACHE_CONTROL)
    return res
      .status(400)
      .json(createSafeApiErrorReport(createSafeFallbackQuery(req.query), INVALID_QUERY_MESSAGE))
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(buildAihotUrl(normalizedQuery), {
      headers: {
        'User-Agent': AIHOT_USER_AGENT,
        Accept: 'application/json'
      },
      signal: controller.signal
    })

    if (!response.ok) {
      res.setHeader('Cache-Control', NO_STORE_CACHE_CONTROL)
      return res
        .status(502)
        .json(createSafeApiErrorReport(normalizedQuery, UPSTREAM_ERROR_MESSAGE))
    }

    const payload = await response.json()
    const report =
      normalizedQuery.view === 'daily'
        ? normalizeDailyReport(payload, normalizedQuery)
        : normalizeItemsReport(payload, normalizedQuery)

    res.setHeader('Cache-Control', NO_STORE_CACHE_CONTROL)
    return res.status(200).json(createSafeApiReport(report))
  } catch {
    res.setHeader('Cache-Control', NO_STORE_CACHE_CONTROL)
    return res.status(502).json(createSafeApiErrorReport(normalizedQuery, UPSTREAM_ERROR_MESSAGE))
  } finally {
    clearTimeout(timeoutId)
  }
}
