'use client'

import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import ShareBar from '@/components/ShareBar'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { isBrowser } from '@/lib/utils'
import { generateLocaleDict } from '@/lib/utils/lang'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import ArchiveList from './components/ArchiveList'
import ArticleAdjacent from './components/ArticleAdjacent'
import ArticleCopyright from './components/ArticleCopyright'
import ArticleHeader from './components/ArticleHeader'
import ArticleLock from './components/ArticleLock'
import Footer from './components/Footer'
import Header from './components/Header'
import ArticleHeroCover from './components/ArticleHeroCover'
import HeroBanner from './components/HeroBanner'
import Pagination from './components/Pagination'
import PostList from './components/PostList'
import RightFloatArea from './components/RightFloatArea'
import SidePanel from './components/SidePanel'
import CONFIG from './config'
import { Style } from './style'
import { isCommentServiceConfigured } from './utils/commentEnabled'

const Comment = dynamic(() => import('@/components/Comment'), { ssr: false })

const AlgoliaSearchModal = dynamic(
  () => import('@/components/AlgoliaSearchModal'),
  { ssr: false }
)
const Lenis = dynamic(() => import('@/components/Lenis'), { ssr: false })
const CursorDot = dynamic(() => import('@/components/CursorDot'), { ssr: false })
const getLocale = () => generateLocaleDict(siteConfig('LANG', 'zh-CN'))

const LayoutBase = props => {
  const { children } = props
  const locale = getLocale()
  const searchModal = useRef(null)
  const router = useRouter()
  const showHomeHero =
    !props.post &&
    (router.pathname === '/' || router.pathname === '/page/[page]')

  return (
    <div
      id='theme-fuwari'
      className={`${siteConfig('FONT_STYLE')} fuwari-bg min-h-screen text-[var(--fuwari-text)]`}>
      <Style />
      <Header
        locale={locale}
        customNav={props.customNav}
        customMenu={props.customMenu}
        searchModal={searchModal}
      />
      <AlgoliaSearchModal cRef={searchModal} {...props} />

      {showHomeHero && <HeroBanner siteInfo={props.siteInfo} />}

      <main
        className={`max-w-6xl mx-auto px-3 md:px-4 pb-12 min-w-0 w-full ${showHomeHero ? 'fuwari-main-overlap' : ''}`}>
        <div className='grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-4 lg:gap-6 items-start min-w-0'>
          <div className='hidden lg:block sticky top-4'>
            <SidePanel {...props} />
          </div>
          <section className='min-w-0 w-full max-w-full'>
            {children}
            <div className='lg:hidden mt-4'>
              <SidePanel {...props} />
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <RightFloatArea post={props.post} />
      {siteConfig('FUWARI_EFFECT_LENIS', false, CONFIG) && <Lenis />}
      {siteConfig('FUWARI_EFFECT_CURSOR_DOT', false, CONFIG) && <CursorDot />}
    </div>
  )
}

const HomeIntro = ({ siteProps, locale }) => {
  const posts = siteProps.posts || []
  const featuredPosts = (siteProps.latestPosts?.length ? siteProps.latestPosts : posts).slice(0, 2)
  const primaryPost = featuredPosts[0]
  const secondaryPost = featuredPosts[1]
  const primaryHref = primaryPost?.href || (primaryPost?.slug ? `/${primaryPost.slug}` : '/archive')

  return (
    <section className='fuwari-home-intro fuwari-card p-5 md:p-6 mb-4 overflow-hidden'>
      <div className='fuwari-snake-track' aria-hidden='true'>
        <span className='fuwari-snake-orb fuwari-snake-orb-one' />
        <span className='fuwari-snake-orb fuwari-snake-orb-two' />
      </div>
      <div className='fuwari-home-intro-main'>
        <div className='fuwari-home-copy min-w-0'>
          <p className='fuwari-home-kicker'>{siteConfig('AUTHOR') || siteConfig('TITLE')}</p>
          <h1 className='fuwari-home-title'>{siteConfig('TITLE')}</h1>
          {siteConfig('DESCRIPTION') && (
            <p className='fuwari-home-description'>
              {siteConfig('DESCRIPTION')}
            </p>
          )}
          <div className='fuwari-home-actions'>
            <SmartLink href={primaryHref} className='fuwari-home-action-primary'>
              阅读精选
              <i className='fas fa-arrow-right' aria-hidden='true' />
            </SmartLink>
            <SmartLink href='/archive' className='fuwari-home-action'>
              {locale?.NAV?.ARCHIVE || '归档'}
            </SmartLink>
          </div>
        </div>

        <div className='fuwari-home-showcase' aria-label='精选内容'>
          <div className='fuwari-orbit-stage' aria-hidden='true'>
            <span className='fuwari-orbit-ring fuwari-orbit-ring-one' />
            <span className='fuwari-orbit-ring fuwari-orbit-ring-two' />
            <span className='fuwari-orbit-core' />
            <span className='fuwari-orbit-dot fuwari-orbit-dot-one' />
            <span className='fuwari-orbit-dot fuwari-orbit-dot-two' />
            <span className='fuwari-orbit-dot fuwari-orbit-dot-three' />
          </div>
          <SmartLink href={primaryHref} className='fuwari-home-feature-card'>
            <span className='fuwari-home-feature-badge'>精选阅读</span>
            <strong>{primaryPost?.title || siteConfig('TITLE')}</strong>
            <small>{primaryPost?.publishDay || 'Latest'}</small>
          </SmartLink>
          {secondaryPost && (
            <SmartLink
              href={secondaryPost.href || `/${secondaryPost.slug}`}
              className='fuwari-home-note-card'>
              <span>下一篇灵感</span>
              <strong>{secondaryPost.title}</strong>
            </SmartLink>
          )}
        </div>
      </div>
    </section>
  )
}

const LayoutIndex = props => {
  const locale = getLocale()
  const page = Number(props.page || 1)
  const showIntro = !Number.isFinite(page) || page <= 1

  return (
    <div className='fuwari-home'>
      {showIntro && <HomeIntro siteProps={props} locale={locale} />}
      <div className='fuwari-list-head'>
        <div>
          <p className='fuwari-list-kicker'>最新发布</p>
          <h2 className='fuwari-section-title text-2xl font-bold'>
            {locale?.COMMON?.LATEST_POSTS || '最新文章'}
          </h2>
        </div>
        <SmartLink href='/archive' className='fuwari-list-more'>
          {locale?.NAV?.ARCHIVE || '归档'}
          <i className='fas fa-arrow-right' aria-hidden='true' />
        </SmartLink>
      </div>
      <LayoutPostList {...props} />
    </div>
  )
}

const LayoutPostList = props => {
  const locale = getLocale()
  const { category, tag } = props
  return (
    <>
      {(category || tag) && (
        <div className='fuwari-card p-5 mb-4'>
          <p className='text-sm uppercase tracking-widest text-[var(--fuwari-muted)] mb-2'>
            {category ? (locale?.COMMON?.CATEGORY || '分类') : (locale?.COMMON?.TAGS || '标签')}
          </p>
          <div className='flex items-center gap-2'>
            <h1 className='fuwari-section-title text-2xl font-bold'>
              {category || `#${tag}`}
            </h1>
            <span className='fuwari-chip'>{category ? (locale?.COMMON?.CATEGORY || '分类') : (locale?.COMMON?.TAGS || '标签')}</span>
          </div>
        </div>
      )}
      <PostList posts={props.posts} />
      <Pagination page={props.page} postCount={props.postCount} />
    </>
  )
}

const LayoutSlug = props => {
  const locale = getLocale()
  const { post, lock, validPassword, prev, next } = props
  if (!post) return null
  const showComments =
    siteConfig('FUWARI_ARTICLE_COMMENT', true, CONFIG) && isCommentServiceConfigured()
  const articleCoverSrc =
    siteConfig('FUWARI_ARTICLE_COVER_HERO', true, CONFIG) &&
    (post.pageCover || post.pageCoverThumbnail)
  return (
    <>
      {lock ? (
        <ArticleLock validPassword={validPassword} />
      ) : (
        <article className='fuwari-card p-6 overflow-hidden'>
          {articleCoverSrc ? (
            <ArticleHeroCover coverSrc={articleCoverSrc} title={post.title} />
          ) : null}
          <ArticleHeader post={post} />
          <div id='article-wrapper' className='fuwari-prose'>
            <NotionPage post={post} />
            {siteConfig('FUWARI_ARTICLE_SHARE', true, CONFIG) && <ShareBar post={post} />}
          </div>
          <ArticleCopyright post={post} />
          <ArticleAdjacent prev={prev} next={next} />
          {showComments && (
            <section className='mt-8 pt-6 border-t border-[var(--fuwari-border)]' aria-label={locale?.COMMON?.COMMENTS || 'Comments'}>
              <h2 className='text-base font-semibold mb-4 text-[var(--fuwari-text)] flex items-center gap-2'>
                <i className='far fa-comments text-[var(--fuwari-muted)]' aria-hidden='true' />
                {locale?.COMMON?.COMMENTS || 'Comments'}
              </h2>
              <Comment frontMatter={post} className='fuwari-comment !mt-0' />
            </section>
          )}
        </article>
      )}
    </>
  )
}

const LayoutSearch = props => {
  const { keyword } = props
  const router = useRouter()

  useEffect(() => {
    if (isBrowser && keyword) {
      replaceSearchResult({
        doms: document.getElementById('posts-wrapper'),
        search: keyword,
        target: {
          element: 'span',
          className: 'text-red-500 border-b border-dashed'
        }
      })
    }
  }, [router, keyword])

  return <LayoutPostList {...props} />
}

const LayoutArchive = props => {
  const locale = getLocale()
  return (
    <>
      <div className='fuwari-card p-6 mb-4'>
        <p className='text-sm uppercase tracking-widest text-[var(--fuwari-muted)] mb-2'>
          {locale?.NAV?.ARCHIVE || '归档'}
        </p>
        <h1 className='text-3xl font-bold leading-tight'>{locale?.NAV?.ARCHIVE || '归档'}</h1>
      </div>
      <ArchiveList archivePosts={props.archivePosts || {}} />
    </>
  )
}

const Layout404 = () => {
  const locale = getLocale()
  return (
    <div className='fuwari-card p-8 text-center'>
      <h1 className='text-4xl font-bold mb-2'>404</h1>
      <p className='text-sm text-[var(--fuwari-muted)] mb-4'>
        {locale?.NAV?.['404'] || '页面不存在'}
      </p>
      <SmartLink href='/' className='fuwari-link'>{locale?.NAV?.INDEX || '首页'}</SmartLink>
    </div>
  )
}

const LayoutCategoryIndex = props => {
  const locale = getLocale()
  const { categoryOptions } = props
  return (
    <div className='fuwari-card p-5'>
      <h2 className='fuwari-section-title text-2xl font-semibold mb-4'>{locale?.COMMON?.CATEGORY || '分类'}</h2>
      <div className='flex flex-wrap gap-2'>
        {(categoryOptions || []).map(c => (
          <SmartLink
            key={c.name}
            href={`/category/${encodeURIComponent(c.name)}`}
            className='fuwari-chip'>
            {c.name} {c.count ? `(${c.count})` : ''}
          </SmartLink>
        ))}
      </div>
    </div>
  )
}

const LayoutTagIndex = props => {
  const locale = getLocale()
  const { tagOptions } = props
  return (
    <div className='fuwari-card p-5'>
      <h2 className='fuwari-section-title text-2xl font-semibold mb-4'>{locale?.COMMON?.TAGS || '标签'}</h2>
      <div className='flex flex-wrap gap-2'>
        {(tagOptions || []).map(t => (
          <SmartLink
            key={t.name}
            href={`/tag/${encodeURIComponent(t.name)}`}
            className='fuwari-chip'>
            #{t.name} {t.count ? `(${t.count})` : ''}
          </SmartLink>
        ))}
      </div>
    </div>
  )
}

export {
  Layout404,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}

