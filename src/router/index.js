import {createRouter, createWebHistory} from "vue-router"
import {useCmsStore} from "../stores/cms"

const routes = []

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from) => {
    const store = useCmsStore()
    store.setCurrentPageName(to.name)
    if (to.params.lang) {
        store.setCurrentLanguage(to.params.lang)
    }
    store.loadPageContent(to.name)
    return true
})

export default router
