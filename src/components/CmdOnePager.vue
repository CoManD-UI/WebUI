<template>
    <div :class="{'edit-mode': editMode}" :id="templateId">
        <a id="anchor-back-to-top"></a>
        <!-- begin edit-mode-main-sidebar -->
        <EditModeMainSidebar v-if="editMode" :editModeMessage="editModeMessage" @change-template="changeTemplate" />
        <!-- end edit-mode-main-sidebar -->

        <!-- begin page-wrapper -->
        <div :class="{'overflow-hidden': offCanvasOpen}" id="page-wrapper"
             :style="{'scroll-padding-top': heightSiteHeader + 'px'}">

            <!-- begin cmd-site-header -->
            <CmdSiteHeader
                v-if="showSiteHeader"
                :cmd-main-navigation="{navigationEntries: mainNavigationEntries}"
                :closeOffcanvas="{ iconClass: 'icon-cancel', text: label('main_navigation.close_navigation'), showText: true}"
                :navigationInline="siteHeader.navigationInline"
                @offcanvas="offcanvasToggled"
            >
                <template v-slot:top-header>
                    <!-- begin cmd-list-of-links (for top-header-navigation) -->
                    <CmdListOfLinks
                        v-if="topHeaderNavigationData"
                        :links="topHeaderNavigationData"
                        orientation="horizontal"
                        align="right"
                    />
                    <!-- end cmd-list-of-links (for top-header-navigation) -->
                </template>
                <template v-slot:logo>
                    <!-- begin cmd-company-logo -->
                    <CmdCompanyLogo
                        v-if="companyLogo.pathDefaultLogo"
                        :altText="companyLogo.altText"
                        :pathDefaultLogo="companyLogo.pathDefaultLogo"
                        :pathDarkmodeLogo="companyLogo.pathDarkmodeLogo"
                    />
                    <!-- end cmd-company-logo -->
                </template>
            </CmdSiteHeader>
            <!-- end cmd-site-header -->

            <!-- begin inner-wrapper -->
            <InnerWrapper/>
            <!-- end inner-wrapper -->

            <!-- begin cmd-site-footer -->
            <template v-if="showSiteFooter">
                <template v-if="editMode">
                    <!-- begin edit-section-wrapper -->
                    <EditModeSectionWrapper :sectionPath="[]">
                        <CmdSiteFooter>
                            <!-- begin parent-component -->
                            <EditComponentWrapper
                                v-for="(component, componentIndex) in siteFooter.components || []"
                                :key="componentIndex"
                                :allow-add-component="component.allowAddComponent"
                                :componentName="component.name"
                                :componentProps="component.props"
                                :componentPath="componentPath(componentIndex)">
                                <component
                                    :is="component.name"
                                    v-bind="component.props"
                                    v-on="handlers(component)"
                                >
                                    <!-- begin child-component -->
                                    <EditComponentWrapper
                                        v-for="(childComponent, childComponentIndex) in component.components || []"
                                        :key="childComponentIndex"
                                        :is="childComponent.name"
                                        :allow-add-component="childComponent.allowAddComponent"
                                        :componentName="childComponent.name"
                                        :componentProps="childComponent.props"
                                        :componentPath="childComponentPath(childComponentIndex)"
                                    >
                                        <component
                                            :is="childComponent.name"
                                            v-bind="childComponent.props"
                                            v-on="handlers(childComponent)"
                                        />
                                    </EditComponentWrapper>
                                    <!-- end child-component -->
                                </component>
                            </EditComponentWrapper>
                            <!-- end parent-component -->
                        </CmdSiteFooter>
                    </EditModeSectionWrapper>
                    <!-- end edit-section-wrapper -->
                </template>

                <CmdSiteFooter v-else>
                    <!-- begin parent-component -->
                    <component
                        v-for="(component, index) in siteFooter.components || []" :key="index"
                        :is="component.name"
                        v-bind="component.props"
                        v-on="handlers(component)"
                    >
                        <!-- begin child-component -->
                        <component
                            v-for="(childComponent, childComponentIndex) in component.components || []"
                            :key="childComponentIndex" :is="childComponent.name"
                            v-bind="childComponent.props"
                            v-on="handlers(childComponent)"
                            :editContent="childComponent.editContent"
                        />
                        <!-- end child-component -->
                    </component>
                    <!-- end parent-component -->
                </CmdSiteFooter>
            </template>
            <!-- end cmd-site-footer -->

            <!-- begin cmd-copyright-information DO NOT REMOVE -->
            <CmdCopyrightInformation/>
            <!-- end cmd-copyright-information DO NOT REMOVE -->

            <!-- begin cmd-back-to-top-button -->
            <CmdBackToTopButton
                href="#anchor-back-to-top"
                :iconBackToTop="iconBackToTop"
                scroll-container="#page-wrapper"
            />
            <!-- end cmd-back-to-top-button -->

            <!-- begin fancy-box ------------------------------------------------------------------------------------------------------------------------------------------------------->
            <CmdFancyBox
                v-if="cookieDisclaimerData"
                :show="fancyBoxCookieDisclaimer"
                :fancyboxOptions="{}"
                :allowEscapeKey="false"
                :cmdHeadline="{show: true, headlineText: 'Cookie Disclaimer', headlineLevel: 2}"
                ariaLabelText="Cookie Disclaimer"
            >
                <!-- begin cookie-disclaimer ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdCookieDisclaimer
                    :cookieOptions="cookieDisclaimerData"
                    buttonLabelAcceptAllCookies="Accept all cookies"
                    buttonLabelAcceptCurrentSettings="Accept current settings"
                    @closeCookieDisclaimer="closeCookieDisclaimer"
                    v-model="acceptedCookies"
                    :cmdHeadlineCookieDisclaimer="{ show: false }">
                    <template #privacy-text>
                        <p>
                            <strong>
                                By browsing this web site you accept the usage and saving of anonymous data!
                            </strong>
                        </p>
                    </template>
                </CmdCookieDisclaimer>
                <!-- end cookie-disclaimer ------------------------------------------------------------------------------------------------------------------------------------------------------->
            </CmdFancyBox>
            <!-- end fancy-box ------------------------------------------------------------------------------------------------------------------------------------------------------->
        </div>
        <!-- end page-wrapper -->

        <!-- begin edit-mode-settings-sidebar -->
        <EditModeSettingsSidebar v-if="editMode && context?.settings.show()"/>
        <!-- end edit-mode-settings-sidebar -->
    </div><!-- end templateId -->
</template>

<script>
// import components from comand-component-library
import {createUuid, openFancyBox} from 'comand-component-library'

// import functions
import {mapActions, mapState} from "pinia"
import {usePiniaStore} from "../stores/pinia"
import {useCmsStore} from "../stores/cms"

// import mixins
import BaseI18nComponent from "../components/mixins/BaseI18nComponent"
import {useEditModeContext} from "../composables/editModeContext.js"
import {computed, watch} from "vue";

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
            selectedTemplate: "blank"
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
        watch(() => store.site.main?.sections, sections => sections.length === 0 && sections.push({
            id: createUuid(),
            iconClass: "",
            navEntry: "New section",
            allowAddComponent: true,
            components: []
        }), { deep: true })
    },
    mounted() {
        const siteHeader = document.getElementsByClassName("cmd-site-header")

        if (siteHeader.length > 0) {
            const resizeObserver = new ResizeObserver(entries => {
                // get height of site-header to set scroll-padding on #page-wrapper
                this.heightSiteHeader = entries[0].target.offsetHeight
            })
            resizeObserver.observe(siteHeader[0])
        }
    },
    beforeUnmount() {
        removeEventListener("hashchange", this.onLocationHashChanged)
    },
    computed: {
        context() {
            return this.editMode ? useEditModeContext() : null
        },
        templateId() {
            return "template-" + (this.selectedTemplate || "blank")
        },
        ...mapState(usePiniaStore, ["currentLanguage", "site", "editMode", "showEditModeComponentSettings", "sections"]),
        ...mapState(useCmsStore, ["mainNavigationEntries", "showSiteHeader", "showSiteFooter", "siteHeader", "siteFooter", "companyLogo", "metaData"]),

        mainNavigation() {
            const navigationEntries = []

            for (let i = 0; i < this.sections.length; i++) {
                if (this.sections[i].showLinkInMainNavigation) {
                    const path = "#anchor-" + this.sections[i].id
                    const entry = {
                        iconClass: this.sections[i].iconClass,
                        text: this.sections[i].navEntry,
                        path: path,
                        type: "href",
                        active: this.currentUrlHash === path // compare url from hash with path from store to set 'active'-class
                    }
                    navigationEntries.push(entry)
                }
            }
            return navigationEntries
        },
        iconBackToTop() {
            return {
                iconClass: "icon-single-arrow-up",
                tooltip: this.label("back_to_top_button.tooltip")
            }
        },
        // addressData() {
        //    const addressDataTranslated = JSON.parse(JSON.stringify(this.addressDataData))
        //    addressDataTranslated.address.country = this.label(addressDataTranslated.address.country, addressDataTranslated.address.country)
        //     return addressDataTranslated
        // },

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
        changeTemplate(event) {
            this.selectedTemplate = event
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