const HomeTerminalCard = ({ config = {} }) => {
  const title = config.title || 'langding'
  const prompt = config.prompt || '~/cluking'
  const text = config.text || 'langding'
  const status = config.status || 'status: rooted · growing · online'

  return (
    <div className='cluking-bento-card cluking-langding-stage' aria-label={`${title} 卡片`}>
      <div className='cluking-glow-disc' aria-hidden='true' />
      <div className='cluking-terminal-loader'>
        <div className='cluking-terminal-header'>
          <span className='cluking-terminal-title'>{title}</span>
          <span className='cluking-terminal-controls' aria-hidden='true'>
            <span className='cluking-terminal-control cluking-terminal-close' />
            <span className='cluking-terminal-control cluking-terminal-minimize' />
            <span className='cluking-terminal-control cluking-terminal-maximize' />
          </span>
        </div>
        <div className='cluking-terminal-screen'>
          <span className='cluking-terminal-prompt'>{prompt}</span>
          <span className='cluking-terminal-text'>{text}</span>
          <span className='cluking-terminal-status'>{status}</span>
        </div>
      </div>
    </div>
  )
}

export default HomeTerminalCard
