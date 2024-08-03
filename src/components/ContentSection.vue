<template>
    <CmdWidthLimitationWrapper :innerClass="htmlClasses" :id="'anchor-' + id">
        <component
            v-for="(component, componentIndex) in components"
            :key="componentIndex"
            :is="component.name"
            v-bind="component.props"
            :i18n="currentLanguageData"
        >
            <component
                v-for="(childComponent, childComponentIndex) in component.components || []"
                :is="childComponent.name"
                :key="childComponentIndex"
                v-bind="childComponent.props"
                :i18n="currentLanguageData"
            />
        </component>
    </CmdWidthLimitationWrapper>
</template>

<script>
// import mixins
import BaseI18nComponent from "./mixins/BaseI18nComponent"
import {mapState} from "pinia"
import {usePiniaStore} from "../stores/pinia.js"
import {useCmsStore} from "../stores/cms.js"

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
        headlineText: {
            type: String,
            required: false
        },
        headlineLevel: {
            type: [String, Number],
            default() {
                return 2
            }
        },
        useFullDeviceWidth: {
            type: Boolean,
            default: false
        },
        contentOrientation: {
            type: String,
            default: "horizontal"
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
        }
    },
    computed: {
        ...mapState(useCmsStore, ["currentLanguageData"]),

        // provide states from store as computed-properties inside this component
        ...mapState(usePiniaStore, {
            editMode: "editMode"
        }),
        htmlClasses() {
            const classes = []
            if(this.innerClass) {
                classes.push(this.innerClass)
            }

            if(this.useFullDeviceWidth) {
                classes.push("full-width")
            }

            if(this.contentOrientation === "horizontal") {
                classes.push("flex-container")
            } else if(this.contentOrientation === "vertical") {
                classes.push("flex-container vertical")
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
