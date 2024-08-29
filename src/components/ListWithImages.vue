<template>
    <ul class="list-with-images">
        <li v-for="(item, index) in items" :key="index">
            <!-- begin item with link -->
            <CmdLink v-if="item.cmdLink">
                <img :src="item.image?.src" :alt="item.image?.alt" :title="item.image?.tooltip" />
                <span v-if="item.text" v-html="item.text"></span>
            </CmdLink>
            <!-- end item with link -->

            <!-- begin item without link -->
            <template v-else>
                <img :src="item.image?.src" :alt="item.image?.alt" :title="item.image?.tooltip" />
                <span v-if="item.text" v-html="item.text"></span>
            </template>
            <!-- end item without link -->
        </li>
    </ul>
</template>

<script>
export default {
    name: "ListWithImages",
    props: {
        items: {
            type: Array,
            required: true
        }
    }
}
</script>

<style>
.list-with-images {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 0;

    li {
        --local-transition: all linear .3s;
        list-style-type: none;
        display: flex;
        gap: var(--default-gap);
        margin: inherit;
        align-items: center;
        transition: var(--local-transition);

        .cmd-link {
            width: 100%;
            display: flex;
            gap: var(--default-gap);
            align-items: center;
            text-decoration: none;
            padding: 0 var(--default-padding);
            justify-content: flex-start;
            transition: var(--local-transition);

            img {
                max-width: 7rem;
                margin: 0;
            }
        }

        &:hover, &:active, &:focus {
            background: hsla(var(--primary-color-hue), var(--primary-color-saturation), var(--primary-color-lightness), .2);
            transition: all linear 2s;
        }
    }
}
</style>