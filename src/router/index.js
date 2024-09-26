import {createRouter, createWebHistory} from "vue-router"
import {useWebUIStore} from "../stores/web-ui"

const routes = []

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from) => {
    const store = useWebUIStore()
    store.setCurrentPageName(to.name)
    if (to.params.lang) {
        store.setCurrentLanguage(to.params.lang)
    }
    store.loadPageContent(to.name)
    return true
})

export default router
