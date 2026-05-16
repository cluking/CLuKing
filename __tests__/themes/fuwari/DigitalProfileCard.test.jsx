/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires, react/display-name, @next/next/no-img-element */
import { render, screen } from '@testing-library/react'

jest.mock('@/components/SmartLink', () => ({ children, href, ...props }) => <a href={href} {...props}>{children}</a>)
jest.mock('@/components/LazyImage', () => ({ src, alt, className }) => <img src={src} alt={alt} className={className} />)
const mockHandleEmailClick = jest.fn()

jest.mock('@/lib/plugins/mailEncrypt', () => ({
  handleEmailClick: (...args) => mockHandleEmailClick(...args)
}))

const mockConfig = {
  AUTHOR: 'CLuKing',
  TITLE: 'CLuKing Blog',
  DESCRIPTION: '向下扎根 · 向上生长',
  FUWARI_PROFILE_PATH: '/about',
  CONTACT_GITHUB: 'https://github.com/cluking',
  CONTACT_EMAIL: 'test@example.com',
  ENABLE_RSS: false
}

jest.mock('@/lib/config', () => ({
  siteConfig: (key, fallback) => mockConfig[key] ?? fallback
}))

const DigitalProfileCard = require('@/themes/fuwari/components/DigitalProfileCard').default

describe('DigitalProfileCard', () => {
  beforeEach(() => {
    mockHandleEmailClick.mockClear()
    mockConfig.CONTACT_GITHUB = 'https://github.com/cluking'
    mockConfig.CONTACT_EMAIL = 'test@example.com'
  })

  it('renders a soft profile card with profile metadata', () => {
    render(
      <DigitalProfileCard
        siteInfo={{ icon: '/avatar.png' }}
        title='Fallback Title'
        description='Rooted and growing'
      />
    )

    expect(screen.getByText('PROFILE')).toBeInTheDocument()
    expect(screen.getByText('CLuKing')).toBeInTheDocument()
    expect(screen.getByText('Rooted and growing')).toBeInTheDocument()
    expect(screen.queryByText('CYBER ID')).not.toBeInTheDocument()
    expect(screen.queryByText('USER_ID')).not.toBeInTheDocument()
    expect(screen.queryByText('STATUS')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /CLuKing/ })).toHaveAttribute('href', '/about')
    expect(screen.getByRole('img', { name: 'CLuKing' })).toHaveAttribute('src', '/avatar.png')
  })

  it('keeps existing configured social links inside the pass', () => {
    render(<DigitalProfileCard siteInfo={{ icon: '/avatar.png' }} title='Fallback Title' />)

    const socialNav = screen.getByRole('navigation', { name: 'profile contact links' })
    expect(socialNav).toHaveClass('fuwari-digital-pass-social')
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/cluking')
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('target', '_blank')
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.getByRole('link', { name: 'Email' })).toBeInTheDocument()
  })

  it('does not render an empty social navigation when no contact links are configured', () => {
    mockConfig.CONTACT_GITHUB = undefined
    mockConfig.CONTACT_EMAIL = undefined

    render(<DigitalProfileCard siteInfo={{ icon: '/avatar.png' }} title='Fallback Title' />)

    expect(screen.queryByRole('navigation', { name: 'profile contact links' })).not.toBeInTheDocument()
  })

  it('supports keyboard activation for email without scrolling on Space', () => {
    render(<DigitalProfileCard siteInfo={{ icon: '/avatar.png' }} title='Fallback Title' />)

    const email = screen.getByRole('link', { name: 'Email' })
    const event = new KeyboardEvent('keydown', {
      key: ' ',
      bubbles: true,
      cancelable: true
    })

    email.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(true)
    expect(mockHandleEmailClick).toHaveBeenCalledTimes(1)
    expect(mockHandleEmailClick.mock.calls[0][2]).toBe('test@example.com')
  })
})
