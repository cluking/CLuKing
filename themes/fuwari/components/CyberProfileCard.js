import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { handleEmailClick } from '@/lib/plugins/mailEncrypt'
import { useRef } from 'react'
import CONFIG from '../config'

const DEFAULT_CONTACTS = []
const SAFE_HREF_PATTERN = /^(https?:\/\/|mailto:|\/(?!\/)|#)/i
const UNSAFE_HREF_PATTERN = /^\s*(javascript|data):/i

const isSafeContact = item => {
  if (!item?.href || !item?.label || !item?.icon) return false
  if (item.type === 'email') return !UNSAFE_HREF_PATTERN.test(item.href)
  return SAFE_HREF_PATTERN.test(item.href)
}

const getCyberContacts = () => {
  const contacts = siteConfig('FUWARI_PROFILE_CYBER_CONTACTS', DEFAULT_CONTACTS, CONFIG)
  return Array.isArray(contacts)
    ? contacts.filter(isSafeContact)
    : DEFAULT_CONTACTS
}

const CyberProfileCard = ({ siteInfo, title, description }) => {
  const emailIcon = useRef(null)
  const userId = siteConfig('AUTHOR') || title
  const status = description || siteConfig('DESCRIPTION')
  const contacts = getCyberContacts()

  return (
    <section className='cyber-profile-card'>
      <div className='cyber-profile-scanline' aria-hidden='true' />
      <SmartLink href={siteConfig('FUWARI_PROFILE_PATH', '/about', CONFIG)} className='cyber-profile-core' aria-label={`View profile for ${userId}`}>
        <span className='cyber-profile-avatar-shell'>
          <LazyImage
            src={siteInfo?.icon}
            alt={userId}
            className='cyber-profile-avatar'
          />
        </span>
      </SmartLink>

      <div className='cyber-profile-terminal'>
        <p className='cyber-profile-row cyber-profile-user'>
          <span className='cyber-profile-key'>USER_ID:</span>
          <span className='cyber-profile-value'>{userId}</span>
        </p>
        {status && (
          <p className='cyber-profile-row cyber-profile-status'>
            <span className='cyber-profile-key'>STATUS:</span>
            <span className='cyber-profile-status-value'>{status}</span>
          </p>
        )}
      </div>

      {contacts.length > 0 && (
        <nav className='cyber-profile-links' aria-label='Cyber profile contacts'>
          {contacts.map((item, index) => {
            const isMail = item.type === 'email'
            return (
              <a
                key={`${item.type || item.label}-${item.href}-${index}`}
                href={isMail ? undefined : item.href}
                role={isMail ? 'link' : undefined}
                tabIndex={isMail ? 0 : undefined}
                onClick={isMail ? e => handleEmailClick(e, emailIcon, item.href) : undefined}
                onKeyDown={isMail ? e => {
                  if (e.key === 'Enter' || e.key === ' ') handleEmailClick(e, emailIcon, item.href)
                } : undefined}
                target={isMail ? undefined : '_blank'}
                rel={isMail ? undefined : 'noopener noreferrer'}
                ref={isMail ? emailIcon : undefined}
                className='cyber-profile-link'
                aria-label={item.label}>
                <i className={item.icon} aria-hidden='true' />
                <span>[ {item.label} ]</span>
              </a>
            )
          })}
        </nav>
      )}
    </section>
  )
}

export default CyberProfileCard
