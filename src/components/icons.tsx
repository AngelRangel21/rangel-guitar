import type { JSX, SVGProps } from 'react'

/**
 * Componente de icono de WhatsApp en formato SVG.
 * @param {SVGProps<SVGSVGElement>} props - Propiedades SVG estándar.
 * @returns {JSX.Element} El icono de WhatsApp.
 */
const WhatsAppIcon = (props: SVGProps<SVGSVGElement>): JSX.Element => (
  <svg {...props} fill='none' viewBox='0 0 360 362' role='img'>
    <title>WhatsApp</title>
    <path
      fill='#25D366'
      fillRule='evenodd'
      d='M307.546 52.566C273.709 18.684 228.706.017 180.756 0 81.951 0 1.538 80.404 1.504 179.235c-.017 31.594 8.242 62.432 23.928 89.609L0 361.736l95.024-24.925c26.179 14.285 55.659 21.805 85.655 21.814h.077c98.788 0 179.21-80.413 179.244-179.244.017-47.898-18.608-92.926-52.454-126.807v-.008Zm-126.79 275.788h-.06c-26.73-.008-52.952-7.194-75.831-20.765l-5.44-3.231-56.391 14.791 15.05-54.981-3.542-5.638c-14.912-23.721-22.793-51.139-22.776-79.286.035-82.14 66.867-148.973 149.051-148.973 39.793.017 77.198 15.53 105.328 43.695 28.131 28.157 43.61 65.596 43.593 105.398-.035 82.149-66.867 148.982-148.982 148.982v.008Zm81.719-111.577c-4.478-2.243-26.497-13.073-30.606-14.568-4.108-1.496-7.09-2.243-10.073 2.243-2.982 4.487-11.568 14.577-14.181 17.559-2.613 2.991-5.226 3.361-9.704 1.117-4.477-2.243-18.908-6.97-36.02-22.226-13.313-11.878-22.304-26.54-24.916-31.027-2.613-4.486-.275-6.91 1.959-9.136 2.011-2.011 4.478-5.234 6.721-7.847 2.244-2.613 2.983-4.486 4.478-7.469 1.496-2.991.748-5.603-.369-7.847-1.118-2.243-10.073-24.289-13.812-33.253-3.636-8.732-7.331-7.546-10.073-7.692-2.613-.13-5.595-.155-8.586-.155-2.991 0-7.839 1.118-11.947 5.604-4.108 4.486-15.677 15.324-15.677 37.361s16.047 43.344 18.29 46.335c2.243 2.991 31.585 48.225 76.51 67.632 10.684 4.615 19.029 7.374 25.535 9.437 10.727 3.412 20.49 2.931 28.208 1.779 8.604-1.289 26.498-10.838 30.228-21.298 3.73-10.46 3.73-19.433 2.613-21.298-1.117-1.865-4.108-2.991-8.586-5.234l.008-.017Z'
      clipRule='evenodd'
    />
  </svg>
)

export { WhatsAppIcon }

/**
 * Componente de icono de Telegram en formato SVG.
 * @param {SVGProps<SVGSVGElement>} props - Propiedades SVG estándar.
 * @returns {JSX.Element} El icono de Telegram.
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
      d='M128 0C94.06 0 61.48 13.494 37.5 37.49A128.038 128.038 0 0 0 0 128c0 33.934 13.5 66.514 37.5 90.51C61.48 242.506 94.06 256 128 256s66.52-13.494 90.5-37.49c24-23.996 37.5-56.576 37.5-90.51 0-33.934-13.5-66.514-37.5-90.51C194.52 13.494 161.94 0 128 0Z'
    />
    <path
      fill='#FFF'
      d='M57.94 126.648c37.32-16.256 62.2-26.974 74.64-32.152 35.56-14.786 42.94-17.354 47.76-17.441 1.06-.017 3.42.245 4.96 1.49 1.28 1.05 1.64 2.47 1.82 3.467.16.996.38 3.266.2 5.038-1.92 20.24-10.26 69.356-14.5 92.026-1.78 9.592-5.32 12.808-8.74 13.122-7.44.684-13.08-4.912-20.28-9.63-11.26-7.386-17.62-11.982-28.56-19.188-12.64-8.328-4.44-12.906 2.76-20.386 1.88-1.958 34.64-31.748 35.26-34.45.08-.338.16-1.598-.6-2.262-.74-.666-1.84-.438-2.64-.258-1.14.256-19.12 12.152-54 35.686-5.1 3.508-9.72 5.218-13.88 5.128-4.56-.098-13.36-2.584-19.9-4.708-8-2.606-14.38-3.984-13.82-8.41.28-2.304 3.46-4.662 9.52-7.072Z'
    />
  </svg>
)

export { TelegramIcon }

/**
 * Componente de icono de Google en formato SVG.
 * Utilizado en los botones de inicio de sesión/registro con Google.
 * @param {SVGProps<SVGSVGElement>} props - Propiedades SVG estándar.
 * @returns {JSX.Element} El icono de Google.
 */
const GoogleIcon = (props: SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    {...props}
    xmlnsXlink='http://www.w3.org/1999/xlink'
    xmlSpace='preserve'
    overflow='hidden'
    viewBox='0 0 268.152 273.883'
    role='img'
  >
    <title>Google</title>
    <defs>
      <linearGradient id='google__a'>
        <stop offset='0' stopColor='#0fbc5c' />
        <stop offset='1' stopColor='#0cba65' />
      </linearGradient>
      <linearGradient id='google__g'>
        <stop offset='.231' stopColor='#0fbc5f' />
        <stop offset='.312' stopColor='#0fbc5f' />
        <stop offset='.366' stopColor='#0fbc5e' />
        <stop offset='.458' stopColor='#0fbc5d' />
        <stop offset='.54' stopColor='#12bc58' />
        <stop offset='.699' stopColor='#28bf3c' />
        <stop offset='.771' stopColor='#38c02b' />
        <stop offset='.861' stopColor='#52c218' />
        <stop offset='.915' stopColor='#67c30f' />
        <stop offset='1' stopColor='#86c504' />
      </linearGradient>
      <linearGradient id='google__h'>
        <stop offset='.142' stopColor='#1abd4d' />
        <stop offset='.248' stopColor='#6ec30d' />
        <stop offset='.312' stopColor='#8ac502' />
        <stop offset='.366' stopColor='#a2c600' />
        <stop offset='.446' stopColor='#c8c903' />
        <stop offset='.54' stopColor='#ebcb03' />
        <stop offset='.616' stopColor='#f7cd07' />
        <stop offset='.699' stopColor='#fdcd04' />
        <stop offset='.771' stopColor='#fdce05' />
        <stop offset='.861' stopColor='#ffce0a' />
      </linearGradient>
      <linearGradient id='google__f'>
        <stop offset='.316' stopColor='#ff4c3c' />
        <stop offset='.604' stopColor='#ff692c' />
        <stop offset='.727' stopColor='#ff7825' />
        <stop offset='.885' stopColor='#ff8d1b' />
        <stop offset='1' stopColor='#ff9f13' />
      </linearGradient>
      <linearGradient id='google__b'>
        <stop offset='.231' stopColor='#ff4541' />
        <stop offset='.312' stopColor='#ff4540' />
        <stop offset='.458' stopColor='#ff4640' />
        <stop offset='.54' stopColor='#ff473f' />
        <stop offset='.699' stopColor='#ff5138' />
        <stop offset='.771' stopColor='#ff5b33' />
        <stop offset='.861' stopColor='#ff6c29' />
        <stop offset='1' stopColor='#ff8c18' />
      </linearGradient>
      <linearGradient id='google__d'>
        <stop offset='.408' stopColor='#fb4e5a' />
        <stop offset='1' stopColor='#ff4540' />
      </linearGradient>
      <linearGradient id='google__c'>
        <stop offset='.132' stopColor='#0cba65' />
        <stop offset='.21' stopColor='#0bb86d' />
        <stop offset='.297' stopColor='#09b479' />
        <stop offset='.396' stopColor='#08ad93' />
        <stop offset='.477' stopColor='#0aa6a9' />
        <stop offset='.568' stopColor='#0d9cc6' />
        <stop offset='.667' stopColor='#1893dd' />
        <stop offset='.769' stopColor='#258bf1' />
        <stop offset='.859' stopColor='#3086ff' />
      </linearGradient>
      <linearGradient id='google__e'>
        <stop offset='.366' stopColor='#ff4e3a' />
        <stop offset='.458' stopColor='#ff8a1b' />
        <stop offset='.54' stopColor='#ffa312' />
        <stop offset='.616' stopColor='#ffb60c' />
        <stop offset='.771' stopColor='#ffcd0a' />
        <stop offset='.861' stopColor='#fecf0a' />
        <stop offset='.915' stopColor='#fecf08' />
        <stop offset='1' stopColor='#fdcd01' />
      </linearGradient>
      <linearGradient
        xlinkHref='#google__a'
        id='google__s'
        x1='219.7'
        x2='254.467'
        y1='329.535'
        y2='329.535'
        gradientUnits='userSpaceOnUse'
      />
      <radialGradient
        xlinkHref='#google__b'
        id='google__m'
        cx='109.627'
        cy='135.862'
        r='71.46'
        fx='109.627'
        fy='135.862'
        gradientTransform='matrix(-1.93688 1.043 1.45573 2.55542 290.525 -400.634)'
        gradientUnits='userSpaceOnUse'
      />
      <radialGradient
        xlinkHref='#google__c'
        id='google__n'
        cx='45.259'
        cy='279.274'
        r='71.46'
        fx='45.259'
        fy='279.274'
        gradientTransform='matrix(-3.5126 -4.45809 -1.69255 1.26062 870.8 191.554)'
        gradientUnits='userSpaceOnUse'
      />
      <radialGradient
        xlinkHref='#google__d'
        id='google__l'
        cx='304.017'
        cy='118.009'
        r='47.854'
        fx='304.017'
        fy='118.009'
        gradientTransform='matrix(2.06435 0 0 2.59204 -297.679 -151.747)'
        gradientUnits='userSpaceOnUse'
      />
      <radialGradient
        xlinkHref='#google__e'
        id='google__o'
        cx='181.001'
        cy='177.201'
        r='71.46'
        fx='181.001'
        fy='177.201'
        gradientTransform='matrix(-.24858 2.08314 2.96249 .33417 -255.146 -331.164)'
        gradientUnits='userSpaceOnUse'
      />
      <radialGradient
        xlinkHref='#google__f'
        id='google__p'
        cx='207.673'
        cy='108.097'
        r='41.102'
        fx='207.673'
        fy='108.097'
        gradientTransform='matrix(-1.2492 1.34326 -3.89684 -3.4257 880.501 194.905)'
        gradientUnits='userSpaceOnUse'
      />
      <radialGradient
        xlinkHref='#google__g'
        id='google__r'
        cx='109.627'
        cy='135.862'
        r='71.46'
        fx='109.627'
        fy='135.862'
        gradientTransform='matrix(-1.93688 -1.043 1.45573 -2.55542 290.525 838.683)'
        gradientUnits='userSpaceOnUse'
      />
      <radialGradient
        xlinkHref='#google__h'
        id='google__j'
        cx='154.87'
        cy='145.969'
        r='71.46'
        fx='154.87'
        fy='145.969'
        gradientTransform='matrix(-.0814 -1.93722 2.92674 -.11625 -215.135 632.86)'
        gradientUnits='userSpaceOnUse'
      />
      <filter
        id='google__q'
        width='1.097'
        height='1.116'
        x='-.048'
        y='-.058'
        colorInterpolationFilters='sRGB'
      >
        <feGaussianBlur stdDeviation='1.701' />
      </filter>
      <filter
        id='google__k'
        width='1.033'
        height='1.02'
        x='-.017'
        y='-.01'
        colorInterpolationFilters='sRGB'
      >
        <feGaussianBlur stdDeviation='.242' />
      </filter>
      <clipPath id='google__i' clipPathUnits='userSpaceOnUse'>
        <path d='M371.378 193.24H237.083v53.438h77.167c-1.241 7.563-4.026 15.003-8.105 21.786-4.674 7.773-10.451 13.69-16.373 18.196-17.74 13.498-38.42 16.258-52.783 16.258-36.283 0-67.283-23.286-79.285-54.928-.484-1.149-.805-2.335-1.197-3.507a81.115 81.115 0 0 1-4.101-25.448c0-9.226 1.569-18.057 4.43-26.398 11.285-32.897 42.985-57.467 80.179-57.467 7.481 0 14.685.884 21.517 2.648a77.668 77.668 0 0 1 33.425 18.25l40.834-39.712c-24.839-22.616-57.219-36.32-95.844-36.32-30.878 0-59.386 9.553-82.748 25.7-18.945 13.093-34.483 30.625-44.97 50.985-9.753 18.879-15.094 39.8-15.094 62.294 0 22.495 5.35 43.633 15.103 62.337v.126c10.302 19.857 25.368 36.954 43.678 49.988 15.997 11.386 44.68 26.551 84.031 26.551 22.63 0 42.687-4.051 60.375-11.644 12.76-5.478 24.065-12.622 34.301-21.804 13.525-12.132 24.117-27.139 31.347-44.404 7.23-17.265 11.097-36.79 11.097-57.957 0-9.858-.998-19.87-2.689-28.968Z' />
      </clipPath>
    </defs>
    <g
      clipPath='url(#google__i)'
      transform='matrix(.95792 0 0 .98525 -90.174 -78.856)'
    >
      <path
        fill='url(#google__j)'
        d='M92.076 219.958c.148 22.14 6.501 44.983 16.117 63.424v.127c6.949 13.392 16.445 23.97 27.26 34.452l65.327-23.67c-12.36-6.235-14.246-10.055-23.105-17.026-9.054-9.066-15.802-19.473-20.004-31.677h-.17l.17-.127c-2.765-8.058-3.037-16.613-3.14-25.503Z'
        filter='url(#google__k)'
      />
      <path
        fill='url(#google__l)'
        d='M237.083 79.025c-6.456 22.526-3.988 44.421 0 57.161 7.457.006 14.64.888 21.45 2.647a77.662 77.662 0 0 1 33.424 18.25l41.88-40.726c-24.81-22.59-54.667-37.297-96.754-37.332Z'
        filter='url(#google__k)'
      />
      <path
        fill='url(#google__m)'
        d='M236.943 78.847c-31.67 0-60.91 9.798-84.871 26.359a145.533 145.533 0 0 0-24.332 21.15c-1.904 17.744 14.257 39.551 46.262 39.37 15.528-17.936 38.495-29.542 64.056-29.542l.07.002-1.044-57.335c-.048 0-.093-.004-.14-.004Z'
        filter='url(#google__k)'
      />
      <path
        fill='url(#google__n)'
        d='m341.475 226.379-28.268 19.285c-1.24 7.562-4.028 15.002-8.107 21.786-4.674 7.772-10.45 13.69-16.373 18.196-17.702 13.47-38.328 16.244-52.687 16.255-14.842 25.102-17.444 37.675 1.043 57.934 22.877-.016 43.157-4.117 61.046-11.796 12.931-5.551 24.388-12.792 34.761-22.097 13.706-12.295 24.442-27.503 31.769-45 7.327-17.497 11.245-37.282 11.245-58.734Z'
        filter='url(#google__k)'
      />
      <path
        fill='#3086ff'
        d='M234.996 191.21v57.498h136.006c1.196-7.874 5.152-18.064 5.152-26.5 0-9.858-.996-21.899-2.687-30.998Z'
        filter='url(#google__k)'
      />
      <path
        fill='url(#google__o)'
        d='M128.39 124.327c-8.394 9.119-15.564 19.326-21.249 30.364-9.753 18.879-15.094 41.83-15.094 64.324 0 .317.026.627.029.944 4.32 8.224 59.666 6.649 62.456 0-.004-.31-.039-.613-.039-.924 0-9.226 1.57-16.026 4.43-24.367 3.53-10.289 9.056-19.763 16.123-27.926 1.602-2.031 5.875-6.397 7.121-9.016.475-.997-.862-1.557-.937-1.908-.083-.393-1.876-.077-2.277-.37-1.275-.929-3.8-1.414-5.334-1.845-3.277-.921-8.708-2.953-11.725-5.06-9.536-6.658-24.417-14.612-33.505-24.216Z'
        filter='url(#google__k)'
      />
      <path
        fill='url(#google__p)'
        d='M162.099 155.857c22.112 13.301 28.471-6.714 43.173-12.977l-25.574-52.664a144.74 144.74 0 0 0-26.543 14.504c-12.316 8.512-23.192 18.9-32.176 30.72Z'
        filter='url(#google__q)'
      />
      <path
        fill='url(#google__r)'
        d='M171.099 290.222c-29.683 10.641-34.33 11.023-37.062 29.29a144.806 144.806 0 0 0 16.792 13.984c15.996 11.386 46.766 26.551 86.118 26.551.046 0 .09-.004.137-.004v-59.157l-.094.002c-14.736 0-26.512-3.843-38.585-10.527-2.977-1.648-8.378 2.777-11.123.799-3.786-2.729-12.9 2.35-16.183-.938Z'
        filter='url(#google__k)'
      />
      <path
        fill='url(#google__s)'
        d='M219.7 299.023v59.996c5.506.64 11.236 1.028 17.247 1.028 6.026 0 11.855-.307 17.52-.872v-59.748a105.119 105.119 0 0 1-17.477 1.461c-5.932 0-11.7-.686-17.29-1.865Z'
        filter='url(#google__k)'
        opacity='.5'
      />
    </g>
  </svg>
)

export { GoogleIcon }

const FacebookIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox='0 0 666.667 666.667' role='img'>
    <title>Facebook</title>
    <defs>
      <clipPath id='facebook_icon__a' clipPathUnits='userSpaceOnUse'>
        <path d='M0 700h700V0H0Z' />
      </clipPath>
    </defs>
    <g
      clipPath='url(#facebook_icon__a)'
      transform='matrix(1.33333 0 0 -1.33333 -133.333 800)'
    >
      <path
        d='M0 0c0 138.071-111.929 250-250 250S-500 138.071-500 0c0-117.245 80.715-215.622 189.606-242.638v166.242h-51.552V0h51.552v32.919c0 85.092 38.508 124.532 122.048 124.532 15.838 0 43.167-3.105 54.347-6.211V81.986c-5.901.621-16.149.932-28.882.932-40.993 0-56.832-15.528-56.832-55.9V0h81.659l-14.028-76.396h-67.631v-171.773C-95.927-233.218 0-127.818 0 0'
        style={{
          fill: '#0866ff',
          fillOpacity: '1',
          fillRule: 'nonzero',
          stroke: 'none'
        }}
        transform='translate(600 350)'
      />
      <path
        d='m0 0 14.029 76.396H-67.63v27.019c0 40.372 15.838 55.899 56.831 55.899 12.733 0 22.981-.31 28.882-.931v69.253c-11.18 3.106-38.509 6.212-54.347 6.212-83.539 0-122.048-39.441-122.048-124.533V76.396h-51.552V0h51.552v-166.242a250.559 250.559 0 0 1 60.394-7.362c10.254 0 20.358.632 30.288 1.831V0Z'
        style={{
          fill: '#fff',
          fillOpacity: '1',
          fillRule: 'nonzero',
          stroke: 'none'
        }}
        transform='translate(447.918 273.604)'
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
      d='M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z'
    />
  </svg>
)

export { XTwitter }
