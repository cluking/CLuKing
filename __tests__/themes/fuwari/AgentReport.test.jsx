/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires, react/display-name */
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockSiteConfig = {
  FUWARI_AGENT_TITLE: 'AI HOT Agent',
  FUWARI_AGENT_SUBTITLE: 'Latest AI HOT updates'
}
const mockRouterPush = jest.fn()
let mockRouterQuery = {}

jest.mock('@/lib/config', () => ({
  siteConfig: (key, fallback) => mockSiteConfig[key] ?? fallback
}))

jest.mock('next/router', () => ({
  useRouter: () => ({
    isReady: true,
    pathname: '/agent',
    query: mockRouterQuery,
    push: mockRouterPush
  })
}))

const AgentReport = require('@/themes/fuwari/components/AgentReport').default

const flushPromises = async (ticks = 3) => {
  await act(async () => {
    for (let index = 0; index < ticks; index += 1) {
      await Promise.resolve()
    }
  })
}

const createDeferred = () => {
  let resolve
  let reject

  const promise = new Promise((nextResolve, nextReject) => {
    resolve = nextResolve
    reject = nextReject
  })

  return { promise, resolve, reject }
}

const renderAgentReport = async () => {
  render(<AgentReport />)
  await waitFor(() => {
    expect(fetch).toHaveBeenCalledTimes(1)
  })
}

const settleLatestFetch = async () => {
  await flushPromises()
}

const resolveFetchRequest = async (deferred, response) => {
  await act(async () => {
    deferred.resolve(response)
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()
  })
}

describe('AgentReport', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    mockRouterQuery = {}
    mockRouterPush.mockClear()
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
  })

  it('shows a safe default message instead of backend details', async () => {
    const initialRequest = createDeferred()
    fetch.mockReturnValueOnce(initialRequest.promise)

    await renderAgentReport()
    await resolveFetchRequest(initialRequest, {
      ok: false,
      json: jest.fn().mockResolvedValue({
        ok: false,
        error: 'upstream status=500 https://bad.test/api/report?cursor=secret'
      })
    })

    expect(await screen.findByText('暂时无法加载 AI HOT 报告，请稍后再试。')).toBeInTheDocument()
    expect(screen.queryByText(/status=500/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/https:\/\/bad\.test/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/cursor=secret/i)).not.toBeInTheDocument()
  })

  it('renders plain title text when item url is not http or https', async () => {
    const initialRequest = createDeferred()
    fetch.mockReturnValueOnce(initialRequest.promise)

    await renderAgentReport()
    await resolveFetchRequest(initialRequest, {
      ok: true,
      json: jest.fn().mockResolvedValue({
        ok: true,
        stats: {},
        groups: [
          {
            key: 'unsafe',
            label: 'Unsafe',
            items: [
              {
                id: '1',
                title: 'Unsafe Link',
                url: 'javascript:alert(1)',
                source: 'Example',
                publishedAt: '2026-05-17T00:00:00.000Z',
                summary: 'Should not render as a link'
              }
            ]
          }
        ]
      })
    })

    expect(await screen.findByText('Unsafe Link')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Unsafe Link' })).not.toBeInTheDocument()
  })

  it('adds an accessible label to the search input', async () => {
    const initialRequest = createDeferred()
    fetch.mockReturnValueOnce(initialRequest.promise)

    await renderAgentReport()
    await resolveFetchRequest(initialRequest, {
      ok: true,
      json: jest.fn().mockResolvedValue({ ok: true, stats: {}, groups: [] })
    })

    expect(await screen.findByRole('searchbox', { name: '搜索 AI HOT 条目' })).toBeInTheDocument()
  })

  it('aborts in-flight requests on cleanup and does not show abort errors', async () => {
    const signals = []
    const initialRequest = createDeferred()

    fetch.mockImplementation((url, options = {}) => {
      signals.push(options.signal)

      if (!String(url).includes('view=daily')) {
        return initialRequest.promise.catch(error => {
          throw error
        })
      }

      return Promise.resolve({
        ok: true,
        json: jest.fn().mockResolvedValue({
          ok: true,
          stats: {},
          groups: [],
          daily: { date: '2026-05-17', lead: 'Daily lead' },
          summary: 'Daily lead'
        })
      })
    })

    const abortError = new Error('The operation was aborted')
    abortError.name = 'AbortError'
    initialRequest.promise.catch(() => undefined)

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    await renderAgentReport()

    signals[0].addEventListener('abort', () => initialRequest.reject(abortError), { once: true })

    await user.click(screen.getByRole('button', { name: '每日简报' }))
    await settleLatestFetch()

    expect(signals[0]).toBeInstanceOf(AbortSignal)
    expect(signals[0].aborted).toBe(true)
    expect(await screen.findByText('当前为空')).toBeInTheDocument()
    expect(screen.queryByText('The operation was aborted')).not.toBeInTheDocument()
  })

  it('updates the URL and fetches matching data when switching report filters', async () => {
    const initialRequest = createDeferred()
    const modelRequest = createDeferred()
    const dailyRequest = createDeferred()

    fetch
      .mockReturnValueOnce(initialRequest.promise)
      .mockReturnValueOnce(modelRequest.promise)
      .mockReturnValueOnce(dailyRequest.promise)

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    await renderAgentReport()
    await resolveFetchRequest(initialRequest, {
      ok: true,
      json: jest.fn().mockResolvedValue({
        ok: true,
        stats: { total: 1 },
        groups: [
          {
            key: 'all',
            label: '全部动态',
            items: [{ id: 'all-1', title: 'All Item', url: '', source: '', publishedAt: '', summary: '' }]
          }
        ]
      })
    })

    expect(await screen.findByText('All Item')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '模型' }))

    await waitFor(() => {
      expect(fetch).toHaveBeenLastCalledWith(
        '/api/aihot/report?view=items&mode=all&take=50&category=ai-models',
        expect.objectContaining({ cache: 'no-store' })
      )
    })
    expect(mockRouterPush).toHaveBeenLastCalledWith(
      {
        pathname: '/agent',
        query: { view: 'items', category: 'ai-models' }
      },
      undefined,
      { shallow: true, scroll: false }
    )

    await resolveFetchRequest(modelRequest, {
      ok: true,
      json: jest.fn().mockResolvedValue({
        ok: true,
        stats: { total: 1, models: 1 },
        groups: [
          {
            key: 'ai-models',
            label: '模型发布/更新',
            items: [{ id: 'model-1', title: 'Model Item', url: '', source: '', publishedAt: '', summary: '' }]
          }
        ]
      })
    })
    expect(await screen.findByText('Model Item')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '每日简报' }))

    await waitFor(() => {
      expect(fetch).toHaveBeenLastCalledWith(
        '/api/aihot/report?view=daily',
        expect.objectContaining({ cache: 'no-store' })
      )
    })
    expect(mockRouterPush).toHaveBeenLastCalledWith(
      {
        pathname: '/agent',
        query: { view: 'daily' }
      },
      undefined,
      { shallow: true, scroll: false }
    )

    await resolveFetchRequest(dailyRequest, {
      ok: true,
      json: jest.fn().mockResolvedValue({
        ok: true,
        stats: { total: 1 },
        groups: [
          {
            key: 'daily',
            label: '每日简报',
            items: [{ id: 'daily-1', title: 'Daily Item', url: '', source: '', publishedAt: '', summary: '' }]
          }
        ],
        daily: { date: '2026-05-17', lead: 'Daily lead' },
        summary: 'Daily lead'
      })
    })
    expect(await screen.findByText('Daily Item')).toBeInTheDocument()
  })

  it('refreshes the latest report every 15 minutes by default', async () => {
    const initialRequest = createDeferred()
    const refreshRequest = createDeferred()

    fetch
      .mockReturnValueOnce(initialRequest.promise)
      .mockReturnValueOnce(refreshRequest.promise)

    await renderAgentReport()
    await resolveFetchRequest(initialRequest, {
      ok: true,
      json: jest.fn().mockResolvedValue({ ok: true, stats: {}, groups: [] })
    })
    expect(fetch).toHaveBeenCalledTimes(1)

    act(() => {
      jest.advanceTimersByTime(899999)
    })
    expect(fetch).toHaveBeenCalledTimes(1)

    act(() => {
      jest.advanceTimersByTime(1)
    })

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2)
    })
    expect(fetch).toHaveBeenLastCalledWith(
      '/api/aihot/report?view=items&mode=all&take=50',
      expect.objectContaining({ cache: 'no-store' })
    )

    await resolveFetchRequest(refreshRequest, {
      ok: true,
      json: jest.fn().mockResolvedValue({ ok: true, stats: {}, groups: [] })
    })
  })

  it('does not start a new interval request while the previous one is still in flight', async () => {
    let resolveFetch

    fetch.mockImplementation(
      () =>
        new Promise(resolve => {
          resolveFetch = resolve
        })
    )

    await renderAgentReport()

    expect(fetch).toHaveBeenCalledTimes(1)

    act(() => {
      jest.advanceTimersByTime(200)
    })

    expect(fetch).toHaveBeenCalledTimes(1)

    await act(async () => {
      resolveFetch({
        ok: true,
        json: jest.fn().mockResolvedValue({ ok: true, stats: {}, groups: [] })
      })
      await Promise.resolve()
    })

    await waitFor(() => {
      expect(screen.getByText('当前为空')).toBeInTheDocument()
    })
  })
})
