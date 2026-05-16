import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import AdCard from './AdCard'
import AnalyticsCard from './AnalyticsCard'
import Announcement from './Announcement'
import Calendar from './Calendar'
import ContactCard from './ContactCard'
import CONFIG from '../config'
import DigitalProfileCard from './DigitalProfileCard'
import PluginCard from './PluginCard'
import Toc from './Toc'

const SidePanel = props => {
  const {
    latestPosts = [],
    categoryOptions = [],
    tagOptions = [],
    post,
    notice,
    rightAreaSlot,
    postCount,
    siteInfo
  } = props
  const { locale } = useGlobal()
  const title = siteConfig('TITLE')
  const description = siteConfig('DESCRIPTION')
  const showToc =
    siteConfig('FUWARI_ARTICLE_TOC', true, CONFIG) &&
    post?.toc &&
    post.toc.length > 1

  return (
    <aside className='space-y-4'>
      <DigitalProfileCard
        siteInfo={siteInfo}
        title={title}
        description={description}
      />

      {showToc && (
        <section className='fuwari-card p-4'>
          <h3 className='text-sm font-semibold mb-3 px-3 tracking-wide uppercase text-[var(--fuwari-muted)]'>
            {locale?.ARTICLE?.TABLE_OF_CONTENT || '目录'}
          </h3>
          <Toc toc={post.toc} />
        </section>
      )}

      {siteConfig('FUWARI_WIDGET_NOTICE', true, CONFIG) &&
        notice &&
        Object.keys(notice).length > 0 && (
          <Announcement post={notice} title={locale?.COMMON?.ANNOUNCEMENT || '公告'} className='p-5' />
      )}

      {siteConfig('FUWARI_WIDGET_LATEST_POSTS', true, CONFIG) && latestPosts.length > 0 && (
        <section className='fuwari-card fuwari-dashboard-widget fuwari-dashboard-widget-feed p-5'>
          <div className='fuwari-dashboard-widget-head'>
            <h3 className='fuwari-dashboard-widget-title'>
              <span className='fuwari-dashboard-status-dot' aria-hidden='true' />
              {locale?.COMMON?.LATEST_POSTS || '最新发布'}
            </h3>
            <span className='fuwari-dashboard-widget-code'>{`FEED/${latestPosts.slice(0, 6).length}`}</span>
          </div>
          <div className='space-y-2'>
            {latestPosts.slice(0, 6).map((p, index) => (
              <SmartLink
                key={p.id}
                href={p.href || `/${p.slug}`}
                className='fuwari-side-post-link'>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{p.title}</strong>
              </SmartLink>
            ))}
          </div>
        </section>
      )}

      {siteConfig('FUWARI_WIDGET_CATEGORY_LIST', true, CONFIG) && categoryOptions.length > 0 && (
        <section className='fuwari-card fuwari-dashboard-widget p-5'>
          <div className='fuwari-dashboard-widget-head'>
            <h3 className='fuwari-dashboard-widget-title'>
              <span className='fuwari-dashboard-status-dot' aria-hidden='true' />
              {locale?.COMMON?.CATEGORY || '分类'}
            </h3>
            <span className='fuwari-dashboard-widget-code'>{`CAT/${categoryOptions.length}`}</span>
          </div>
          <div className='flex flex-wrap gap-2'>
            {categoryOptions.slice(0, 14).map(c => (
              <SmartLink
                key={c.name}
                href={`/category/${encodeURIComponent(c.name)}`}
                className='fuwari-chip fuwari-dashboard-chip'>
                <span>{c.name}</span>
                {c.count ? <em>{c.count}</em> : null}
              </SmartLink>
            ))}
          </div>
        </section>
      )}

      {siteConfig('FUWARI_WIDGET_TAG_LIST', true, CONFIG) && tagOptions.length > 0 && (
        <section className='fuwari-card fuwari-dashboard-widget p-5'>
          <div className='fuwari-dashboard-widget-head'>
            <h3 className='fuwari-dashboard-widget-title'>
              <span className='fuwari-dashboard-status-dot' aria-hidden='true' />
              {locale?.COMMON?.TAGS || '标签'}
            </h3>
            <span className='fuwari-dashboard-widget-code'>{`TAG/${tagOptions.length}`}</span>
          </div>
          <div className='flex flex-wrap gap-2'>
            {tagOptions.slice(0, 28).map(t => (
              <SmartLink
                key={t.name}
                href={`/tag/${encodeURIComponent(t.name)}`}
                className='fuwari-chip fuwari-dashboard-chip'>
                <span>#{t.name}</span>
              </SmartLink>
            ))}
          </div>
        </section>
      )}

      {siteConfig('FUWARI_WIDGET_CALENDAR', true, CONFIG) && (
        <Calendar
          postDates={(latestPosts || []).map(p => p.publishDay).filter(Boolean)}
        />
      )}

      <ContactCard />
      <AnalyticsCard
        postCount={postCount}
        categoryOptions={categoryOptions}
        tagOptions={tagOptions}
      />
      <AdCard />
      <PluginCard rightAreaSlot={rightAreaSlot} />
    </aside>
  )
}

export default SidePanel

