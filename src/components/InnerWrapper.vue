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
                        :headlineText="section.headlineText"
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
                :key="index"
                :id="section.id"
                :headlineText="section.headlineText"
                :components="section.components"
                :useFullDeviceWidth="section.useFullDeviceWidth"
                :contentOrientation="section.contentOrientation"
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
import {useCmsStore} from "../stores/website"
import {createUuid} from "comand-component-library";

export default {
    mixins: [
        BaseI18nComponent
    ],
    computed: {
        ...mapState(usePiniaStore, ["site", "currentLanguage", "editMode", "mainHeadline", "slideshow"]),
        ...mapState(useCmsStore, ["activeSections"]),

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
        }
    },
    watch: {
        activeSections: {
            handler() {
                this.$nextTick(() => {
                    const sectionProvider = () => document.querySelectorAll("#content > .cmd-width-limitation-wrapper > section section")
                    if (this.$_intersectionObserver) {
                        this.$_intersectionObserver.disconnect()
                        this.$_intersectionObserver = null
                    }
                    const options = {
                        root: document.getElementById("page-wrapper"),
                        threshold: 0.25
                    }
                    this.$_intersectionObserver = new IntersectionObserver(entries => {
                        entries.filter(entry => entry.isIntersecting).forEach(entry => entry.target.classList.add("visible") )
                        console.log("IntersectionObserver", entries.filter(entry => entry.isIntersecting))
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
    .cmd-width-limitation-wrapper > section section {
        opacity: 0;

        &.visible {
            opacity: 1;
            transition: .5s ease-in all;
        }
    }
}
</style>
