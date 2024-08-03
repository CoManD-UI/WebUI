<template>
    <!-- begin section settings -->
    <h3 class="has-icon">
            <span class="icon-square use-icon-as-background">
                <span class="icon-cog"></span>
            </span>
        <span>Section Settings</span>
    </h3>
    <CmdFormElement
        element="input"
        type="checkbox"
        :toggleSwitch="true"
        labelText="Show link in main-navigation"
        v-model="showLinkInMainNavigationModel"
    />
    <CmdFormElement
        v-if="showLinkInMainNavigationModel"
        element="input"
        type="text"
        labelText="Linktext for navigation entry"
        placeholder="Linktext for navigation entry"
        v-model="navEntryModel"
    />
    <div class="flex-container align-bottom">
        <CmdFormElement
            labelText="Vertical Order"
            element="input"
            type="number"
            v-model="sectionOrderModel"
            :min="1"
            :max="numberOfSections"
        />
        <span> / {{ numberOfSections }} Sections</span>
    </div>
    <!-- end section settings -->
</template>

<script>
import {usePiniaStore} from "../../../stores/pinia.js"
import {mapState} from "pinia";
import {highlightSection} from "../../../utils/editmode.js";

export default {
    name: "SectionSettings",
    inheritAttrs: false,
    data() {
        return {
            editableSectionOrder: null,
            editableShowLinkInMainNavigation: null,
            editableNavEntry: null
        }
    },
    props: {
        showLinkInMainNavigation: {
            type: Boolean,
            required: false
        },
        navEntry: {
            type: String,
            default: ""
        },
        order: {
            type: Number,
            default: 0
        }
    },
    computed: {
        ...mapState(usePiniaStore, ["site"]),
        numberOfSections() {
            return this.site.main?.sections.length
        },
        showLinkInMainNavigationModel: {
            get() {
                return this.editableShowLinkInMainNavigation == null ? this.showLinkInMainNavigation : this.editableShowLinkInMainNavigation
            },
            set(value) {
                this.editableShowLinkInMainNavigation = value
            }
        },
        navEntryModel: {
            get() {
                return this.editableNavEntry == null ? this.navEntry : this.editableNavEntry
            },
            set(value) {
                this.editableNavEntry = value
            }
        },
        sectionOrderModel: {
            get() {
                return this.editableSectionOrder == null ? this.order : this.editableSectionOrder
            },
            set(value) {
                this.editableSectionOrder = value
            }
        }
    },
    methods: {
        updateCallbackProvider() {
            const showLinkInMainNavigation = this.showLinkInMainNavigationModel
            const navEntry = this.navEntryModel
            const order = Number(this.sectionOrderModel)

            return (props, sections) => {
                props.showLinkInMainNavigation = showLinkInMainNavigation
                props.navEntry = navEntry

                if(props.order !== order) {
                    const moveDown = props.order < order

                    sections.forEach((section) => {
                        if(moveDown) {
                            // move section down
                            if(section.order > props.order && section.order <= order) {
                                section.order--
                            }
                        } else {
                            // move section up
                            if(section.order < props.order && section.order >= order) {
                                section.order++
                            }
                        }
                    })
                    props.order = order
                    sections.sort((a, b) => a.order - b.order)

                    this.$nextTick(() => {
                        // call function from utils
                        highlightSection(props.id)
                    })
                }
            }
        }
    }
}
</script>

<style lang="scss">

</style>
