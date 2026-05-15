# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

CLuKing is a Next.js 14 blog that uses **Notion as a headless CMS**. Content lives in Notion databases and is rendered through swappable themes. It's based on NotionNext with the `fuwari` theme as the current default.

## Development commands

```bash
yarn dev                    # Start Next.js dev server (port 3000)
yarn build                  # Production build
yarn start                  # Start production server (must build first)
yarn export                 # Static export to /out (for GitHub Pages, Cloudflare Pages, etc.)

yarn lint                   # ESLint check
yarn lint:fix               # ESLint auto-fix
yarn type-check             # TypeScript check (tsc --noEmit)
yarn format                 # Prettier format all files
yarn pre-commit             # lint:fix + format + type-check (run before commits)

yarn test                   # Run Jest tests
yarn test:watch             # Jest in watch mode
yarn test:coverage          # Jest with coverage report

yarn bundle-report          # Build with bundle analyzer (ANALYZE=true)
yarn clean                  # Clean cache and build artifacts

yarn deps:install           # Install dependencies (frozen lockfile)
```

**Node version**: See `.nvmrc` (Node 20 LTS). **Package manager**: Yarn 1.22.22 only — do not use npm/pnpm. **CI validates** `yarn install --frozen-lockfile`.

## Architecture

### Notion as CMS

All content lives in Notion databases identified by `NOTION_PAGE_ID` (in `.env.local` or `blog.config.js`). The app uses `notion-client` (v7.10.0) — the **unofficial** Notion API — to fetch page blocks. Key data flow:

1. `lib/db/SiteDataApi.js` → `fetchGlobalAllData()` fetches the Notion database, parses all pages, tags, categories, and config
2. `lib/db/notion/` contains all Notion-specific fetch/parse/normalize logic
3. `lib/db/notion/getNotionConfig.js` reads site config from a special `Config` page type within the Notion database
4. `lib/site/` has a newer TypeScript adapter layer (`site.service.ts` → `adapters/notion/`)

### Config cascade

Runtime configuration is resolved through `lib/config.js` → `siteConfig(key)`. Priority order:

1. Notion database `Config` page (highest)
2. Notion database `ThemeConfig` page
3. Theme's own `CONFIG` export
4. `blog.config.js` defaults
5. `conf/*.config.js` files (comments, analytics, plugins, etc.)

Special keys like `THEME`, `NEXT_REVALIDATE_SECOND`, `POSTS_PER_PAGE` are only resolved server-side via `extendConfig`.

### Theme system

Themes live in `/themes/<name>/`. Each theme is a directory with at minimum an `index.js` that exports named layout components:

- **`LayoutBase`** — page shell (header, sidebar, footer)
- **`LayoutIndex`** — home page
- **`LayoutSlug`** — single article page
- **`LayoutPostList`** — category/tag filtered list
- **`LayoutSearch`**, **`LayoutArchive`**, **`Layout404`**, **`LayoutCategoryIndex`**, **`LayoutTagIndex`**

`themes/theme.js` loads layouts via `next/dynamic` with SSR, resolving the theme name from: URL `?theme=` param → Notion config → `blog.config.js` → fallback to `BLOG.THEME`.

Theme also exports `THEME_CONFIG` — the theme's own default configuration object.

To add a theme, create a folder under `/themes/` with an `index.js` exporting the required layouts.

### Page routing

Next.js pages in `/pages/` are thin wrappers that:
1. Call `getStaticProps` → `fetchGlobalAllData()` to get all site data from Notion
2. Pass data through `DynamicLayout` from `themes/theme.js`, which loads the theme's layout by name

Key pages:
- `/pages/index.js` — home (uses `LayoutIndex`)
- `/pages/[prefix]/[slug]/index.js` — article page (uses `LayoutSlug`)
- `/pages/archive/`, `/pages/search/`, `/pages/tag/`, `/pages/category/` — list pages

### Caching layers

`lib/cache/cache_manager.js` provides multi-tier caching: **memory → local file → Redis**. Controlled by `ENABLE_CACHE` in `conf/dev.config.js`. The cache prevents redundant Notion API calls during builds and ISR. Build phase always enables local file cache. Redis is optional (set `REDIS_URL`).

### Multi-language

`NOTION_PAGE_ID` can be a comma-separated list with locale prefixes: `pageId,en:otherPageId,zh:anotherPageId`. Locale is extracted via `lib/utils/pageId.js` → `extractLangPrefix()`. Translations live in `lib/lang/<locale>.js`. The locale is determined by Next.js i18n routing.

### Middleware (`middleware.ts`)

Two modes: with Clerk (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` set) — protects `/dashboard` routes; without Clerk — handles UUID-to-slug redirects via `redirect.json`.

### ISR and build modes

- **Dev**: Live Notion data (caching disabled by default)
- **Build**: `yarn build` sets `BUILD_MODE=true`, generates RSS/sitemap/robots during `getStaticProps`
- **Export**: `yarn export` sets `EXPORT=true`, outputs static files to `/out`
- Revalidation interval: `NEXT_REVALIDATE_SECOND` (default 60s)

### Path aliases

`@/` maps to the project root (configured in both `jsconfig.json` and `next.config.js` webpack alias). Import as `@/lib/utils`, `@/components/Foo`, `@/themes/theme`, etc.

## Key conventions

- **Components**: PascalCase files in `/components/` (shared) or `/themes/<name>/components/` (theme-specific)
- **Naming**: kebab-case files, camelCase variables, PascalCase components, UPPER_SNAKE_CASE constants
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, etc.)
- **Styles**: Tailwind CSS + theme-specific `style.js` (uses `@emotion/styled` or template literals)
- **Images**: All remote image patterns allowed (`next.config.js`), `mapImgUrl()` handles Notion image URL transformation

## Notion database structure

The Notion database must have a `Config` page (type=Config), a `ThemeConfig` page (type=ThemeConfig), and content pages. Key properties defined in `conf/notion.config.js` — column name mappings like `NOTION_PROPERTY_NAME.tags`, `.category`, `.type`, `.status`, `.slug`, `.date`, `.password`, etc.
