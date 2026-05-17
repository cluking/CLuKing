import handler from '@/pages/api/aihot/report'
import {
  AIHOT_USER_AGENT,
  buildAihotUrl,
  createErrorReport,
  normalizeDailyReport,
  normalizeItemsReport,
  normalizeReportQuery
} from '@/lib/aihot/report'

const createMockRes = () => {
  const res = {
    statusCode: 200,
    headers: {},
    jsonBody: undefined,
    setHeader(name, value) {
      this.headers[name] = value
      return this
    },
    status(code) {
      this.statusCode = code
      return this
    },
    json(body) {
      this.jsonBody = body
      return this
    }
  }

  return res
}

describe('pages/api/aihot/report', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('returns 405 JSON for non-GET requests', async () => {
    const req = { method: 'POST', query: {} }
    const res = createMockRes()

    await handler(req, res)

    expect(res.statusCode).toBe(405)
    expect(res.headers['Cache-Control']).toBe('no-store')
    expect(res.jsonBody).toEqual({ ok: false, message: 'Method Not Allowed' })
  })

  it('returns 400 with sanitized error report when query normalization fails', async () => {
    const req = { method: 'GET', query: { view: 'weekly' } }
    const res = createMockRes()

    await handler(req, res)

    expect(res.statusCode).toBe(400)
    expect(res.headers['Cache-Control']).toBe('no-store')
    expect(res.jsonBody).toMatchObject({
      ok: false,
      view: 'items',
      error: '参数不正确，请调整筛选条件后重试。',
      summary: '参数不正确，请调整筛选条件后重试。',
      source: {
        name: 'AI HOT'
      }
    })
    expect(res.jsonBody.updatedAt).toEqual(expect.any(String))
    expect(JSON.stringify(res.jsonBody)).not.toContain('/api/public')
    expect(JSON.stringify(res.jsonBody)).not.toContain('aihot.virxact.com/api')
  })

  it('returns 400 with daily view preserved and sanitized metadata for invalid daily date', async () => {
    const req = { method: 'GET', query: { view: 'daily', date: 'bad-date' } }
    const res = createMockRes()

    await handler(req, res)

    expect(res.statusCode).toBe(400)
    expect(res.headers['Cache-Control']).toBe('no-store')
    expect(res.jsonBody).toMatchObject({
      ok: false,
      view: 'daily',
      error: '参数不正确，请调整筛选条件后重试。',
      summary: '参数不正确，请调整筛选条件后重试。',
      source: {
        name: 'AI HOT'
      }
    })
    expect(res.jsonBody.updatedAt).toEqual(expect.any(String))
    expect(res.jsonBody.source.url).toBeUndefined()
    expect(JSON.stringify(res.jsonBody)).not.toContain('/api/public')
    expect(JSON.stringify(res.jsonBody)).not.toContain('aihot.virxact.com/api')
  })

  it('returns normalized items report with cache header for successful GET requests', async () => {
    const req = {
      method: 'GET',
      query: { mode: 'all', category: 'paper', q: 'agent ops', take: '25' }
    }
    const res = createMockRes()
    const payload = {
      items: [
        {
          id: 'p1',
          title: 'Paper One',
          url: 'https://example.com/paper-one',
          source: 'arXiv',
          publishedAt: '2026-05-17T00:00:00.000Z',
          summary: 'A useful paper',
          category: 'paper'
        }
      ]
    }
    const normalizedQuery = normalizeReportQuery(req.query)
    const expected = {
      ...normalizeItemsReport(payload, normalizedQuery),
      source: {
        name: 'AI HOT'
      }
    }

    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(payload)
    })

    await handler(req, res)

    expect(global.fetch).toHaveBeenCalledWith(buildAihotUrl(normalizedQuery), {
      signal: expect.any(AbortSignal),
      headers: {
        'User-Agent': AIHOT_USER_AGENT,
        Accept: 'application/json'
      }
    })
    expect(res.headers['Cache-Control']).toBe('s-maxage=300, stale-while-revalidate=600')
    expect(res.statusCode).toBe(200)
    expect({ ...res.jsonBody, updatedAt: 'IGNORED' }).toEqual({
      ...expected,
      updatedAt: 'IGNORED'
    })
    expect(res.jsonBody.updatedAt).toEqual(expect.any(String))
    expect(res.jsonBody.source.url).toBeUndefined()
    expect(JSON.stringify(res.jsonBody)).not.toContain('/api/public')
    expect(JSON.stringify(res.jsonBody)).not.toContain('aihot.virxact.com/api')
  })

  it('returns normalized daily report for daily view requests', async () => {
    const req = {
      method: 'GET',
      query: { view: 'daily', date: '2026-05-17' }
    }
    const res = createMockRes()
    const payload = {
      date: '2026-05-17',
      generatedAt: '2026-05-17T09:00:00.000Z',
      lead: 'Daily lead',
      sections: [
        {
          label: '模型发布/更新',
          items: [
            {
              title: 'GPT Update',
              summary: 'Model summary',
              sourceName: 'OpenAI',
              sourceUrl: 'https://example.com/gpt'
            }
          ]
        }
      ],
      flashes: []
    }
    const normalizedQuery = normalizeReportQuery(req.query)
    const expected = {
      ...normalizeDailyReport(payload, normalizedQuery),
      source: {
        name: 'AI HOT'
      }
    }

    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(payload)
    })

    await handler(req, res)

    expect(res.statusCode).toBe(200)
    expect({ ...res.jsonBody, updatedAt: 'IGNORED' }).toEqual({
      ...expected,
      updatedAt: 'IGNORED'
    })
    expect(res.jsonBody.updatedAt).toEqual(expect.any(String))
    expect(res.jsonBody.source.url).toBeUndefined()
    expect(JSON.stringify(res.jsonBody)).not.toContain('/api/public')
    expect(JSON.stringify(res.jsonBody)).not.toContain('aihot.virxact.com/api')
  })

  it('returns 502 with sanitized error report when upstream responds non-2xx', async () => {
    const req = { method: 'GET', query: { mode: 'all' } }
    const res = createMockRes()

    global.fetch.mockResolvedValue({ ok: false, status: 503 })

    await handler(req, res)

    expect(res.statusCode).toBe(502)
    expect(res.headers['Cache-Control']).toBe('no-store')
    expect(res.jsonBody).toMatchObject({
      ok: false,
      error: 'AI HOT 数据暂时不可用，请稍后重试。',
      summary: 'AI HOT 数据暂时不可用，请稍后重试。',
      source: {
        name: 'AI HOT'
      }
    })
    expect(res.jsonBody.updatedAt).toEqual(expect.any(String))
    expect(JSON.stringify(res.jsonBody)).not.toContain('503')
    expect(JSON.stringify(res.jsonBody)).not.toContain('/api/public')
    expect(JSON.stringify(res.jsonBody)).not.toContain('aihot.virxact.com/api')
  })

  it('returns 502 with sanitized error report when fetch rejects and clears the timeout', async () => {
    const req = { method: 'GET', query: { q: 'agents' } }
    const res = createMockRes()
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

    global.fetch.mockRejectedValue(new Error('upstream timeout details'))

    await handler(req, res)

    expect(res.statusCode).toBe(502)
    expect(res.headers['Cache-Control']).toBe('no-store')
    expect(res.jsonBody).toMatchObject({
      ok: false,
      error: 'AI HOT 数据暂时不可用，请稍后重试。',
      summary: 'AI HOT 数据暂时不可用，请稍后重试。',
      source: {
        name: 'AI HOT'
      }
    })
    expect(res.jsonBody.updatedAt).toEqual(expect.any(String))
    expect(JSON.stringify(res.jsonBody)).not.toContain('upstream timeout details')
    expect(JSON.stringify(res.jsonBody)).not.toContain('/api/public')
    expect(JSON.stringify(res.jsonBody)).not.toContain('aihot.virxact.com/api')
    expect(clearTimeoutSpy).toHaveBeenCalled()

    clearTimeoutSpy.mockRestore()
  })

  it('aborts the upstream request after 8000ms and returns a sanitized 502 response', async () => {
    jest.useFakeTimers()

    const req = { method: 'GET', query: { q: 'agents' } }
    const res = createMockRes()
    let capturedSignal

    global.fetch.mockImplementation(
      (url, options = {}) =>
        new Promise((resolve, reject) => {
          const abortError = new Error('The operation was aborted')
          abortError.name = 'AbortError'

          capturedSignal = options.signal
          capturedSignal.addEventListener('abort', () => {
            reject(abortError)
          })
        })
    )

    const handlerPromise = handler(req, res)

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(capturedSignal).toBeInstanceOf(AbortSignal)
    expect(capturedSignal.aborted).toBe(false)

    jest.advanceTimersByTime(8000)

    expect(capturedSignal.aborted).toBe(true)

    await handlerPromise

    expect(res.statusCode).toBe(502)
    expect(res.headers['Cache-Control']).toBe('no-store')
    expect(res.jsonBody).toMatchObject({
      ok: false,
      error: 'AI HOT 数据暂时不可用，请稍后重试。',
      summary: 'AI HOT 数据暂时不可用，请稍后重试。',
      source: {
        name: 'AI HOT'
      }
    })
    expect(JSON.stringify(res.jsonBody)).not.toContain('/api/public')
    expect(JSON.stringify(res.jsonBody)).not.toContain('aihot.virxact.com/api')
  })
})
