import {
  buildAihotUrl,
  CATEGORY_LABELS,
  createEmptyReport,
  createErrorReport,
  normalizeDailyReport,
  normalizeItemsReport,
  normalizeReportQuery,
  STAT_KEYS
} from '@/lib/aihot/report'

describe('normalizeReportQuery', () => {
  it('defaults to items view, selected mode, and take 50', () => {
    expect(normalizeReportQuery()).toEqual({
      view: 'items',
      mode: 'selected',
      category: '',
      q: '',
      date: '',
      take: 50
    })
  })

  it('uses first value from Next query arrays and clamps take to 1..100', () => {
    expect(
      normalizeReportQuery({
        view: ['daily', 'items'],
        mode: ['all'],
        category: ['paper'],
        q: ['  transformers  '],
        date: ['2026-05-17'],
        take: ['999']
      })
    ).toEqual({
      view: 'daily',
      mode: 'all',
      category: 'paper',
      q: 'transformers',
      date: '2026-05-17',
      take: 100
    })

    expect(normalizeReportQuery({ take: '0' }).take).toBe(1)
  })

  it('rejects unknown view, mode, and category', () => {
    expect(() => normalizeReportQuery({ view: 'weekly' })).toThrow('Invalid view')
    expect(() => normalizeReportQuery({ mode: 'recent' })).toThrow('Invalid mode')
    expect(() => normalizeReportQuery({ category: 'news' })).toThrow('Invalid category')
  })

  it('rejects invalid non-empty date values that do not match YYYY-MM-DD', () => {
    expect(() => normalizeReportQuery({ date: '2026/05/17' })).toThrow('Invalid date')
    expect(() => normalizeReportQuery({ date: '2026-5-17' })).toThrow('Invalid date')
    expect(() => normalizeReportQuery({ date: 'abc' })).toThrow('Invalid date')
  })

  it('rejects impossible calendar dates even when they match YYYY-MM-DD', () => {
    expect(() => normalizeReportQuery({ date: '2026-13-01' })).toThrow('Invalid date')
    expect(() => normalizeReportQuery({ date: '2026-02-30' })).toThrow('Invalid date')
  })

  it('trims q and slices it to 200 chars', () => {
    const longQuery = `  ${'a'.repeat(250)}  `

    expect(normalizeReportQuery({ q: longQuery }).q).toBe('a'.repeat(200))
  })
})

describe('buildAihotUrl', () => {
  it('builds items URL with mode, category, q, and take', () => {
    const url = buildAihotUrl(
      normalizeReportQuery({
        mode: 'all',
        category: 'ai-models',
        q: 'agent ops',
        take: '25',
        date: '2026-05-17'
      })
    )

    expect(url).toBe(
      'https://aihot.virxact.com/api/public/items?mode=all&take=25&category=ai-models&q=agent+ops'
    )
  })

  it('does not include date in items URL even when normalized query has a date', () => {
    const url = buildAihotUrl(
      normalizeReportQuery({
        view: 'items',
        mode: 'all',
        take: '25',
        date: '2026-05-17'
      })
    )

    expect(url).toBe('https://aihot.virxact.com/api/public/items?mode=all&take=25')
  })

  it('builds daily URL using only the daily path, with or without date', () => {
    expect(
      buildAihotUrl(
        normalizeReportQuery({
          view: 'daily',
          mode: 'all',
          category: 'paper',
          q: 'agent ops',
          take: '25',
          date: '2026-05-17'
        })
      )
    ).toBe('https://aihot.virxact.com/api/public/daily/2026-05-17')

    expect(
      buildAihotUrl(
        normalizeReportQuery({
          view: 'daily',
          mode: 'all',
          category: 'paper',
          q: 'agent ops',
          take: '25'
        })
      )
    ).toBe('https://aihot.virxact.com/api/public/daily')
  })
})

describe('normalizeItemsReport', () => {
  it('returns 暂无内容 when payload has an empty items array without count', () => {
    const now = new Date('2026-05-17T12:34:56.000Z')
    const normalizedQuery = normalizeReportQuery({ mode: 'all', take: '10' })

    expect(normalizeItemsReport({ items: [] }, normalizedQuery, now)).toMatchObject({
      summary: '暂无内容',
      stats: {
        total: 0,
        models: 0,
        products: 0,
        industry: 0,
        papers: 0,
        tips: 0
      },
      groups: []
    })
  })

  it('groups items by known categories and includes unknown or null as 其他动态', () => {
    const now = new Date('2026-05-17T12:34:56.000Z')
    const normalizedQuery = normalizeReportQuery({ mode: 'all', take: '10' })
    const payload = {
      count: 7,
      items: [
        {
          id: 'm1',
          title: 'Model One',
          title_en: 'Model One EN',
          url: 'https://example.com/model',
          source: 'OpenAI',
          publishedAt: '2026-05-17T01:00:00.000Z',
          summary: 'New model',
          category: 'ai-models'
        },
        {
          id: 'p1',
          title: 'Product One',
          url: 'https://example.com/product',
          source: 'Anthropic',
          publishedAt: '2026-05-17T02:00:00.000Z',
          summary: 'New product',
          category: 'ai-products'
        },
        {
          id: 'i1',
          title: 'Industry One',
          url: 'https://example.com/industry',
          source: 'The Verge',
          publishedAt: '2026-05-17T03:00:00.000Z',
          summary: 'Industry move',
          category: 'industry'
        },
        {
          id: 'r1',
          title: 'Paper One',
          url: 'https://example.com/paper',
          source: 'arXiv',
          publishedAt: '2026-05-17T04:00:00.000Z',
          summary: 'Paper summary',
          category: 'paper'
        },
        {
          id: 't1',
          title: 'Tip One',
          url: 'https://example.com/tip',
          source: 'Blog',
          publishedAt: '2026-05-17T05:00:00.000Z',
          summary: 'Tip summary',
          category: 'tip'
        },
        {
          id: 'u1',
          title: 'Unknown One',
          url: 'https://example.com/unknown',
          source: 'Forum',
          publishedAt: '2026-05-17T06:00:00.000Z',
          summary: 'Unknown summary',
          category: 'misc'
        },
        {
          id: 'u2',
          title: 'Null One',
          url: 'https://example.com/null',
          source: 'Forum',
          publishedAt: '2026-05-17T07:00:00.000Z',
          summary: 'Null summary',
          category: null
        }
      ]
    }

    const report = normalizeItemsReport(payload, normalizedQuery, now)

    expect(report).toMatchObject({
      ok: true,
      view: 'items',
      updatedAt: '2026-05-17T12:34:56.000Z',
      source: {
        name: 'AI HOT',
        url: 'https://aihot.virxact.com/api/public/items?mode=all&take=10'
      },
      stats: {
        total: 7,
        models: 1,
        products: 1,
        industry: 1,
        papers: 1,
        tips: 1
      },
      daily: null,
      error: null
    })

    expect(report.groups.map(group => group.label)).toEqual([
      CATEGORY_LABELS['ai-models'],
      CATEGORY_LABELS['ai-products'],
      CATEGORY_LABELS.industry,
      CATEGORY_LABELS.paper,
      CATEGORY_LABELS.tip,
      '其他动态'
    ])

    expect(report.groups[0].items[0]).toEqual({
      id: 'm1',
      title: 'Model One',
      url: 'https://example.com/model',
      source: 'OpenAI',
      publishedAt: '2026-05-17T01:00:00.000Z',
      summary: 'New model',
      category: 'ai-models'
    })

    expect(report.groups[5].items).toHaveLength(2)
    expect(Object.values(STAT_KEYS)).toEqual([
      'models',
      'products',
      'industry',
      'papers',
      'tips'
    ])
  })
})

describe('normalizeDailyReport', () => {
  it('normalizes daily sections into display item shape and stats', () => {
    const now = new Date('2026-05-17T10:00:00.000Z')
    const normalizedQuery = normalizeReportQuery({ view: 'daily', date: '2026-05-17' })
    const payload = {
      date: '2026-05-17',
      generatedAt: '2026-05-17T09:00:00.000Z',
      windowStart: '2026-05-16T00:00:00.000Z',
      windowEnd: '2026-05-17T00:00:00.000Z',
      lead: 'Daily lead summary',
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
        },
        {
          label: '行业动态',
          items: [
            {
              title: 'Industry Move',
              summary: 'Industry summary',
              sourceName: 'Reuters',
              sourceUrl: 'https://example.com/industry'
            }
          ]
        },
        {
          label: '未分类',
          items: [
            {
              title: 'Other Update',
              summary: 'Other summary',
              sourceName: 'Forum',
              sourceUrl: 'https://example.com/other'
            }
          ]
        }
      ],
      flashes: [{ text: 'Flash update' }]
    }

    const report = normalizeDailyReport(payload, normalizedQuery, now)

    expect(report).toMatchObject({
      ok: true,
      view: 'daily',
      updatedAt: '2026-05-17T10:00:00.000Z',
      source: {
        name: 'AI HOT',
        url: 'https://aihot.virxact.com/api/public/daily/2026-05-17'
      },
      stats: {
        total: 3,
        models: 1,
        products: 0,
        industry: 1,
        papers: 0,
        tips: 0
      },
      error: null
    })

    expect(report.groups.map(group => group.label)).toEqual([
      '模型发布/更新',
      '行业动态',
      '未分类'
    ])

    expect(report.groups[0].items[0]).toEqual({
      id: '2026-05-17-0-0',
      title: 'GPT Update',
      url: 'https://example.com/gpt',
      source: 'OpenAI',
      publishedAt: '2026-05-17',
      summary: 'Model summary',
      category: 'ai-models'
    })

    expect(report.daily).toEqual({
      date: '2026-05-17',
      generatedAt: '2026-05-17T09:00:00.000Z',
      windowStart: '2026-05-16T00:00:00.000Z',
      windowEnd: '2026-05-17T00:00:00.000Z',
      lead: 'Daily lead summary',
      sections: report.groups,
      flashes: [{ text: 'Flash update' }]
    })
  })
})

describe('empty and error reports', () => {
  it('creates stable empty and error report shapes', () => {
    const now = new Date('2026-05-17T08:00:00.000Z')
    const normalizedQuery = normalizeReportQuery({ view: 'daily', date: '2026-05-17' })

    expect(createEmptyReport(normalizedQuery, '暂无内容', now)).toEqual({
      ok: true,
      view: 'daily',
      updatedAt: '2026-05-17T08:00:00.000Z',
      source: {
        name: 'AI HOT',
        url: 'https://aihot.virxact.com/api/public/daily/2026-05-17'
      },
      title: 'AI HOT 每日简报',
      summary: '暂无内容',
      stats: {
        total: 0,
        models: 0,
        products: 0,
        industry: 0,
        papers: 0,
        tips: 0
      },
      groups: [],
      daily: null,
      error: null
    })

    expect(createErrorReport(normalizedQuery, '获取 AI HOT 数据失败，请稍后重试', now)).toEqual({
      ok: false,
      view: 'daily',
      updatedAt: '2026-05-17T08:00:00.000Z',
      source: {
        name: 'AI HOT',
        url: 'https://aihot.virxact.com/api/public/daily/2026-05-17'
      },
      title: 'AI HOT 每日简报',
      summary: '获取 AI HOT 数据失败，请稍后重试',
      stats: {
        total: 0,
        models: 0,
        products: 0,
        industry: 0,
        papers: 0,
        tips: 0
      },
      groups: [],
      daily: null,
      error: '获取 AI HOT 数据失败，请稍后重试'
    })
  })
})
