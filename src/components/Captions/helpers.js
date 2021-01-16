import { TEXT_SIZES } from '@/utils/Constants'

// eslint-disable-next-line complexity
export function getMobileFontSizeStyle(size) {
  let fontSize = ''

  switch (size) {
  case TEXT_SIZES.SMALL:
    fontSize = '--mobile-small-font-size'
    break
  case TEXT_SIZES.MEDIUM:
    fontSize = '--mobile-medium-font-size'
    break
  case TEXT_SIZES.LARGE:
    fontSize = '--mobile-large-font-size'
    break
  default:
    fontSize = '--mobile-medium-font-size'
    break
  }

  return fontSize
}

// eslint-disable-next-line complexity
export function getFontSizeStyle(size) {
  let fontSize = ''

  switch (size) {
  case TEXT_SIZES.SMALL:
    fontSize = '--small-font-size'
    break
  case TEXT_SIZES.MEDIUM:
    fontSize = '--medium-font-size'
    break
  case TEXT_SIZES.LARGE:
    fontSize = '--large-font-size'
    break
  default:
    fontSize = '--medium-font-size'
    break
  }

  return fontSize
}
