<template>
    <div class="placeholder-component-wrapper">
        <component :is="tagName">
            {{ text }}
        </component>
    </div>
</template>

<script>
export default {
    name: "PlaceholderComponentWrapper",
    props: {
        tagName: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        }
    }
}
</script>

<style lang="scss">
.placeholder-component-wrapper {
    border: 1px dashed red;

    > * {
        color: red;
        margin: 0;
    }
}
</style>