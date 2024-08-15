<template>
    <CmdWebsite />
</template>

<script>
export default {
    created() {
        const linkTag = document.createElement("link")
        linkTag.setAttribute("rel", "stylesheet")
        linkTag.setAttribute("href", "https://cdn.jsdelivr.net/npm/comand-frontend-framework@4.0.65/dist/templates/dating.min.css")
        document.head.append(linkTag)
    }
}
 </script>
