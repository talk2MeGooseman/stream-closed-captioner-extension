import { equals, keys } from "ramda"
import { useMemo } from "react"

import { useShallowEqualSelector } from "@/redux/redux-helpers"


/**
 * Return a list of the translated languages
 *
 * @returns {[{ locale: string, name: string }]}
 */
export const useLanguageList = () => {
  const currentLanguage = useShallowEqualSelector(
    (state) => state.configSettings.language ?? "",
  )
  const languages = useShallowEqualSelector(
    (state) => state.translationInfo?.activationInfo?.languages ?? [],
  )

  return useMemo(() => {
    const [currentLanguageKey] = currentLanguage.split('-')

    return keys(languages)
    .reduce((accum, key) => {
      if(equals(currentLanguageKey, key)) return accum
      accum.push({ locale: key, name: languages[key] })
      return accum
    }, [])
  }, [languages, currentLanguage])
}
