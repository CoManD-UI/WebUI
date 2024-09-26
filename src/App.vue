<template>
    <CmdWebsite />
</template>

<script>
import {mapState} from "pinia";
import {useWebUIStore} from "./stores/web-ui"

export default {
    computed: {
        ...mapState(useWebUIStore, ["template"])
    },
    created() {
        if (this.template === "dating") {
            // add link from frontend-framework via cdn
            const linkTagCdn = document.createElement("link")
            linkTagCdn.setAttribute("rel", "stylesheet")
            linkTagCdn.setAttribute("type", "text/css")
            linkTagCdn.setAttribute("href", "https://cdn.jsdelivr.net/npm/comand-frontend-framework@4.0.71/dist/templates/dating.min.css")
            document.head.append(linkTagCdn)
        }

        // add link for local template.css
        const linkTagLocalCss = document.createElement("link")
        linkTagLocalCss.setAttribute("rel", "stylesheet")
        linkTagLocalCss.setAttribute("type", "text/css")
        linkTagLocalCss.setAttribute("href", "/templates/" + this.template + "/styles/template.css")
        document.head.append(linkTagLocalCss)
    }
}
 </script>
