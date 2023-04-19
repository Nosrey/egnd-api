import { useState, useEffect } from 'react'
// eslint-disable-next-line import/extensions
import { device } from '../device.js'

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => {
      setMatches(media.matches)
    }
    window.addEventListener('resize', listener)
    return () => window.removeEventListener('resize', listener)
  }, [matches, query])

  return matches
}

export const useMedia = () => {
  const isDesktop = useMediaQuery(device.desktop)
  const isTablet = useMediaQuery(device.tablet)
  const isFullHD = useMediaQuery(device.fullHD)
  const isSmallDesktop = useMediaQuery(device.smallDesktop)
  const isMobile = useMediaQuery(device.mobile)

  if (isFullHD) return 'fullHD'
  if (isDesktop) return 'desktop'
  if (isSmallDesktop) return 'smallDesktop'
  if (isTablet) return 'tablet'
  if (isMobile) return 'mobile'
  return 'mobile'
}
