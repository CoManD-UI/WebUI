import axios from "axios"
import {BaseClient} from "./BaseClient"

class I18nClient extends BaseClient {
    async getLanguagesAndLabels() {
        const response = await axios.get(this.getUrl('/languages.json'))
        const labels = response.data
        const languages = []

        for (const language in labels) {
            if (Object.prototype.hasOwnProperty.call(labels, language)) {
                languages.push(language)
            }
        }

        return [languages, labels]
    }
}

export const i18nClient = new I18nClient()
