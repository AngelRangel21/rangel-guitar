import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import LiteYouTubeEmbed from 'react-lite-youtube-embed'

interface Props {
  videoId: string
  title: string
}

export function Video({ videoId, title }: Props) {
  return (
    <LiteYouTubeEmbed
      id={videoId}
      title={title}
      lazyLoad
      poster='maxresdefault'
      webp
    />
  )
}
