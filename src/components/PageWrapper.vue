<template>
    <a id="anchor-back-to-top"></a>
    <div :class="{'overflow-hidden': offCanvasOpen}" id="page-wrapper"
         :style="{'scroll-padding-top': heightSiteHeader + 'px'}">

        <!-- begin slot site-header -->
        <slot name="site-header"></slot>
        <!-- end slot site-header -->

        <!-- begin cmd-site-header -->
        <CmdSiteHeader
            v-if="cmdSiteHeader"
            :cmdMainNavigation="{navigationEntries: cmdSiteHeader.mainNavigationEntries}"
            :closeOffcanvas="{ iconClass: 'icon-cancel', text: label('main_navigation.close_navigation'), showText: true}"
            :navigationInline="cmdSiteHeader.navigationInline"
            @offcanvas="offcanvasToggled"
        >
            <template v-slot:top-header>
                <!-- begin cmd-list-of-links (for top-header-navigation) -->
                <CmdListOfLinks
                    v-if="cmdSiteHeader.topHeaderNavigationEntries"
                    :links="cmdSiteHeader.topHeaderNavigationEntries"
                    orientation="horizontal"
                    align="right"
                />
                <!-- end cmd-list-of-links (for top-header-navigation) -->
            </template>
            <template v-slot:logo>
                <!-- begin cmd-company-logo -->
                <CmdCompanyLogo
                    v-if="cmdSiteHeader.cmdCompanyLogo?.pathDefaultLogo"
                    :altText="cmdSiteHeader.cmdCompanyLogo?.altText"
                    :pathDefaultLogo="cmdSiteHeader.cmdCompanyLogo?.pathDefaultLogo"
                    :pathDarkmodeLogo="cmdSiteHeader.cmdCompanyLogo?.pathDarkmodeLogo"
                />
                <!-- end cmd-company-logo -->
            </template>
        </CmdSiteHeader>
        <!-- end cmd-site-header -->

        <!-- begin main-content -->
        <main id="content">
            <!-- begin slot top-content -->
            <slot name="top-content"></slot>
            <!-- end slot top-content -->

            <CmdWidthLimitationWrapper v-if="aside?.leftColumn?.show || aside?.rightColumn?.show" :innerClass="['inner-content-wrapper', {'full-width': useFullWidth}]">
                <!-- begin left column -->
                <aside v-if="aside?.leftColumn?.show" class="left-column">
                    <!-- begin slot left column -->
                    <slot name="left-column"></slot>
                    <!-- end slot left column -->
                </aside>
                <!-- end left column -->

                <!-- begin center/main column -->
                <div class="main-content-wrapper">
                    <!-- begin CmdPageHeader -->
                    <CmdWidthLimitationWrapper v-if="cmdPageHeader">
                        <CmdPageHeader v-bind="cmdPageHeader"/>
                    </CmdWidthLimitationWrapper>
                    <!-- end CmdPageHeader -->

                    <!-- begin slot center/main column -->
                    <slot></slot>
                    <!-- end slot center/main column -->

                    <!-- begin CmdPageFooter -->
                    <CmdWidthLimitationWrapper v-if="cmdPageFooter">
                        <CmdPageFooter v-bind="cmdPageFooter"/>
                    </CmdWidthLimitationWrapper>
                    <!-- end CmdPageFooter -->
                </div>
                <!-- end center/main column -->

                <!-- begin right column -->
                <aside v-if="aside?.rightColumn?.show" class="right-column">
                    <!-- begin slot right column -->
                    <slot name="right-column"></slot>
                    <!-- end slot right column -->
                </aside>
                <!-- begin right column -->
            </CmdWidthLimitationWrapper>

            <!-- begin center/main column -->
            <template v-else>
                <!-- begin CmdPageHeader -->
                <CmdWidthLimitationWrapper v-if="cmdPageHeader">
                    <CmdPageHeader v-bind="cmdPageHeader"/>
                </CmdWidthLimitationWrapper>
                <!-- end CmdPageHeader -->

                <!-- begin slot center/main column -->
                <slot></slot>
                <!-- end slot center/main column -->

                <!-- begin CmdPageFooter -->
                <CmdWidthLimitationWrapper v-if="cmdPageFooter">
                    <CmdPageFooter v-bind="cmdPageFooter"/>
                </CmdWidthLimitationWrapper>
                <!-- end CmdPageFooter -->
            </template>
            <!-- end center/main column -->
        </main>
        <!-- end main-content -->

        <!-- begin cmd-site-footer -->
        <CmdSiteFooter v-if="cmdSiteFooter">
            <!-- begin parent-component -->
            <component
                v-for="(component, index) in cmdSiteFooter.components || []" :key="index"
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
            v-if="cmdCookieDisclaimer"
            :show="fancyBoxCookieDisclaimer"
            :fancyboxOptions="{}"
            :allowEscapeKey="false"
            :cmdHeadline="{show: true, headlineText: 'Cookie Disclaimer', headlineLevel: 2}"
            ariaLabelText="Cookie Disclaimer"
        >
            <!-- begin cookie-disclaimer ------------------------------------------------------------------------------------------------------------------------------------------------------->
            <CmdCookieDisclaimer
                :cookieOptions="cmdCookieDisclaimer.options"
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
</template>

<script>
// import functions
//import {openFancyBox} from "@/components/CmdFancyBox.vue"

// import store
import {useCmsStore} from "../stores/cms"

// import mixins
import BaseI18nComponent from "../components/mixins/BaseI18nComponent"
import {mapState} from "pinia";

export default {
    name: "PageWrapper",
    data() {
        return {
            offCanvasOpen: false,
            heightSiteHeader: 150,
            acceptedCookies: [],
            fancyBoxCookieDisclaimer: true
        }
    },
    mixins: [
        BaseI18nComponent
    ],
    props: {
        topHeaderNavigationEntries: {
            default: []
        },
        mainNavigationEntries: {
            default: []
        },
        useFullWidth: {
           type: Boolean,
           default: false
        },
        aside: {
        },
        cmdSiteHeader: {
            default: null
        },
        cmdCompanyLogo: {
            default: null
        },
        pageHeadlineText: {
            type: String,
            default: ""
        },
        cmdSocialNetworks: {
            default: null
        },
        cmdSiteFooter: {
            default: null
        },
        cmdPageHeader: {
            type: Object,
            default: null
        },
        cmdPageFooter: {
            type: Object,
            required: false
        },
        cmdCookieDisclaimer: {
            default: null
        }
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
    computed: {
        iconBackToTop() {
            return {
                iconClass: "icon-chevron-one-stripe-up",
                tooltip: this.label("back_to_top_button.tooltip")
            }
        },
        ...mapState(useCmsStore, ["currentLanguageData"
        ]),
    },
    methods: {
        label(labelText) {
            // get label for current language (or show labelText-string)
            return this.currentLanguageData[labelText] ?? labelText
        },
        offcanvasToggled(event) {
            this.offCanvasOpen = event.open
        },
        handlers(component) {
            if (component.handlers === "toggleSection") {
                return {
                    "click": this.toggleSection
                }
            }
            return {}
        },
        openFancybox(event) {
            openFancyBox({url: event.target.href})
        },
        closeCookieDisclaimer() {
            this.fancyBoxCookieDisclaimer = false
            localStorage.setItem("onepagerPrivacySettingsAccepted", "true")
        }
    }
}
</script>

<style lang="scss">
@import "comand-component-library/src/assets/styles/variables.scss";

.inner-content-wrapper {
    display: flex;
    padding-top: calc(var(--default-padding) * 2) !important;
    padding-bottom: calc(var(--default-padding) * 2) !important;

    &:has(> aside) {
        .main-content-wrapper {
            > .cmd-width-limitation-wrapper {
                &:first-child {
                    > section {
                        padding-top: 0 !important;
                    }
                }

                > section {
                    padding-left: calc(var(--default-padding) * 2) !important;
                    padding-right: calc(var(--default-padding) * 2) !important;
                }
            }
        }

        aside {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: var(--default-gap);
            max-width: 20%;
            container: sidebar / inline-size;

            & > * {
                margin: 0;
            }

            &:first-child {
                & + .main-content-wrapper {
                    flex: 2;

                    &:last-child {
                        flex: 3;
                    }
                }
            }
        }
    }

    &.full-width {
        &:has(> aside) {
            aside {
                max-width: 15%;
            }
        }
    }

    .main-content-wrapper {
        width: 100%;
    }
}

@media only screen and (width <= $medium-max-width) {
    .inner-content-wrapper {
        flex-direction: column;

        .main-content-wrapper {
            border: 1px solid red;
        }

        &:has(> aside) {
            aside {
                max-width: none;

                &:first-child {
                    & + .main-content-wrapper {
                        flex: none;

                        &:last-child {
                            flex: none;
                        }
                    }
                }

                & > * {
                    width: auto !important;
                }
            }
        }
    }
}

@media only screen and (width <= $small-max-width) {
    .inner-content-wrapper {
        gap: calc(var(--default-gap) * 2);

        &:has(> aside) {
            aside {
                flex-direction: column;
                border: 1px solid blue !important;

                & > * {
                    width: 100% !important;
                }
            }
        }
    }
}
</style>