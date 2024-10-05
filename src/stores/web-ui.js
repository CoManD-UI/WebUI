import {defineStore} from "pinia"
import axios from "axios"

function findPageById(pages, id, parents) {
    for (let i = 0; i < pages.length; i++) {
        if (pages[i].id === id) {
            return pages[i]
        }
        if (pages[i].subEntries?.length > 0) {
            const page = findPageById(pages[i].subEntries, id, parents)
            if (page) {
                if (parents) {
                    parents.unshift(pages[i])
                }
                return page
            }
        }
    }
    return null
}

export const useWebUIStore = defineStore("cms", {
    state: () => ({
        template: "blank",
        languages: [],
        languageData: {},
        defaultMetaData: {},
        pages: [],
        currentLanguage: "de",
        pageContent: {},
        currentPageName: "",
        siteHeader: {},
        siteFooter: {},
        siteStructure: [],
        pageFooterContent: {},
        siteConfiguration: {},
        routeMetaData: {}
    }),
    getters: {
        topContentActiveSections() {
            return this.currentPageContent?.topContent?.sections?.filter(section => section.show !== false) || []
        },
        pageHeadlineText() {
            return this.currentPageContent?.mainContent?.pageHeadlineText
        },
        asideLeftColumnShow() {
            return this.currentPageContent?.mainContent?.aside?.leftColumn?.show
        },
        asideLeftColumnContent() {
            return this.currentPageContent?.mainContent?.aside?.leftColumn?.components || []
        },
        asideRightColumnShow() {
            return this.currentPageContent?.mainContent?.aside?.rightColumn?.show
        },
        asideRightColumnContent() {
            return this.currentPageContent?.mainContent?.aside?.rightColumn?.components || []
        },
        mainNavigationEntries(state) {
            if (state.pages.length === 1) {
                return this.sectionEntries
            }
            return this.pageEntries
        },
        /**
         * return active/visible sections (of current page) only
         */
        activeSections() {
            return this.sections.filter(section => section.show !== false)
        },
        /**
         * return all existing sections (of current page)
         */
        sections() {
            return this.currentPageContent?.mainContent?.sections?.toSorted((section1, section2) => section1.order - section2.order) || []
        },
        pageHeader() {
            if (this.currentPageName === '' || (this.currentPageName === 'homepage' && !this.pageHeadlineText)) {
                return null
            }

            return {
                cmdBreadcrumbs: this.currentPageName === 'homepage' ? null : this.breadcrumbs,
                cmdHeadline: {
                    headlineText: this.pageHeadlineText,
                    headlineLevel: 1
                }
            }
        },
        pageFooter() {
            // create deep-copy of pageFooterContent from state
            const pageFooterContent = JSON.parse(JSON.stringify(this.pageFooterContent))

            if(pageFooterContent.cmdSocialNetworks.cmdFormElement) {
                pageFooterContent.cmdSocialNetworks.cmdFormElement.labelText = this.currentLanguageData["cmd_social_networks.labeltext.accept_privacy"]
            }

            pageFooterContent.cmdSocialNetworks.networks?.forEach((item) => {
                    // assign values of specific keys from currentLanguageData to keys for each social network
                    item.tooltip = this.currentLanguageData[item.tooltip] ?? item.tooltip
                    item.linkText = this.currentLanguageData[item.linkText] ?? item.linkText
            })

            return pageFooterContent
        },
        breadcrumbs() {
            const parents = []
            const currentPage = findPageById(this.pages, this.currentPageName, parents)
            if (this.siteConfiguration.breadcrumbs?.showHomeLinkFirst) {
                const homepage = this.pages[0]
                parents.unshift(homepage)
            }

            return {
                breadcrumbLabel: this.siteConfiguration.breadcrumbs?.showBreadcrumbLabel !== false ? this.currentLanguageData["cmdbreadcrumbs.labeltext.you_are_here"] : "",
                breadcrumbSeparator: this.siteConfiguration.breadcrumbs?.breadcrumbSeparator || undefined,
                breadcrumbLinks: [
                    ...(parents.map((page,index) => ({
                        "type": index === 0 ? "router" : "", // homepage should be router, all other parents should not be a link/router
                        "text": this.currentLanguageData[page.navEntry] ?? page.navEntry, // check for language-string to translate else show given string
                        "route": {
                            "name": page.id,
                            params: {
                                lang: this.currentLanguage
                            }
                        }
                    }))),
                    {
                        "type": "",
                        "text": this.currentLanguageData[currentPage?.navEntry] ?? currentPage?.navEntry,
                        "route": {
                            "name": this.currentPageName,
                            params: {
                                lang: this.currentLanguage
                            }
                        }
                    }
                ]
            }
        },
        showSiteHeader(state) {
            return state.siteStructure.includes("siteHeader")
        },
        showSiteFooter(state) {
            return state.siteStructure.includes("siteFooter")
        },
        companyLogo(state) {
            return state.siteHeader?.props?.cmdCompanyLogo || {}
        },
        metaData(state) {
            return {
                title: state.routeMetaData?.title || findPageById(state.pages, state.currentPageName)?.navEntry,
                ...state.defaultMetaData,
                ...(this.currentPageContent?.metadata || {})
            }
        },
        currentPage(state) {
            return findPageById(state.pages, state.currentPageName)
        },
        currentPageContent(state) {
            return state.pageContent[state.currentLanguage]?.[state.currentPageName]
        },
        sectionEntries(state) {
            return this.currentPageContent?.mainContent?.sections
                ?.filter(section => section.showLinkInMainNavigation)
                ?.map(section => ({
                    iconClass: section.iconClass,
                    text: section.navEntry,
                    path: "#anchor-" + section.id,
                    type: "href",
                    active: location.hash === "#anchor-" + section.id
                }))
        },
        pageEntries(state) {
            const filterbyNavigation = (pages) => {
                return (pages || [])
                    .filter(page => page.navigation?.includes("main"))
                    .map(page => ({
                        iconClass: page.iconClass,
                        text: this.currentLanguageData[page.navEntry] ?? page.navEntry,
                        ...navEntryType(page),
                        subentries: filterbyNavigation(page.subEntries)
                    }))
            }

            function navEntryType(page) {
                if (!page.externalLink) {
                    return {
                        route: {
                            name: page.id,
                            params: {
                                lang: state.currentLanguage
                            }
                        },
                        type: page.subEntries?.length ? "href" : "router",
                    }
                }
                return {
                    path: page.path,
                    type: "href",
                    target: "_blank"
                }
            }

            return filterbyNavigation(state.pages)
        },
        currentLanguageData(state) {
            return state.languageData[state.currentLanguage] || {}
        },
        numberOfPages(state) {
            return state.pages.length
        }
    },
    actions: {
        setTemplate(template) {
            this.template = template
        },
        setLanguages(languages) {
            this.languages = languages || []
            if (!this.languages.includes(this.currentLanguage)) {
                this.setCurrentLanguage(this.languages?.[0] || "de")
            }
        },
        setLanguageData(languageData) {
            this.languageData = languageData
        },
        setDefaultMetaData(metaData) {
            this.defaultMetaData = metaData || {}
        },
        setCurrentLanguage(language) {
            this.currentLanguage = language
            // if (this.pageContent[this.currentLanguage]?.["header-footer"]) {
            //     return
            // }
            if (!this.pageContent[this.currentLanguage]) {
                this.pageContent[this.currentLanguage] = {}
            }
            const url = new URL(`/templates/${this.template}/pages-${this.currentLanguage}/header-footer.json`, location.href)
            axios(url.href)
                .then(response => response.data)
                .then(structure => {
                    this.siteHeader = structure.siteHeader || {}
                    this.siteFooter = structure.siteFooter || {}
                    // this.pageContent[this.currentLanguage]["header-footer"] = true
                })
        },
        setRouteMetaData(metaData) {
            this.routeMetaData = metaData
        },
        addPage(page) {
            this.pages.push(page)
        },
        setCurrentPageName(name) {
            this.currentPageName = name
            document.body.setAttribute("id", name)
        },
        loadPageContent(name) {
            if (this.pageContent[this.currentLanguage]?.[name]) {
                return
            }
            if (!this.pageContent[this.currentLanguage]) {
                this.pageContent[this.currentLanguage] = {}
            }
            const url = new URL(`/templates/${this.template}/pages-${this.currentLanguage}/${name}.json`, location.href)
            axios(url.href)
                .then(response => response.data)
                .then(pageContent => this.pageContent[this.currentLanguage][name] = pageContent)
        },
        loadSiteStructure(siteStructure) {
            this.siteStructure = siteStructure || []
        },
        updateMetaData(metaData) {
            // update meta data for current page
            this.currentPageContent.metadata = {...metaData}
        }
    }
})
