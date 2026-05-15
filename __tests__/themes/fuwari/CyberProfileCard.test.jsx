/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires, react/display-name */
import { render, screen } from '@testing-library/react'

const mockConfig = {}
const mockEmailClick = jest.fn(e => e.preventDefault())

jest.mock('@/components/SmartLink', () => ({ children, href, ...props }) => <a href={href} {...props}>{children}</a>)
jest.mock('@/components/LazyImage', () => ({ src, alt, className }) => <img src={src} alt={alt} className={className} />)
jest.mock('@/lib/plugins/mailEncrypt', () => ({
  handleEmailClick: (...args) => mockEmailClick(...args)
}))
jest.mock('@/lib/config', () => ({
  siteConfig: (key, fallback) => {
    const values = {
      AUTHOR: 'CLuKing',
      TITLE: 'CLuKing',
      DESCRIPTION: '向下扎根 · 向上生长',
      FUWARI_PROFILE_PATH: '/about',
      FUWARI_PROFILE_CYBER_CONTACTS: [],
      ...mockConfig
    }
    return values[key] ?? fallback
  }
}))

const CyberProfileCard = require('@/themes/fuwari/components/CyberProfileCard').default

describe('CyberProfileCard', () => {
  beforeEach(() => {
    Object.keys(mockConfig).forEach(key => delete mockConfig[key])
    mockEmailClick.mockClear()
  })

  it('renders terminal-style identity rows', () => {
    render(<CyberProfileCard siteInfo={{ icon: '/avatar.png' }} title='CLuKing' description='向下扎根 · 向上生长' />)

    expect(screen.getByText('USER_ID:')).toBeInTheDocument()
    expect(screen.getByText('CLuKing')).toBeInTheDocument()
    expect(screen.getByText('STATUS:')).toBeInTheDocument()
    expect(screen.getByText('向下扎根 · 向上生长')).toBeInTheDocument()
    expect(screen.getByAltText('CLuKing')).toHaveAttribute('src', '/avatar.png')
    expect(screen.getByRole('link', { name: 'View profile for CLuKing' })).toHaveAttribute('href', '/about')
  })

  it('renders only configured cyber contacts with href values', () => {
    mockConfig.FUWARI_PROFILE_CYBER_CONTACTS = [
      { type: 'github', label: 'GitHub', href: 'https://github.com/cluking', icon: 'fab fa-github' },
      { type: 'wechat', label: 'WeChat', href: '', icon: 'fab fa-weixin' },
      { type: 'qq', label: 'QQ', icon: 'fab fa-qq' },
      { type: 'email', label: 'Email', href: 'hello@example.com', icon: 'fas fa-envelope' }
    ]

    render(<CyberProfileCard siteInfo={{ icon: '/avatar.png' }} title='CLuKing' description='向下扎根 · 向上生长' />)

    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/cluking')
    expect(screen.getByRole('link', { name: 'Email' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'WeChat' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'QQ' })).not.toBeInTheDocument()
  })

  it('routes email contact clicks through the email encrypt handler without a preset href', () => {
    mockConfig.FUWARI_PROFILE_CYBER_CONTACTS = [
      { type: 'email', label: 'Email', href: 'hello@example.com', icon: 'fas fa-envelope' }
    ]

    render(<CyberProfileCard siteInfo={{ icon: '/avatar.png' }} title='CLuKing' description='向下扎根 · 向上生长' />)
    const emailLink = screen.getByRole('link', { name: 'Email' })
    emailLink.click()

    expect(emailLink).not.toHaveAttribute('href')
    expect(mockEmailClick).toHaveBeenCalledTimes(1)
  })

  it('routes keyboard activation on email contacts through the email encrypt handler', () => {
    mockConfig.FUWARI_PROFILE_CYBER_CONTACTS = [
      { type: 'email', label: 'Email', href: 'hello@example.com', icon: 'fas fa-envelope' }
    ]

    render(<CyberProfileCard siteInfo={{ icon: '/avatar.png' }} title='CLuKing' description='向下扎根 · 向上生长' />)
    screen.getByRole('link', { name: 'Email' }).focus()
    screen.getByRole('link', { name: 'Email' }).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

    expect(mockEmailClick).toHaveBeenCalledTimes(1)
  })

  it('does not render contacts with unsafe href values', () => {
    mockConfig.FUWARI_PROFILE_CYBER_CONTACTS = [
      { type: 'github', label: 'GitHub', href: 'javascript:alert(1)', icon: 'fab fa-github' },
      { type: 'qq', label: 'QQ', href: '//evil.example', icon: 'fab fa-qq' },
      { type: 'wechat', label: 'WeChat', href: '/about', icon: 'fab fa-weixin' }
    ]

    render(<CyberProfileCard siteInfo={{ icon: '/avatar.png' }} title='CLuKing' description='向下扎根 · 向上生长' />)

    expect(screen.queryByRole('link', { name: 'GitHub' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'QQ' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'WeChat' })).toHaveAttribute('href', '/about')
  })
})
