import type { JSX, SVGProps } from 'react'

/**
 * Componente de icono de WhatsApp en formato SVG.
 */
const WhatsAppIcon = (props: SVGProps<SVGSVGElement>): JSX.Element => (
  <svg {...props} fill='none' viewBox='0 0 360 362' role='img'>
    <title>WhatsApp</title>
    <path
      fill='#25D366'
      fillRule='evenodd'
      d='M307.55 52.57C273.71 18.68 228.71 0 180.76 0 81.95 0 1.54 80.4 1.5 179.24c-.02 31.59 8.24 62.43 23.93 89.61L0 361.74l95.02-24.93c26.18 14.29 55.66 21.81 85.66 21.81h.08c98.79 0 179.21-80.41 179.24-179.24.02-47.9-18.61-92.93-52.45-126.81Zm-126.79 275.79h-.06c-26.73-.01-52.95-7.19-75.83-20.77l-5.44-3.23-56.39 14.79 15.05-54.98-3.54-5.64c-14.91-23.72-22.79-51.14-22.78-79.29.04-82.14 66.87-148.97 149.05-148.97 39.79.02 77.2 15.53 105.33 43.7 28.13 28.16 43.61 65.6 43.59 105.4-.03 82.15-66.87 148.98-148.98 148.98Zm81.72-111.58c-4.48-2.24-26.5-13.07-30.61-14.57-4.11-1.5-7.09-2.24-10.07 2.24-2.98 4.49-11.57 14.58-14.18 17.56-2.61 2.99-5.23 3.36-9.7 1.12-4.48-2.24-18.91-6.97-36.02-22.23-13.31-11.88-22.3-26.54-24.92-31.03-2.61-4.49-.28-6.91 1.96-9.14 2.01-2.01 4.48-5.23 6.72-7.85 2.24-2.61 2.98-4.49 4.48-7.47 1.5-2.99.75-5.6-.37-7.85-1.12-2.24-10.07-24.29-13.81-33.25-3.64-8.73-7.33-7.55-10.07-7.69-2.61-.13-5.6-.16-8.59-.16-2.99 0-7.84 1.12-11.95 5.6-4.11 4.49-15.68 15.32-15.68 37.36s16.05 43.34 18.29 46.34c2.24 2.99 31.59 48.23 76.51 67.63 10.68 4.62 19.03 7.37 25.54 9.44 10.73 3.41 20.49 2.93 28.21 1.78 8.6-1.29 26.5-10.84 30.23-21.3 3.73-10.46 3.73-19.43 2.61-21.3-1.12-1.87-4.11-2.99-8.59-5.23Z'
      clipRule='evenodd'
    />
  </svg>
)

export { WhatsAppIcon }

/**
 * Componente de icono de Telegram en formato SVG.
 */
const TelegramIcon = (props: SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    {...props}
    viewBox='0 0 256 256'
    preserveAspectRatio='xMidYMid'
    role='img'
  >
    <title>Telegram</title>
    <defs>
      <linearGradient id='telegram__a' x1='50%' x2='50%' y1='0%' y2='100%'>
        <stop offset='0%' stopColor='#2AABEE' />
        <stop offset='100%' stopColor='#229ED9' />
      </linearGradient>
    </defs>
    <path
      fill='url(#telegram__a)'
      d='M128 0C94.06 0 61.48 13.49 37.5 37.49A128.04 128.04 0 0 0 0 128c0 33.93 13.5 66.51 37.5 90.51C61.48 242.51 94.06 256 128 256s66.52-13.49 90.5-37.49c24-24 37.5-56.58 37.5-90.51 0-33.93-13.5-66.51-37.5-90.51C194.52 13.49 161.94 0 128 0Z'
    />
    <path
      fill='#FFF'
      d='M57.94 126.65c37.32-16.26 62.2-26.97 74.64-32.15 35.56-14.79 42.94-17.35 47.76-17.44 1.06-.02 3.42.25 4.96 1.49 1.28 1.05 1.64 2.47 1.82 3.47.16 1 .38 3.27.2 5.04-1.92 20.24-10.26 69.36-14.5 92.03-1.78 9.59-5.32 12.81-8.74 13.12-7.44.68-13.08-4.91-20.28-9.63-11.26-7.39-17.62-11.98-28.56-19.19-12.64-8.33-4.44-12.91 2.76-20.39 1.88-1.96 34.64-31.75 35.26-34.45.08-.34.16-1.6-.6-2.26-.74-.67-1.84-.44-2.64-.26-1.14.26-19.12 12.15-54 35.69-5.1 3.51-9.72 5.22-13.88 5.13-4.56-.1-13.36-2.58-19.9-4.71-8-2.61-14.38-3.98-13.82-8.41.28-2.3 3.46-4.66 9.52-7.07Z'
    />
  </svg>
)

export { TelegramIcon }

/**
 * Componente de icono de Google en formato SVG.
 */
const GoogleIcon = (props: SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    {...props}
    xmlnsXlink='http://www.w3.org/1999/xlink'
    xmlSpace='preserve'
    overflow='hidden'
    viewBox='0 0 268.15 273.88'
    role='img'
  >
    <title>Google</title>
    <defs>
      {/* ... (Gradientes omitidos para brevedad visual, pero conservan sus colores originales) ... */}
      <linearGradient id='google__a'>
        <stop offset='0' stopColor='#0fbc5c' />
        <stop offset='1' stopColor='#0cba65' />
      </linearGradient>
      <linearGradient id='google__g'>
        <stop offset='.23' stopColor='#0fbc5f' />
        <stop offset='.31' stopColor='#0fbc5f' />
        <stop offset='.37' stopColor='#0fbc5e' />
        <stop offset='.46' stopColor='#0fbc5d' />
        <stop offset='.54' stopColor='#12bc58' />
        <stop offset='.7' stopColor='#28bf3c' />
        <stop offset='.77' stopColor='#38c02b' />
        <stop offset='.86' stopColor='#52c218' />
        <stop offset='.92' stopColor='#67c30f' />
        <stop offset='1' stopColor='#86c504' />
      </linearGradient>
      <linearGradient id='google__h'>
        <stop offset='.14' stopColor='#1abd4d' />
        <stop offset='.25' stopColor='#6ec30d' />
        <stop offset='.31' stopColor='#8ac502' />
        <stop offset='.37' stopColor='#a2c600' />
        <stop offset='.45' stopColor='#c8c903' />
        <stop offset='.54' stopColor='#ebcb03' />
        <stop offset='.62' stopColor='#f7cd07' />
        <stop offset='.7' stopColor='#fdcd04' />
        <stop offset='.77' stopColor='#fdce05' />
        <stop offset='.86' stopColor='#ffce0a' />
      </linearGradient>
      <linearGradient id='google__f'>
        <stop offset='.32' stopColor='#ff4c3c' />
        <stop offset='.6' stopColor='#ff692c' />
        <stop offset='.73' stopColor='#ff7825' />
        <stop offset='.89' stopColor='#ff8d1b' />
        <stop offset='1' stopColor='#ff9f13' />
      </linearGradient>
      <linearGradient id='google__b'>
        <stop offset='.23' stopColor='#ff4541' />
        <stop offset='.31' stopColor='#ff4540' />
        <stop offset='.46' stopColor='#ff4640' />
        <stop offset='.54' stopColor='#ff473f' />
        <stop offset='.7' stopColor='#ff5138' />
        <stop offset='.77' stopColor='#ff5b33' />
        <stop offset='.86' stopColor='#ff6c29' />
        <stop offset='1' stopColor='#ff8c18' />
      </linearGradient>
      <linearGradient id='google__d'>
        <stop offset='.41' stopColor='#fb4e5a' />
        <stop offset='1' stopColor='#ff4540' />
      </linearGradient>
      <linearGradient id='google__c'>
        <stop offset='.13' stopColor='#0cba65' />
        <stop offset='.21' stopColor='#0bb86d' />
        <stop offset='.3' stopColor='#09b479' />
        <stop offset='.4' stopColor='#08ad93' />
        <stop offset='.48' stopColor='#0aa6a9' />
        <stop offset='.57' stopColor='#0d9cc6' />
        <stop offset='.67' stopColor='#1893dd' />
        <stop offset='.77' stopColor='#258bf1' />
        <stop offset='.86' stopColor='#3086ff' />
      </linearGradient>
      <linearGradient id='google__e'>
        <stop offset='.37' stopColor='#ff4e3a' />
        <stop offset='.46' stopColor='#ff8a1b' />
        <stop offset='.54' stopColor='#ffa312' />
        <stop offset='.62' stopColor='#ffb60c' />
        <stop offset='.77' stopColor='#ffcd0a' />
        <stop offset='.86' stopColor='#fecf0a' />
        <stop offset='.92' stopColor='#fecf08' />
        <stop offset='1' stopColor='#fdcd01' />
      </linearGradient>
      <linearGradient
        xlinkHref='#google__a'
        id='google__s'
        x1='219.7'
        x2='254.47'
        y1='329.54'
        y2='329.54'
        gradientUnits='userSpaceOnUse'
      />
      {/* ¡Aquí estaban los decimales pesados! Redondeados a 2 */}
      <radialGradient
        xlinkHref='#google__b'
        id='google__m'
        cx='109.63'
        cy='135.86'
        r='71.46'
        fx='109.63'
        fy='135.86'
        gradientTransform='matrix(-1.94 1.04 1.46 2.56 290.53 -400.63)'
        gradientUnits='userSpaceOnUse'
      />
      <radialGradient
        xlinkHref='#google__c'
        id='google__n'
        cx='45.26'
        cy='279.27'
        r='71.46'
        fx='45.26'
        fy='279.27'
        gradientTransform='matrix(-3.51 -4.46 -1.69 1.26 870.80 191.55)'
        gradientUnits='userSpaceOnUse'
      />
      <radialGradient
        xlinkHref='#google__d'
        id='google__l'
        cx='304.02'
        cy='118.01'
        r='47.85'
        fx='304.02'
        fy='118.01'
        gradientTransform='matrix(2.06 0 0 2.59 -297.68 -151.75)'
        gradientUnits='userSpaceOnUse'
      />
      <radialGradient
        xlinkHref='#google__e'
        id='google__o'
        cx='181.00'
        cy='177.20'
        r='71.46'
        fx='181.00'
        fy='177.20'
        gradientTransform='matrix(-0.25 2.08 2.96 0.33 -255.15 -331.16)'
        gradientUnits='userSpaceOnUse'
      />
      <radialGradient
        xlinkHref='#google__f'
        id='google__p'
        cx='207.67'
        cy='108.10'
        r='41.10'
        fx='207.67'
        fy='108.10'
        gradientTransform='matrix(-1.25 1.34 -3.90 -3.43 880.50 194.91)'
        gradientUnits='userSpaceOnUse'
      />
      <radialGradient
        xlinkHref='#google__g'
        id='google__r'
        cx='109.63'
        cy='135.86'
        r='71.46'
        fx='109.63'
        fy='135.86'
        gradientTransform='matrix(-1.94 -1.04 1.46 -2.56 290.53 838.68)'
        gradientUnits='userSpaceOnUse'
      />
      <radialGradient
        xlinkHref='#google__h'
        id='google__j'
        cx='154.87'
        cy='145.97'
        r='71.46'
        fx='154.87'
        fy='145.97'
        gradientTransform='matrix(-0.08 -1.94 2.93 -0.12 -215.14 632.86)'
        gradientUnits='userSpaceOnUse'
      />

      <filter
        id='google__q'
        width='1.1'
        height='1.12'
        x='-.05'
        y='-.06'
        colorInterpolationFilters='sRGB'
      >
        <feGaussianBlur stdDeviation='1.7' />
      </filter>
      <filter
        id='google__k'
        width='1.03'
        height='1.02'
        x='-.02'
        y='-.01'
        colorInterpolationFilters='sRGB'
      >
        <feGaussianBlur stdDeviation='.24' />
      </filter>
      <clipPath id='google__i' clipPathUnits='userSpaceOnUse'>
        <path d='M371.38 193.24H237.08v53.44h77.17c-1.24 7.56-4.03 15-8.11 21.79-4.67 7.77-10.45 13.69-16.37 18.2-17.74 13.5-38.42 16.26-52.78 16.26-36.28 0-67.28-23.29-79.29-54.93-.48-1.15-.8-2.34-1.2-3.51a81.12 81.12 0 0 1-4.1-25.45c0-9.23 1.57-18.06 4.43-26.4 11.29-32.9 42.99-57.47 80.18-57.47 7.48 0 14.69.88 21.52 2.65a77.67 77.67 0 0 1 33.43 18.25l40.83-39.71c-24.84-22.62-57.22-36.32-95.84-36.32-30.88 0-59.39 9.55-82.75 25.7-18.95 13.09-34.48 30.63-44.97 50.99-9.75 18.88-15.09 39.8-15.09 62.29 0 22.5 5.35 43.63 15.1 62.34v.13c10.3 19.86 25.37 36.95 43.68 49.99 16 11.39 44.68 26.55 84.03 26.55 22.63 0 42.69-4.05 60.38-11.64 12.76-5.48 24.07-12.62 34.3-21.8 13.53-12.13 24.12-27.14 31.35-44.4 7.23-17.27 11.1-36.79 11.1-57.96 0-9.86-1-19.87-2.69-28.97Z' />
      </clipPath>
    </defs>
    <g
      clipPath='url(#google__i)'
      transform='matrix(0.96 0 0 0.99 -90.17 -78.86)'
    >
      <path
        fill='url(#google__j)'
        d='M92.08 219.96c.15 22.14 6.5 44.98 16.12 63.42v.13c6.95 13.39 16.45 23.97 27.26 34.45l65.33-23.67c-12.36-6.24-14.25-10.06-23.11-17.03-9.05-9.07-15.8-19.47-20-31.68h-.17l.17-.13c-2.77-8.06-3.04-16.61-3.14-25.5Z'
        filter='url(#google__k)'
      />
      <path
        fill='url(#google__l)'
        d='M237.08 79.03c-6.46 22.53-3.99 44.42 0 57.16 7.46.01 14.64.89 21.45 2.65a77.66 77.66 0 0 1 33.42 18.25l41.88-40.73c-24.81-22.59-54.67-37.3-96.75-37.33Z'
        filter='url(#google__k)'
      />
      <path
        fill='url(#google__m)'
        d='M236.94 78.85c-31.67 0-60.91 9.8-84.87 26.36a145.53 145.53 0 0 0-24.33 21.15c-1.9 17.74 14.26 39.55 46.26 39.37 15.53-17.94 38.5-29.54 64.06-29.54l.07-1.04-57.34Z'
        filter='url(#google__k)'
      />
      <path
        fill='url(#google__n)'
        d='m341.48 226.38-28.27 19.29c-1.24 7.56-4.03 15-8.11 21.79-4.67 7.77-10.45 13.69-16.37 18.2-17.7 13.47-38.33 16.24-52.69 16.26-14.84 25.1-17.44 37.68 1.04 57.93 22.88-.02 43.16-4.12 61.05-11.8 12.93-5.55 24.39-12.79 34.76-22.1 13.71-12.3 24.44-27.5 31.77-45 7.33-17.5 11.25-37.28 11.25-58.73Z'
        filter='url(#google__k)'
      />
      <path
        fill='#3086ff'
        d='M235 191.21v57.5h136.01c1.2-7.87 5.15-18.06 5.15-26.5 0-9.86-1-21.9-2.69-31Z'
        filter='url(#google__k)'
      />
      <path
        fill='url(#google__o)'
        d='M128.39 124.33c-8.39 9.12-15.56 19.33-21.25 30.36-9.75 18.88-15.09 41.83-15.09 64.32 0 .32.03.63.03.94 4.32 8.22 59.67 6.65 62.46 0 0-.31-.04-.61-.04-.92 0-9.23 1.57-16.03 4.43-24.37 3.53-10.29 9.06-19.76 16.12-27.93 1.6-2.03 5.88-6.4 7.12-9.02.48-1-.86-1.56-.94-1.91-.08-.39-1.88-.08-2.28-.37-1.28-.93-3.8-1.41-5.33-1.85-3.28-.92-8.71-2.95-11.73-5.06-9.54-6.66-24.42-14.61-33.5-24.22Z'
        filter='url(#google__k)'
      />
      <path
        fill='url(#google__p)'
        d='M162.1 155.86c22.11 13.3 28.47-6.71 43.17-12.98l-25.57-52.66a144.74 144.74 0 0 0-26.54 14.5c-12.32 8.51-23.19 18.9-32.18 30.72Z'
        filter='url(#google__q)'
      />
      <path
        fill='url(#google__r)'
        d='M171.1 290.22c-29.68 10.64-34.33 11.02-37.06 29.29a144.81 144.81 0 0 0 16.79 13.98c16 11.39 46.77 26.55 86.12 26.55.05 0 .09 0 .14 0v-59.16l-.09.01c-14.74 0-26.51-3.84-38.59-10.53-2.98-1.65-8.38 2.78-11.12.8-3.79-2.73-12.9 2.35-16.18-.94Z'
        filter='url(#google__k)'
      />
      <path
        fill='url(#google__s)'
        d='M219.7 299.02v60c5.51.64 11.24 1.03 17.25 1.03 6.03 0 11.86-.31 17.52-.87v-59.75a105.12 105.12 0 0 1-17.48 1.46c-5.93 0-11.7-.69-17.29-1.87Z'
        filter='url(#google__k)'
        opacity='.5'
      />
    </g>
  </svg>
)

export { GoogleIcon }

const FacebookIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox='0 0 666.67 666.67' role='img'>
    <title>Facebook</title>
    <defs>
      <clipPath id='facebook_icon__a' clipPathUnits='userSpaceOnUse'>
        <path d='M0 700h700V0H0Z' />
      </clipPath>
    </defs>
    {/* Transformación limpiada */}
    <g
      clipPath='url(#facebook_icon__a)'
      transform='matrix(1.33 0 0 -1.33 -133.33 800)'
    >
      <path
        d='M0 0c0 138.07-111.93 250-250 250S-500 138.07-500 0c0-117.25 80.72-215.62 189.61-242.64v166.24h-51.55V0h51.55v32.92c0 85.09 38.51 124.53 122.05 124.53 15.84 0 43.17-3.11 54.35-6.21V81.99c-5.9.62-16.15.93-28.88.93-40.99 0-56.83-15.53-56.83-55.9V0h81.66l-14.03-76.4h-67.63v-171.77C-95.93-233.22 0-127.82 0 0'
        style={{
          fill: '#0866ff',
          fillOpacity: '1',
          fillRule: 'nonzero',
          stroke: 'none'
        }}
        transform='translate(600 350)'
      />
      <path
        d='m0 0 14.03 76.4H-67.63v27.02c0 40.37 15.84 55.9 56.83 55.9 12.73 0 22.98-.31 28.88-.93v69.25c-11.18 3.11-38.51 6.21-54.35 6.21-83.54 0-122.05-39.44-122.05-124.53V76.4h-51.55V0h51.55v-166.24a250.56 250.56 0 0 1 60.39-7.36c10.25 0 20.36.63 30.29 1.83V0Z'
        style={{
          fill: '#fff',
          fillOpacity: '1',
          fillRule: 'nonzero',
          stroke: 'none'
        }}
        transform='translate(447.92 273.6)'
      />
    </g>
  </svg>
)

export { FacebookIcon }

const XTwitter = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} fill='none' viewBox='0 0 1200 1227' role='img'>
    <title>X (Twitter)</title>
    <path
      fill='#fff'
      d='M714.16 519.28 1160.89 0h-105.86L667.14 450.89 357.33 0H0l468.49 681.82L0 1226.37h105.87l409.63-476.15 327.18 476.15H1200L714.14 519.28h.03ZM569.17 687.83l-47.47-67.89-377.69-540.24h162.6l304.8 435.99 47.47 67.89 396.2 566.72H892.48L569.17 687.85v-.03Z'
    />
  </svg>
)

export { XTwitter }
