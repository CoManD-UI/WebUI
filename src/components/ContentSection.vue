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
        <component
            v-for="(component, componentIndex) in components"
            :key="componentIndex"
            :is="component.name"
            :id="component.id"
            v-bind="component.props"
            :i18n="currentLanguageData"
        >
            <template v-slot:[slotName] v-for="(childComponents, slotName) in groupComponentBySlotName(component.components)">
                <component
                    v-for="(childComponent, childComponentIndex) in childComponents"
                    :is="childComponent.name"
                    :key="childComponentIndex"
                    v-bind="childComponent.props"
                    :i18n="currentLanguageData"
                />
            </template>
        </component>
    </CmdWidthLimitationWrapper>
</template>

<script>
// import mixins
import BaseI18nComponent from "./mixins/BaseI18nComponent"
import {mapState} from "pinia"
import {usePiniaStore} from "../stores/pinia.js"
import {useWebStore} from "../stores/website.js"

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
        ...mapState(useWebStore, ["currentLanguageData", "numberOfPages"]),

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
        getSlotName(component) {
            return component.slotName || 'default'
        },
        componentPath(sectionId) {
            return [
                "main",
                "sections",
                {id: sectionId}
            ]
        },
        groupComponentBySlotName(components) {
            const slots = {}

            if(!components) {
                return slots
            }

            for(let i = 0; i < components.length; i++) {
                const slotName = this.getSlotName(components[i])

                // check if slotname already exists
                if(!slots[slotName]) {
                    slots[slotName] = []
                }
                // push component to slotname to group all components with same slotname
                slots[slotName].push(components[i])
            }

            return slots
        }
    }
}
</script>

<style lang="scss">
.edit-mode section .cmd-headline {
    margin-bottom: 0;
}
</style>
