<template>
    <CmdWidthLimitationWrapper
        :class="htmlClasses"
        :id="numberOfPages > 1 ? id : 'anchor-' + id"
        :cmdHeadline="cmdHeadline"
        :contentType="contentType"
        :useInnerSection="useInnerSection"
        :useFullDeviceWidth="useFullDeviceWidth"
        :contentOrientation="contentOrientation"
    >
        <RenderComponents :components="components" />
    </CmdWidthLimitationWrapper>
</template>

<script>
// import mixins
import BaseI18nComponent from "./mixins/BaseI18nComponent"
import {mapState} from "pinia"
import {usePiniaStore} from "../stores/pinia.js"
import {useWebUIStore} from "../stores/web-ui.js"

export default {
    mixins: [
        BaseI18nComponent
    ],
    props: {
        id: {
            type: String,
            required: false
        },
        innerClass: {
            type: String,
            required: false
        },
        cmdHeadline: {
            type: Object,
            required: false
        },
        useInnerSection: {
            type: Boolean,
            default: true
        },
        useFullDeviceWidth: {
            type: Boolean,
            default: false
        },
        contentOrientation: {
            type: String
        },
        components: {
            type: Array,
            required: false
        },
        content: {
            type: String,
            required: false
        },
        allowAddComponent: {
            type: Boolean
        },
        contentType: {
            type: String
        }
    },
    computed: {
        ...mapState(useWebUIStore, ["currentLanguageData", "numberOfPages"]),

        // provide states from store as computed-properties inside this component
        ...mapState(usePiniaStore, {
            editMode: "editMode",
        }),
        htmlClasses() {
            const classes = []
            if (this.innerClass) {
                classes.push(this.innerClass)
            }

            return classes.join(" ")
        },
        cmdSlideButtons() {
            return {
                next: {
                    next: {
                        type: "next",
                        iconClass: "icon-single-arrow-right",
                        tooltip: this.label("slidebutton_next.tooltip")
                    }
                },
                prev: {
                    prev: {
                        type: "prev",
                        iconClass: "icon-single-arrow-left",
                        tooltip: this.label("slidebutton_previous.tooltip")
                    }
                }
            }
        }
    },
    methods: {
        componentPath(sectionId) {
            return [
                "main",
                "sections",
                {id: sectionId}
            ]
        }
    }
}
</script>

<style lang="scss">
.edit-mode section .cmd-headline {
    margin-bottom: 0;
}
</style>
