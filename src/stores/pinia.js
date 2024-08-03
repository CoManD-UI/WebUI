import {defineStore} from "pinia"
import {i18nClient} from "../api/I18nClient"
import axios from "axios"
/**
 * find a specific component in site-structure.
 *
 * <pre>
 * result = {
 *     parent: [] (contains entire parent-entry if exists),
 *     node: {}, null (contains real component)
 *     nodeIndex: number (contains index of specific component in parent-array)
 * }
 * </pre>
 *
 * @param site (contains entire site-structure)
 * @param componentPath (contains an array proving all levels to the component inside the site-structure)
 * @returns {{node: *}|null}
 *
 */
function findComponent(site, componentPath) {
    if (!(site && Array.isArray(componentPath) && componentPath.length > 0)) {
        return null
    }
    // ["main", "sections", {id: "section2"}, 0, {...}]

    // check if componentPath contains a component (otherwise $isComponent-flag is false)
    const lastComponentPathEntry = componentPath[componentPath.length - 1]
    if (typeof lastComponentPathEntry === "object" && lastComponentPathEntry.$isComponent === false) {
        // remove last item (here object) from componentPath to ensure following functions will not break
        componentPath = componentPath.slice(0, -1)
    }

    const result = {
        node: site
    }
    for (let i = 0, c = componentPath.length; i < c; i++) {
        if (typeof componentPath[i] === "object") {
            if (!Array.isArray(result.node)) {
                return null
            }
            result.parent = result.node
            result.node = result.node.find((childNode, index) => {
                if (propsMatch(childNode, componentPath[i])) {
                    result.nodeIndex = index
                    return true
                }
                return false
            })
        } else {
            result.parent = result.node
            if (componentPath[i] === -1) {
                result.nodeIndex = (result.parent?.length || 0) - 1
                result.node = null
            } else {
                result.nodeIndex = componentPath[i]
                result.node = result.node?.[componentPath[i]]
            }
        }
        if (!result.node) {
            return result
        }
    }
    return result
}

function propsMatch(node, props) {
    if (typeof node === "object") {
        const entries = Object.entries(props)
        for (let i = 0, c = entries.length; i < c; i++) {
            const [name, value] = entries[i]
            if (node[name] !== value) {
                return false
            }
        }
        return true
    }
    return false
}

export const usePiniaStore = defineStore("pinia", {
    state: () => ({
        site: {},
        fancybox: {
            status: false,
            img: false,
            images: [],
            imgIndex: 0,
            content: ""
        },
        languages: [],
        languageLabels: {},
        currentLanguage: 'de',
        mainHeadline: true,
        authToken: "",
        editMode: false
    }),
    getters: {
        metaData(state) {
            return state.site.metaData
        },
        labels(state) {
            if (state.languageLabels[state.currentLanguage]) {
                return state.languageLabels[state.currentLanguage]
            }
            return {}
        },
        // create getter to assure all information is loaded when site renders
        slideshow(state) {
            if (state.site.main?.slideshow) {
                return state.site.main.slideshow
            }
            return {slideshowItems: []}
        },
        // create getter to assure all information is loaded when site renders
        companyLogo(state) {
            if (state.site.siteHeader?.propsLogo) {
                return state.site.siteHeader?.propsLogo
            }
            return {}
        },
        sections(state) {
            // filter only shown sections
            const filteredSections = state.site.main?.sections?.filter(section => section.show !== false) || []

            // compare sections for order
            return filteredSections.toSorted((section1, section2) => {
                return section1.order - section2.order
            })
        }
    },
    actions: {
        activateEditMode() {
            this.editMode = true
        },
        deactivateEditMode() {
            this.editMode = false
        },
        setAuthToken(token) {
            this.authToken = token
        },
        deleteAuthToken() {
            this.authToken = ""
        },
        loadLabels() {
            i18nClient.getLanguagesAndLabels()
                .then(([languages, labels]) => {
                    this.languages = languages
                    this.languageLabels = labels
                })
                .catch(e => {
                    console.error('Error loading labels', e)
                    this.languages = []
                    this.languageLabels = {}
                    this.currentLanguage = ''
                })
        },
        loadSite() {
            axios.get("/templates/pages/data/site-" + this.currentLanguage + '.json')
                .then(response => {
                    this.site = response.data
                    // set section.order to continuous order (to avoid gaps)
                    this.site.main.sections.toSorted((section1, section2) => section1.order - section2.order).forEach((section, index) => {
                        section.order = index + 1
                    })
                })
                .catch(() => this.site = {})
        },
        addContent(componentPath, addHandler, componentPosition) {
            const result = findComponent(this.site, componentPath)

            // add new component-entry
            if (Array.isArray(result.parent) && result.nodeIndex != null) {
                let position = 1 // default adds '1' to nodeIndex to insert new component after existing one

                if (componentPosition === 'before') {
                    // set position to '0' to not raise nodeIndex and insert new component before existing one
                    position = 0
                }
                // insert new component
                result.parent.splice(result.nodeIndex + position, 0, addHandler.item())
            }

            console.log("sections", this.site.main.sections)
        },
        deleteContent(componentPath) {
            if (componentPath.length) {
                const lastComponentPathEntry = componentPath[componentPath.length - 1]
                if (typeof lastComponentPathEntry === "object" && lastComponentPathEntry.$isComponent === false) {
                    // remove last item (here object) from componentPath to ensure componentPath has default array-structure
                    componentPath = [...componentPath.slice(0, -1), ...lastComponentPathEntry.componentPath || []]
                }
            }

            // get component (and its parent)
            const result = findComponent(this.site, componentPath)

            // check if component parent is array
            if (Array.isArray(result.parent) && result.nodeIndex != null) {
                // delete entry from array
                result.parent.splice(result.nodeIndex, 1)
            } else if (typeof result.parent === "object" && result.nodeIndex != null) {
                // if parent component contains sub-components/is object, set corresponding property-name to empty object to remove content
                // removing entire property would disable to re-enter content for that sub-component/property
                if (typeof result.parent[result.nodeIndex] === "string") {
                    result.parent[result.nodeIndex] = ""
                } else {
                    result.parent[result.nodeIndex] = {}
                }

            }
        },
        updateContent(componentPath, updateHandlers) {
            const component = findComponent(this.site, componentPath)?.node
            if (!component || !Array.isArray(updateHandlers) || updateHandlers.length === 0) {
                return
            }
            const childUpdateHandlers = []
            if (updateHandlers.length > 1) {
                childUpdateHandlers.push(...updateHandlers.slice(1))
            }
            const updateHandler = updateHandlers[0].update
            if (typeof updateHandler === "function") {
                updateHandler(component.props || component, childUpdateHandlers)
            }
        },
        updateSettings(componentPath, updateCallback) {
            const component = findComponent(this.site, componentPath)?.node
            if (component) {
                updateCallback(component.props || component, this.site.main.sections)
            }
        },
        updateMetaData(metaData) {
            for (const name in metaData) {
                this.site.metaData[name] = metaData[name]
            }
        },
        updateSectionsSettings(componentPath, action, navEntry) {
            const contentElement = findComponent(this.site, componentPath)?.node
            // check if component path return a valid component
            if (!contentElement) {
                return
            }

            // toggle visibility for component
            if (action === "visibility") {
                if (contentElement.show == null) {
                    contentElement.show = false
                } else {
                    contentElement.show = !contentElement.show
                }
            } else if (action === "navEntryVisibility") {
                contentElement.showLinkInMainNavigation = !contentElement.showLinkInMainNavigation
            } else if (action === "editNavEntry") {
                contentElement.navEntry = navEntry
            }
        }
    }
})
