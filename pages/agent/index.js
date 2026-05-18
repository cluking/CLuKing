import BLOG from '@/blog.config'
import {
  AIHOT_USER_AGENT,
  buildAihotUrl,
  normalizeItemsReport,
  normalizeReportQuery
} from '@/lib/aihot/report'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import AgentReport from '@/themes/fuwari/components/AgentReport'

const AGENT_THEME = 'fuwari'

function createSafeInitialReport(report) {
  return {
    ...report,
    source: {
      name: report.source?.name || 'AI HOT'
    }
  }
}

async function fetchInitialReport() {
  const normalizedQuery = normalizeReportQuery({
    view: 'items',
    mode: 'all',
    take: 50
  })
  const response = await fetch(buildAihotUrl(normalizedQuery), {
    headers: {
      'User-Agent': AIHOT_USER_AGENT,
      Accept: 'application/json'
    }
  })

  if (!response.ok) {
    return null
  }

  return createSafeInitialReport(
    normalizeItemsReport(await response.json(), normalizedQuery)
  )
}

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

  try {
    props.initialReport = await fetchInitialReport()
  } catch {
    props.initialReport = null
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
