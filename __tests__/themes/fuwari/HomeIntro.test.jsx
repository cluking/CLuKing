/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires, react/display-name */
import { render, screen } from '@testing-library/react'

jest.mock('@/components/NotionPage', () => () => null)
jest.mock('@/components/ShareBar', () => () => null)
jest.mock('@/components/SmartLink', () => ({ children, href, ...props }) => <a href={href} {...props}>{children}</a>)
jest.mock('@/components/Mark', () => jest.fn())
const mockThemeConfigOverrides = {}

jest.mock('@/lib/config', () => ({
  siteConfig: (key, fallback) => {
    const values = {
      LANG: 'zh-CN',
      TITLE: 'CLuKing',
      AUTHOR: 'CLuKing',
      DESCRIPTION: 'Test description',
      ...mockThemeConfigOverrides
    }
    return values[key] ?? fallback
  }
}))
jest.mock('@/lib/utils', () => ({ isBrowser: false }))
jest.mock('@/lib/utils/lang', () => ({ generateLocaleDict: () => ({ NAV: { ARCHIVE: '归档' }, COMMON: { LATEST_POSTS: '最新文章' } }) }))
jest.mock('@/themes/fuwari/components/PostList', () => () => null)
jest.mock('@/themes/fuwari/components/Pagination', () => () => null)
jest.mock('@/themes/fuwari/components/RightFloatArea', () => () => null)
jest.mock('@/themes/fuwari/components/SidePanel', () => () => null)
jest.mock('@/themes/fuwari/components/HeroBanner', () => () => null)

const { LayoutIndex } = require('@/themes/fuwari')

describe('fuwari home intro', () => {
  beforeEach(() => {
    Object.keys(mockThemeConfigOverrides).forEach(key => delete mockThemeConfigOverrides[key])
  })

  it('renders the CLuKing landing identity', () => {
    render(<LayoutIndex page={1} posts={[]} latestPosts={[]} postCount={0} />)

    expect(screen.getByRole('heading', { name: 'CLuKing' })).toBeInTheDocument()
    expect(screen.getByText('向下扎根 · 向上生长')).toBeInTheDocument()
    expect(screen.getAllByText('langding').length).toBeGreaterThan(0)
  })

  it('renders configured Bento copy', () => {
    mockThemeConfigOverrides.FUWARI_HOME_BENTO_HEADER = {
      title: 'Configured King',
      eyebrow: 'CONFIG / ROOT'
    }
    mockThemeConfigOverrides.FUWARI_HOME_BENTO_SUNSET = {
      title: '配置化生长',
      description: '这段文字来自 Fuwari Theme Config。'
    }
    mockThemeConfigOverrides.FUWARI_HOME_BENTO_TERMINAL = {
      title: 'deploy',
      prompt: '~/configured',
      text: 'online',
      status: 'status: configured'
    }

    render(<LayoutIndex page={1} posts={[]} latestPosts={[]} postCount={0} />)

    expect(screen.getByRole('heading', { name: 'Configured King' })).toBeInTheDocument()
    expect(screen.getByText('CONFIG / ROOT')).toBeInTheDocument()
    expect(screen.getByText('配置化生长')).toBeInTheDocument()
    expect(screen.getByText('这段文字来自 Fuwari Theme Config。')).toBeInTheDocument()
    expect(screen.getByText('~/configured')).toBeInTheDocument()
    expect(screen.getByText('online')).toBeInTheDocument()
    expect(screen.getByText('status: configured')).toBeInTheDocument()
  })
})
