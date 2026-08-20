import { getRequestConfig } from 'next-intl/server'
import { getCurrentLanguage } from './language'

export default getRequestConfig(async () => {
    const language = await getCurrentLanguage()
    return {
        messages: (await import(`./languages/${language}.json`)).default,
        locale: language,
    }
})
