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
        list-style-type: none;
        display: flex;
        gap: var(--default-gap);
        margin: inherit;
        align-items: center;

        img {
            max-width: 7rem;
        }
    }
}
</style>