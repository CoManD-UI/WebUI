import { createApp, defineAsyncComponent } from "vue"
import {createPinia} from "pinia"
import {useWebUIStore} from "./stores/web-ui.js"
import router from "./router"
import * as componentLibraryComponents from "comand-component-library"
import * as webUiComponents from "./components"
import * as directives from "./directives"

export * from "./components"

import axios from "axios"

function addRoute(route) {
    if (!route.meta) {
        route.meta = {}
    }
    route.meta.cmdCustomRoute = true
    router.addRoute(route)
}

function loadLanguages() {
    return axios(new URL("/templates/pages/data/languages.json", location.href).href)
}

function processLanguages(languageData, store) {
    store.setLanguageData(languageData)
}

function loadSite() {
    return axios(new URL("/site.json", location.href).href)
}

function processSite(site, store, routerConfigurer) {
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
    pages.forEach(page => processPage(page, store, routerConfigurer, []))
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

    if (typeof routerConfigurer === "object" && typeof routerConfigurer.onRoutesAdded === "function") {
        routerConfigurer.onRoutesAdded(addRoute)
    }
}

function processPage(page, store, routerConfigurer, path) {
    const route = {
        name: page.id,
        path: "/:lang([a-z]{2})" + (path.length > 0 ? "/" : "") + path.join("/") + "/" + page.id,
        component: webUiComponents.InnerWrapper
    }
    if (typeof routerConfigurer === "object" && typeof routerConfigurer.onBeforeRouteAdd === "function") {
        routerConfigurer.onBeforeRouteAdd(route)
    }
    router.addRoute(route)
    if (page.subEntries?.length > 0) {
        page.subEntries.forEach(subPage => processPage(subPage, store, routerConfigurer, [page.id]))
    }

    if (path.length === 0) {
        store.addPage(page)
    }
}

function bootstrap(app, routerConfigurer) {
    Object.entries(webUiComponents).forEach(([name, component]) => {
        app.component(name, component)
    })
    Object.entries(componentLibraryComponents).forEach(([name, component]) => {
        app.component(name, component)
    })
    Object.entries(directives).forEach(([name, directive]) => {
        app.directive(name, directive)
    })

    app.use(createPinia())

    const store = useWebUIStore()

    // return axios(new URL("/site.json", location.href).href).then(response => processSite(response.data, store))
    return loadLanguages()
        .then(response => processLanguages(response.data, store))
        .then(loadSite)
        .then(response => processSite(response.data, store, routerConfigurer))
}

export function bootstrapAndMount(options) {
    let app = options?.app
    if (!app) {
        let component = () => Promise.resolve(webUiComponents.CmdWebsite)
        if (options?.rootComponent) {
            component = () => Promise.resolve(options.rootComponent)
        } else if (options?.rootComponentImportPath) {
            component = () => import(options?.rootComponentImportPath)
        }
        app = createApp(defineAsyncComponent(component))
    }
    bootstrap(app, options?.routerConfigurer)
        .then(() => {
            if (typeof options?.appConfigurer === "function") {
                options.appConfigurer(app)
            }
            app.use(router).mount("#app")
        })
}
