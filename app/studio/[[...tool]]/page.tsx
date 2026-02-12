import { metadata, viewport } from 'next-sanity/studio'
import { StudioLoader } from '@/app/studio/StudioLoader'

export { metadata, viewport }

export default function StudioPage() {
  return <StudioLoader />
}
