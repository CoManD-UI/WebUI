<template>
        <!-- begin edit-mode for content-sections -->
        <template v-if="editMode">
            <EditModeSectionWrapper
                v-for="(section, index) in activeSections" :key="index"
                :id="'edit-mode-' + section.id"
                :sectionId="section.id"
                :sectionPath="['main', 'sections', index]"
                :sectionProps="{showLinkInMainNavigation: section.showLinkInMainNavigation, navEntry: section.navEntry, order: section.order}"
            >
                <!-- begin content sections -->
                <template v-slot="slotProps">
                    <ContentSection
                        :components="section.components"
                        :id="section.id"
                        :htmlClass="section.class"
                        :allowAddComponent="section.allowAddComponent"
                        :cmdHeadline="section.cmdHeadline"
                    />
                </template>
                <!-- end content sections -->
            </EditModeSectionWrapper>
        </template>
        <!-- end edit-mode for content-sections  -->

        <!-- begin default-view for content-sections -->
        <template v-else>
            <!-- begin content sections -->
            <ContentSection
                v-for="(section, index) in activeSections"
                :key="createUuid()"
                :id="section.id"
                :components="section.components"
                :useFullDeviceWidth="section.useFullDeviceWidth"
                :useInnerSection="section.useInnerSection"
                :contentType="section.contentType"
                :contentOrientation="section.contentOrientation"
                :cmdHeadline="section.cmdHeadline"
            />
            <!-- end content sections -->
        </template>
        <!-- end default-view for content-sections -->
</template>

<script>
// import used data
import BaseI18nComponent from "./mixins/BaseI18nComponent"

import {mapActions, mapState} from "pinia"
import {usePiniaStore} from "../stores/pinia"
import {useWebUIStore} from "../stores/web-ui"
import {createUuid} from "comand-component-library";

export default {
    mixins: [
        BaseI18nComponent
    ],
    computed: {
        ...mapState(usePiniaStore, ["site", "currentLanguage", "editMode", "mainHeadline", "slideshow"]),
        ...mapState(useWebUIStore, ["activeSections"]),

        cmdSlideButtons() {
            return {
                next: {
                    iconClass: "icon-single-arrow-right",
                    tooltip: this.label("slidebutton_next.tooltip")
                },
                prev: {
                    iconClass: "icon-single-arrow-left",
                    tooltip: this.label("slidebutton_previous.tooltip")
                }
            }
        }
    },
    methods: {
        componentPath() {
            return [
                "main",
                "slideshow"
            ]
        },
        ...mapActions(usePiniaStore, ["addContent"]),

        addSection() {
            this.addContent(["main", "sections", -1], {
                item() {
                    return {
                        id: createUuid(),
                        iconClass: "",
                        navEntry: "New section",
                        allowAddComponent: true,
                        components: []
                    }
                }
            })
        },
        createUuid
    },
    watch: {
        activeSections: {
            handler() {
                this.$nextTick(() => {
                    const sectionProvider = () => document.querySelectorAll("#content .cmd-width-limitation-wrapper > section:not(:has(.cmd-page-header))")
                    if (this.$_intersectionObserver) {
                        this.$_intersectionObserver.disconnect()
                        this.$_intersectionObserver = null
                    }
                    const options = {
                        root: document.getElementById("page-wrapper"),
                        threshold: 0.1
                    }
                    this.$_intersectionObserver = new IntersectionObserver(entries => {
                        entries.filter(entry => entry.isIntersecting).forEach(entry => {
                            entry.target.classList.add("visible")
                        } )
                    }, options)
                    setTimeout(() => sectionProvider().forEach(element => this.$_intersectionObserver.observe(element)), 500)
                })
            },
            immediate: true
        }
    }
}
</script>

<style>
#content {
    .cmd-width-limitation-wrapper > section:has(:not(.cmd-width-limitation-wrapper)) {
        opacity: 0;

        &.visible {
            opacity: 1;
            transition: .5s ease-in all;
        }
    }

    .cmd-width-limitation-wrapper > section:has(.cmd-page-header) {
        opacity: 1;
    }

    #services section {
        .cmd-box {
            opacity: 0;
        }

        &.visible .cmd-box {
            opacity: 1;
            transition: .5s ease-in all;

            &:nth-child(1) {
                transition-delay: .5s;
            }

            &:nth-child(2) {
                transition-delay: 1s;
            }

            &:nth-child(3) {
                transition-delay: 1.5s;
            }
        }
    }
}
</style>
