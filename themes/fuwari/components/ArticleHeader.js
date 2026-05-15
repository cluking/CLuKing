import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import CONFIG from '../config'

const getCurrentSearchQuery = router => {
  const queryString = router?.asPath?.split('?')[1]?.split('#')[0] || ''
  const params = new URLSearchParams(queryString)
  const query = {}
  params.forEach((value, key) => {
    query[key] = value
  })
  return query
}

const getArchiveHref = (publishDay, router) => {
  const query = getCurrentSearchQuery(router)
  if (!publishDay) return { pathname: '/archive', query }
  const str = String(publishDay)
  const matched = str.match(/^(\d{4})[-/.](\d{1,2})/)
  if (!matched) return { pathname: '/archive', query }
  const year = matched[1]
  const month = matched[2].padStart(2, '0')
  return {
    pathname: '/archive',
    query,
    hash: `archive-${year}-${month}`
  }
}

const ArticleHeader = ({ post }) => {
  const router = useRouter()
  if (!post) return null

  const metaItems = []
  if (siteConfig('FUWARI_ARTICLE_META_DATE', true, CONFIG) && post.publishDay) {
    metaItems.push(
      <SmartLink href={getArchiveHref(post.publishDay, router)} className='fuwari-link'>{post.publishDay}</SmartLink>
    )
  }
  if (siteConfig('FUWARI_ARTICLE_META_LAST_EDITED', true, CONFIG) && post.lastEditedDay) {
    metaItems.push(
      <SmartLink href={getArchiveHref(post.lastEditedDay, router)} className='fuwari-link'>{post.lastEditedDay}</SmartLink>
    )
  }
  if (siteConfig('FUWARI_ARTICLE_WORD_COUNT', true, CONFIG) && post.wordCount) {
    metaItems.push(<span>字数 {post.wordCount}</span>)
  }
  if (siteConfig('FUWARI_ARTICLE_READ_TIME', true, CONFIG) && post.readTime) {
    metaItems.push(<span>阅读时长≈ {post.readTime} 分钟</span>)
  }
  if (siteConfig('FUWARI_ARTICLE_META_CATEGORY', true, CONFIG) && post.category) {
    metaItems.push(
      <SmartLink href={`/category/${encodeURIComponent(post.category)}`} className='fuwari-link'>
        {post.category}
      </SmartLink>
    )
  }
  if (siteConfig('FUWARI_ARTICLE_META_TAGS', true, CONFIG) && post.tagItems?.length) {
    metaItems.push(
      <span className='inline-flex flex-wrap items-center gap-1'>
        {post.tagItems.slice(0, 4).map((tag, idx) => (
          <SmartLink
            key={tag.name}
            href={`/tag/${encodeURIComponent(tag.name)}`}
            className='fuwari-link'>
            {idx > 0 ? ` / #${tag.name}` : `#${tag.name}`}
          </SmartLink>
        ))}
      </span>
    )
  }

  return (
    <header className='mb-6'>
      <h1 className='text-3xl lg:text-4xl font-bold mb-3 leading-tight'>{post.title}</h1>
      {siteConfig('FUWARI_ARTICLE_META', true, CONFIG) && metaItems.length > 0 && (
        <div className='text-sm text-[var(--fuwari-muted)] flex flex-wrap items-center gap-2'>
          {metaItems.map((item, index) => (
            <span key={index} className='inline-flex items-center gap-2'>
              {index > 0 && <span>·</span>}
              {item}
            </span>
          ))}
        </div>
      )}
    </header>
  )
}

export default ArticleHeader

