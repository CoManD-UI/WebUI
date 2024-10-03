import {createRouter, createWebHistory} from "vue-router"
import {useWebUIStore} from "../stores/web-ui"

const routes = []

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from) => {
    const store = useWebUIStore()
    store.setRouteMetaData({
        title: to.meta?.title
    })
    if (to.meta?.cmdCustomRoute) {
        store.setCurrentPageName("")
    } else {
        store.setCurrentPageName(to.name)
    }
    if (to.params.lang) {
        store.setCurrentLanguage(to.params.lang)
    }
    if (!to.meta?.cmdCustomRoute) {
        store.loadPageContent(to.name)
    }
    return true
})

export default router
