import {mapState} from "pinia"
import {usePiniaStore} from "../../stores/pinia"

export default {
    computed: {
        ...mapState(usePiniaStore, ["labels", "languages", "currentLanguage"])
    },
    methods: {
        label(name, defaultValue) {
            if (this.labels[name] === undefined) {
                if(defaultValue != null) {
                    return defaultValue
                }
                return ""
            }
            return this.labels[name]
        }
    }
}
