<template>
    <PageWrapper
        :aside="aside"
         :cmdSiteHeader="cmdSiteHeader"
         :cmdSiteFooter="siteFooter"
         :cmdPageHeader="pageHeader"
         :cmdPageFooter="pageFooter"
         :pageHeadlineText="pageHeadlineText"
    >
        <template v-slot:top-content>
            <ContentSection
                v-for="(section, index) in topContentActiveSections"
                :key="index"
                :id="section.id"
                :cmdHeadline="section.cmdHeadline"
                :components="section.components"
                :innerClass="section.innerClass"
                :contentType="section.contentType"
                :contentOrientation="section.contentOrientation"
                :useFullDeviceWidth="section.useFullDeviceWidth"
            >
            </ContentSection>
        </template>
        <template v-slot:left-column>
            <component
                v-for="(component, componentIndex) in asideLeftColumnContent"
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
        </template>
        <router-view></router-view>
        <template v-slot:right-column>
            <component
                v-for="(component, componentIndex) in asideRightColumnContent"
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
        </template>

        <!-- begin CmdFancyBox with CmdCookieDisclaimer -->
        <CmdFancyBox
            v-if="cookieDisclaimer.useCookieDisclaimer"
            :show="showCookieDisclaimer()"
            :allowEscapeKey="false"
            :fancyBoxOptions="{ 'closeIcon': { show: false }}"
            ariaLabelText="Cookie Disclaimer">
            <CmdCookieDisclaimer
                :i18n="currentLanguageData"
                v-bind="cookieDisclaimer"
                @close-cookie-disclaimer="setCookies" />
        </CmdFancyBox>
        <!-- end CmdFancyBox with CmdCookieDisclaimer -->
    </PageWrapper>
</template>

<script>
// import components from comand-component-library
import {createUuid, openFancyBox} from 'comand-component-library'

// import functions
import {mapActions, mapState} from "pinia"
import {usePiniaStore} from "../stores/pinia"
import {useWebUIStore} from "../stores/web-ui"
import {setCookieDisclaimerCookie, getCookieDisclaimerCookie} from "comand-component-library"

// import mixins
import BaseI18nComponent from "../components/mixins/BaseI18nComponent"
import {useEditModeContext} from "../composables/editModeContext.js"
import {computed, watch} from "vue"

export default {
    mixins: [
        BaseI18nComponent
    ],
    provide() {
        return {
            editModeContext: computed(() => this.context)
        }
    },
    props: {
        cookieDisclaimerData: {
            type: Object
        }
    },
    data() {
        return {
            editModeMessage: true,
            // context: this.editMode ? useEditModeContext() : null,
            acceptedCookies: [],
            fancyBoxCookieDisclaimer: true,
            footerNavigationData: [],
            topHeaderNavigationData: [],
            currentUrlHash: location.hash,
            heightSiteHeader: 150,
            offCanvasOpen: false,
            selectedTemplate: "blank",
            showCookieDisclaimerFancybox: true
        }
    },
    created() {
        // register event-listener to check if location.hash has changed, so 'active'-class for navigation can be set correctly
        addEventListener("hashchange", this.onLocationHashChanged)

        // load labels and section-content from store
        this.loadLabels()

        // save privacy settings
        this.fancyBoxCookieDisclaimer = localStorage.getItem('onepagerPrivacySettingsAccepted') !== "true"

        const store = usePiniaStore()
        // watch(() => store.site.main?.sections, sections => sections.length === 0 && sections.push({
        //     id: createUuid(),
        //     iconClass: "",
        //     navEntry: "New section",
        //     allowAddComponent: true,
        //     components: []
        // }), { deep: true })
    },
    mounted() {
        const siteHeader = document.getElementsByClassName("cmd-site-header")

        if (siteHeader.length > 0) {
            const resizeObserver = new ResizeObserver(entries => {
                // get height of site-header to set scroll-padding on .page-wrapper
                this.heightSiteHeader = entries[0].target.offsetHeight
            })
            resizeObserver.observe(siteHeader[0])
        }
    },
    beforeUnmount() {
        removeEventListener("hashchange", this.onLocationHashChanged)
    },
    computed: {
        ...mapState(usePiniaStore, [
            "currentLanguage",
            "site",
            "editMode",
            "showEditModeComponentSettings",
            "sections"
        ]),
        ...mapState(useWebUIStore, [
            "mainNavigationEntries",
            "showSiteHeader",
            "showSiteFooter",
            "siteHeader",
            "siteFooter",
            "pageFooter",
            "pageHeader",
            "companyLogo",
            "metaData",
            "asideLeftColumnShow",
            "asideLeftColumnContent",
            "asideRightColumnShow",
            "asideRightColumnContent",
            "topContentActiveSections",
            "pageHeadlineText",
            "cookieDisclaimer",
        ]),
        cmdSiteHeader() {
            return {
                navigationInline: !!this.siteHeader?.navigationInline,
                cmdCompanyLogo: this.companyLogo,
                mainNavigationEntries: this.mainNavigationEntries
            }
        },
        aside() {
            return {
                leftColumn: {
                    show: this.asideLeftColumnShow,
                },
                rightColumn: {
                    show: this.asideRightColumnShow
                }
            }
        },
        context() {
            return this.editMode ? useEditModeContext() : null
        },
        openingHours() {
            const openingHoursTranslated = []

            for (let i = 0; i < this.openingHoursData.length; i++) {
                // copy/spread one weekday of openingHoursData to variable
                const weekday = {...this.openingHoursData[i]}

                // assign label from BaseI18n (or the value set in json-file)
                weekday.day = this.label('opening_hours.' + weekday.day, weekday.day)

                openingHoursTranslated.push(weekday)
            }

            return openingHoursTranslated

        }
    },
    methods: {
        setCookies(event) {
            setCookieDisclaimerCookie(event)
            this.showCookieDisclaimerFancybox = false
            location.reload() // reload page to update components that use cookies
        },
        showCookieDisclaimer() {
            // check if cookeDisclaimerCookie is empty (and option to show CookieDisclaimerFancybox is enabled)
            return getCookieDisclaimerCookie().length === 0 && this.showCookieDisclaimerFancybox !== false
        },
        componentPath(componentIndex) {
            return [
                "siteFooter",
                "components",
                componentIndex
            ]
        },
        childComponentPath(componentIndex) {
            return [
                "components",
                componentIndex
            ]
        },
        handlers(component) {
            if (component.handlers === "toggleSection") {
                return {
                    "click": this.toggleSection
                }
            }
            return {}
        },
        toggleSection(event) {
            if (event.link.sectionId) {
                event.originalEvent.preventDefault()
                const sectionToToggle = this.site.main?.sections.find(section => {
                    return section.id === event.link.sectionId
                })
                if (sectionToToggle) {
                    sectionToToggle.show = !sectionToToggle.show
                }
            }
        },
        // update data-property on url/hash-change to trigger update of mainNavigation-computed-property
        onLocationHashChanged() {
            this.currentUrlHash = location.hash
        },

        ...mapActions(usePiniaStore, ["loadLabels", "loadSite"]),

        openFancybox(event) {
            openFancyBox({url: event.target.href})
        },
        closeCookieDisclaimer() {
            this.fancyBoxCookieDisclaimer = false
            localStorage.setItem("onepagerPrivacySettingsAccepted", "true")
        },
        offcanvasToggled(event) {
            this.offCanvasOpen = event.open
        }
    },
    watch: {
        metaData: {
            handler() {
                const metaNames = ["description","rating","robots","author"]
                document.head.querySelectorAll(metaNames.map(name => `meta[name="${name}"]`).join(","))
                    .forEach(element => element.remove())
                if (this.metaData) {
                    for (const name in this.metaData) {
                        if (name === "title") {
                            document.head.querySelector("title").innerText = this.metaData.title
                        } else {
                            const metaTag = document.head.querySelector("meta[name='" + name + "']")
                            if (metaTag) {
                                metaTag.setAttribute("content", this.metaData[name])
                            } else {
                                const newMetaTag = document.createElement("meta")
                                newMetaTag.setAttribute("name", name)
                                newMetaTag.setAttribute("content", this.metaData[name])
                                document.head.appendChild(newMetaTag)
                            }
                        }
                    }
                }
            },
            immediate: true,
            deep: true
        },
        currentLanguage: {
            handler() {
                // load site if language is changed (in store)
                this.loadSite()
            },
            immediate: true
        }
    }
}
</script>