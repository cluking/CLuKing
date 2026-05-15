const HomeBentoHeader = ({ config = {} }) => {
  const title = config.title || 'CLuKing'
  const eyebrow = config.eyebrow || 'ROOT / GROWTH / CODE'

  return (
    <header className='cluking-bento-header'>
      <div className='cluking-loader' aria-hidden='true'>
        <svg viewBox='0 0 100 100' className='cluking-loader-mark'>
          <defs>
            <linearGradient id='cluking-loader-gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
              <stop offset='0%' stopColor='#ca1eb3' />
              <stop offset='48%' stopColor='#fd2e24' />
              <stop offset='100%' stopColor='#ffd701' />
            </linearGradient>
          </defs>
          <circle className='cluking-loader-dash' cx='50' cy='50' r='45' fill='none' stroke='url(#cluking-loader-gradient)' strokeWidth='8' strokeLinecap='round' />
          <circle className='cluking-loader-spin' cx='50' cy='50' r='30' fill='none' stroke='#ff8d79' strokeWidth='6' strokeLinecap='round' />
        </svg>
      </div>
      <h1 className='fuwari-home-title cluking-name'>{title}</h1>
      <p className='cluking-eyebrow'>{eyebrow}</p>
    </header>
  )
}

export default HomeBentoHeader
