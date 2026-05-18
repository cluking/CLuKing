/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-var-requires */
import { render, screen } from '@testing-library/react'

jest.mock('@/lib/db/SiteDataApi', () => ({
  fetchGlobalAllData: jest.fn()
}))

jest.mock('@/themes/fuwari/components/AgentReport', () => {
  return jest.fn(() => <div>AI HOT 实时报告</div>)
})

const { fetchGlobalAllData } = require('@/lib/db/SiteDataApi')
const AgentReport = require('@/themes/fuwari/components/AgentReport')
const { default: Agent, getStaticProps } = require('@/pages/agent')

describe('pages/agent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('forces the Fuwari theme even when Notion config selects another theme', async () => {
    fetchGlobalAllData.mockResolvedValue({
      NOTION_CONFIG: {
        THEME: 'endspace',
        NEXT_REVALIDATE_SECOND: 60
      },
      allPages: [{ id: 'hidden-from-page-props' }],
      siteInfo: { title: 'Test site' }
    })

    const result = await getStaticProps({ locale: 'zh-CN' })

    expect(result.props.NOTION_CONFIG.THEME).toBe('fuwari')
    expect(result.props.allPages).toBeUndefined()
    expect(fetchGlobalAllData).toHaveBeenCalledWith({ from: 'agent', locale: 'zh-CN' })
  })

  it('prefetches an initial report for static HTML without exposing upstream paths', async () => {
    fetchGlobalAllData.mockResolvedValue({
      NOTION_CONFIG: {
        THEME: 'endspace',
        NEXT_REVALIDATE_SECOND: 60
      },
      allPages: [],
      siteInfo: { title: 'Test site' }
    })
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({
        items: [
          {
            id: 'server-item',
            title: 'Server Prefetched Item',
            url: 'https://example.com/server-item',
            source: 'Example',
            publishedAt: '2026-05-17T00:00:00.000Z',
            summary: 'Already available in static HTML',
            category: 'ai-models'
          }
        ]
      })
    })

    const result = await getStaticProps({ locale: 'zh-CN' })
    const serializedReport = JSON.stringify(result.props.initialReport)

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('mode=all'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: 'application/json',
          'User-Agent': expect.stringContaining('aihot-skill/0.2.0')
        })
      })
    )
    expect(result.props.initialReport.groups[0].items[0].title).toBe('Server Prefetched Item')
    expect(serializedReport).not.toContain('/api/public')
    expect(serializedReport).not.toContain('aihot.virxact.com/api')
  })

  it('renders the Fuwari Agent report even when page props include a layoutName field', () => {
    render(
      <Agent
        NOTION_CONFIG={{ THEME: 'fuwari' }}
        layoutName={undefined}
      />
    )

    expect(screen.getByText('AI HOT 实时报告')).toBeInTheDocument()
    expect(AgentReport.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        NOTION_CONFIG: { THEME: 'fuwari' }
      })
    )
  })
})
