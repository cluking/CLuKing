import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

const HeroBanner = ({ siteInfo }) => {
  if (!siteConfig('FUWARI_HERO_ENABLE', true, CONFIG)) return null

  const title = siteConfig('TITLE') || siteInfo?.title
  const description = siteConfig('DESCRIPTION') || siteInfo?.description
  const author = siteConfig('AUTHOR') || title
  const cover =
    siteInfo?.pageCover ||
    siteConfig('FUWARI_HERO_BG_IMAGE', '', CONFIG) ||
    siteConfig('HOME_BANNER_IMAGE')

  return (
    <section className='fuwari-hero mb-4 overflow-hidden'>
      {cover && (
        <div
          className='fuwari-hero-bg'
          style={{ backgroundImage: `url(${cover})` }}
        />
      )}
      <div className='fuwari-hero-mask' />
      <div className='fuwari-hero-content max-w-6xl mx-auto px-4 relative z-[3]'>
        {author && <p className='fuwari-hero-kicker'>{author}</p>}
        {title && <h1 className='fuwari-hero-title'>{title}</h1>}
        {description && (
          <p className='fuwari-hero-description'>{description}</p>
        )}
        <div className='fuwari-hero-actions'>
          <SmartLink href='#posts-wrapper' className='fuwari-hero-btn'>
            开始阅读
          </SmartLink>
          <SmartLink href='/archive' className='fuwari-hero-btn fuwari-hero-btn-soft'>
            查看归档
          </SmartLink>
        </div>
      </div>
      {siteConfig('FUWARI_HERO_CREDIT_TEXT', '', CONFIG) && (
        <div className='max-w-6xl mx-auto px-4 relative z-[3]'>
          <SmartLink
            href={siteConfig('FUWARI_HERO_CREDIT_LINK', '#', CONFIG)}
            className='fuwari-hero-credit'
            target='_blank'
            rel='noopener noreferrer'>
            © {siteConfig('FUWARI_HERO_CREDIT_TEXT', '', CONFIG)}
          </SmartLink>
        </div>
      )}
    </section>
  )
}

export default HeroBanner

