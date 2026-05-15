const HomeSunsetCard = ({ config = {} }) => {
  const title = config.title || '向下扎根 · 向上生长'
  const description = config.description || '沉到土壤深处，把每一次热爱写成新的年轮。'

  return (
    <div className='cluking-bento-card cluking-signature-card' aria-label='个签'>
      <div className='cluking-signature-content'>
        <svg className='cluking-sunset-svg' viewBox='0 0 313 180' aria-hidden='true'>
          <defs>
            <linearGradient id='cluking-sun-gradient' x1='0%' y1='0%' x2='0%' y2='100%'>
              <stop offset='0%' stopColor='#ffd701' />
              <stop offset='54%' stopColor='#fd2e24' />
              <stop offset='100%' stopColor='#ca1eb3' />
            </linearGradient>
          </defs>
          <circle cx='156.5' cy='74' r='58' fill='url(#cluking-sun-gradient)' />
          <path d='M0 138 C48 102 82 159 126 128 C171 96 201 161 251 127 C279 108 295 115 313 105 L313 180 L0 180 Z' fill='#080808' />
        </svg>
        <div className='cluking-signature-details'>
          <p className='cluking-signature-title'>{title}</p>
          <p className='cluking-signature-body'>{description}</p>
        </div>
      </div>
    </div>
  )
}

export default HomeSunsetCard
