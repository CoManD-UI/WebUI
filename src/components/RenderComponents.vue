<template>
    <component
        v-for="(component, componentIndex) in components || []"
        :key="componentIndex"
        :is="component.name"
        :id="component.id"
        v-bind="component.props"
        :i18n="currentLanguageData"
    >
        <template v-slot:[slotName] v-for="(childComponents, slotName) in groupComponentBySlotName(component.components)">
            <RenderComponents :components="childComponents" />
        </template>
    </component>
</template>

<script>
import {mapState} from "pinia";
import {useWebUIStore} from "../stores/web-ui"

export default {
    name: "RenderComponents",
    props: {
        components: {
            type: Array,
            required: false
        }
    },
    computed: {
        ...mapState(useWebUIStore, ["currentLanguageData", "numberOfPages"])
    },
    methods: {
        getSlotName(component) {
            return component.slotName || 'default'
        },
        groupComponentBySlotName(components) {
            const slots = {}

            if(!components) {
                return slots
            }

            for(let i = 0; i < components.length; i++) {
                const slotName = this.getSlotName(components[i])

                // check if slotname already exists
                if(!slots[slotName]) {
                    slots[slotName] = []
                }
                // push component to slotname to group all components with same slotname
                slots[slotName].push(components[i])
            }

            return slots
        }
    }
}
</script>

<style>

</style>