import {createPinia} from "pinia"
import {usePiniaStore} from "./stores/pinia.js"
import {useWebStore} from "./stores/website.js"
import router from "./router"
import * as components from "comand-component-library"

// import local components
import LoginArea from "./components/LoginArea.vue"
import ListWithImages from "./components/ListWithImages.vue"
import RegisterForm from "./components/RegisterForm.vue"

// import settings-components
import CmdToggleDarkModeSettings from "./components/editmode/component-settings/CmdToggleDarkModeSettings.vue"
import CmdSocialNetworksSettings from "./components/editmode/component-settings/CmdSocialNetworksSettings.vue"
import CmdThumbnailScrollerSettings from "./components/editmode/component-settings/CmdThumbnailScrollerSettings.vue"
import ContactFormSettings from "./components/editmode/component-settings/ContactFormSettings.vue"
import CmdSlideshowSettings from "./components/editmode/component-settings/CmdSlideshowSettings.vue"
import CmdListOfLinksSettings from "./components/editmode/component-settings/CmdListOfLinksSettings.vue"
import CmdLinkItemSettings from "./components/editmode/component-settings/CmdLinkItemSettings.vue"
import CmdOpeningHoursSettings from "./components/editmode/component-settings/CmdOpeningHoursSettings.vue"
import CmdAddressDataSettings from "./components/editmode/component-settings/CmdAddressDataSettings.vue"
import CmdAddressDataItemSettings from "./components/editmode/component-settings/CmdAddressDataItemSettings.vue"
import CmdImageGallerySettings from "./components/editmode/component-settings/CmdImageGallerySettings.vue"
import CmdImageSettings from "./components/editmode/component-settings/CmdImageSettings.vue"
import CmdHeadlineSettings from "./components/editmode/component-settings/CmdHeadlineSettings.vue"
import CmdTextImageBlockSettings from "./components/editmode/component-settings/CmdTextImageBlockSettings.vue"
import SectionSettings from "./components/editmode/component-settings/SectionSettings.vue"
import CmdContainerSettings from "./components/editmode/component-settings/CmdContainerSettings.vue"

// import directives from comand-component-library
import directiveTelephone from "comand-component-library/src/directives/telephone"
import directiveFocus from "comand-component-library/src/directives/focus"
import directiveFancybox from "comand-component-library/src/directives/fancybox"
import axios from "axios"

export {default as CmdWebsite} from './components/CmdWebsite.vue'

function loadLanguages() {
    return axios(new URL("/templates/pages/data/languages.json", location.href).href)
}

function processLanguages(languageData, store) {
    store.setLanguageData(languageData)
}

function loadSite() {
    return axios(new URL("/site.json", location.href).href)
}

function processSite(site, store) {
    store.setLanguages(site.languages || ["de"])
    const pages = site.pages || [{id: "homepage"}]
    router.addRoute({
        path: "/",
        redirect: {
            name: pages[0].id,
            params: {
                lang: site.languages?.[0] || "de"
            }
        }
    })
    router.addRoute({
        path: "/:lang([a-z]{2})",
        redirect: () => ({
            name: store.currentPage?.id || pages[0].id
        })
    })
    pages.forEach(page => processPage(page, store, []))
    router.addRoute({
        path: "/:pathMatch(.*)*",
        redirect: "/"
    })
    store.setDefaultMetaData(site.defaultMetadata)

    store.setTemplate(site.template)

    if (site.siteStructure?.length > 0) {
        store.loadSiteStructure(site.siteStructure)
    }

    // assign pageFooter to store
    store.pageFooterContent = site.pageFooter
    store.siteConfiguration = site.siteConfiguration || {}
}

function processPage(page, store, path) {
    router.addRoute({
        name: page.id,
        path: "/:lang([a-z]{2})" + (path.length > 0 ? "/" : "") + path.join("/") + "/" + page.id,
        component: {}
    })
    if (page.subEntries?.length > 0) {
        page.subEntries.forEach(subPage => processPage(subPage, store, [page.id]))
    }

    if (path.length === 0) {
        store.addPage(page)
    }
}

function bootstrap(app) {
    Object.entries({
        LoginArea,
        ListWithImages,
        RegisterForm,
        CmdToggleDarkModeSettings,
        CmdImageGallerySettings,
        CmdImageSettings,
        CmdThumbnailScrollerSettings,
        CmdListOfLinksSettings,
        CmdLinkItemSettings,
        CmdAddressDataSettings,
        CmdAddressDataItemSettings,
        CmdOpeningHoursSettings,
        CmdHeadlineSettings,
        CmdTextImageBlockSettings,
        SectionSettings,
        CmdSocialNetworksSettings,
        CmdSlideshowSettings,
        ContactFormSettings,
        CmdContainerSettings
    }).forEach(([name, component]) => app.component(name, component))

    Object.entries(components).forEach(([name, component]) => {
        app.component(name, component)
    })

    app
        .use(createPinia())
        .directive('telephone', directiveTelephone)
        .directive('focus', directiveFocus)
        .directive('fancybox', directiveFancybox)

    const store = useWebStore()

    // return axios(new URL("/site.json", location.href).href).then(response => processSite(response.data, store))
    return loadLanguages()
        .then(response => processLanguages(response.data, store))
        .then(loadSite)
        .then(response => processSite(response.data, store))
}

export function bootstrapAndMount(app) {
    bootstrap(app).then(() => app.use(router).mount("#app"))
}
