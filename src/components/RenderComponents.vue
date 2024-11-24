<template>
    <component
        v-for="(component, componentIndex) in components || []"
        :key="componentIndex"
        :is="component.name"
        v-bind="propsToBind(component)"
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
        propsToBind(component) {
            const componentProps = {...component.props}
            if(component.id) {
                componentProps.id = component.id
            }

            // check for special value in i18n-property to use local translations from languages.json
            if(componentProps.i18n === "$active") {
                componentProps.i18n = this.currentLanguageData
            }

            return componentProps
        },
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