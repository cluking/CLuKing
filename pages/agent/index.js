import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import AgentReport from '@/themes/fuwari/components/AgentReport'

const AGENT_THEME = 'fuwari'

const Agent = props => {
  return <AgentReport {...props} />
}

export async function getStaticProps(req) {
  const { locale } = req
  const props = await fetchGlobalAllData({ from: 'agent', locale })

  delete props.allPages

  props.NOTION_CONFIG = {
    ...props.NOTION_CONFIG,
    THEME: AGENT_THEME
  }

  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export default Agent
