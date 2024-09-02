<template>
    <CmdWebsite />
</template>

<script>
export default {
    created() {
        // add link from frontend-framework via cdn
        const linkTagCdn = document.createElement("link")
        linkTagCdn.setAttribute("rel", "stylesheet")
        linkTagCdn.setAttribute("href", "https://cdn.jsdelivr.net/npm/comand-frontend-framework@4.0.71/dist/templates/dating.min.css")
        document.head.append(linkTagCdn)

        // add link for local template.css
        const linkTagLocalCss = document.createElement("link")
        linkTagLocalCss.setAttribute("rel", "stylesheet")
        linkTagLocalCss.setAttribute("href", "/templates/dating/styles/template.css")
        document.head.append(linkTagLocalCss)
    }
}
 </script>
