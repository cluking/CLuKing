import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import SocialButton from './SocialButton'

const DigitalProfileCard = ({ siteInfo, title, description }) => {
  const userId = siteConfig('AUTHOR') || title || 'Profile'
  const status = description || siteConfig('DESCRIPTION')
  const profilePath = siteConfig('FUWARI_PROFILE_PATH', '/about', CONFIG)

  return (
    <section className='fuwari-card fuwari-profile-card fuwari-digital-pass'>
      <span className='fuwari-digital-pass-glow fuwari-digital-pass-glow-warm' aria-hidden='true' />
      <span className='fuwari-digital-pass-glow fuwari-digital-pass-glow-cool' aria-hidden='true' />

      <SmartLink
        href={profilePath}
        className='fuwari-digital-pass-core'>
        <span className='fuwari-digital-pass-avatar-shell'>
          <LazyImage
            src={siteInfo?.icon}
            alt={userId}
            className='fuwari-digital-pass-avatar'
          />
        </span>

        <span className='fuwari-digital-pass-copy'>
          <span className='fuwari-digital-pass-kicker'>PROFILE</span>
          <span className='fuwari-digital-pass-name'>{userId}</span>
          {status && (
            <span className='fuwari-digital-pass-description'>{status}</span>
          )}
        </span>
      </SmartLink>

      <SocialButton
        as='nav'
        className='fuwari-digital-pass-social flex items-center justify-center gap-2 flex-wrap'
        ariaLabel='profile contact links'
      />
    </section>
  )
}

export default DigitalProfileCard
