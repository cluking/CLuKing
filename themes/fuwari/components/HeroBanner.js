import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

const HeroBanner = ({ siteInfo }) => {
  if (!siteConfig('FUWARI_HERO_ENABLE', true, CONFIG)) return null

  const cover =
    siteInfo?.pageCover ||
    siteConfig('FUWARI_HERO_BG_IMAGE', '', CONFIG) ||
    siteConfig('HOME_BANNER_IMAGE')

  return (
    <section className='fuwari-hero mb-4 overflow-hidden' aria-hidden='true'>
      {cover && (
        <div
          className='fuwari-hero-bg'
          style={{ backgroundImage: `url(${cover})` }}
        />
      )}
      <div className='fuwari-hero-mask' />
    </section>
  )
}

export default HeroBanner

