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
