<template>
    <CmdFormElement
            element="input"
            type="checkbox"
            :toggle-switch="true"
            labelText="Checkbox styled as button"
            v-model="styledAsButtonModel"
    />
    <CmdFormElement
            v-if="!styledAsButtonModel"
            element="input"
            type="checkbox"
            :toggle-switch="true"
            labelText="Use styled layout"
            v-model="useStyledLayoutModel"
    />
    <CmdFormElement
            element="input"
            type="checkbox"
            :toggle-switch="true"
            labelText="Show Label text"
            v-model="showLabelModel"
    />
</template>

<script>
export default {
    name: "CmdToggleDarkModeSettings",
    inheritAttrs: false,
    data() {
        return {
            editableStyledAsButton: null,
            editableUseStyledLayoutModel: null,
            editableShowLabel: null
        }
    },
    props: {
        styledAsButton: {
            type: Boolean
        },
        useStyledLayout: {
            type: Boolean
        },
        showLabel: {
            type: Boolean
        }
    },
    computed: {
        styledAsButtonModel: {
            get() {
                return this.editableStyledAsButton == null ? this.styledAsButton : this.editableStyledAsButton
            },
            set(value) {
                this.editableStyledAsButton = value
            }
        },
        useStyledLayoutModel: {
            get() {
                return this.editableUseStyledLayout == null ? this.useStyledLayout : this.editableUseStyledLayout
            },
            set(value) {
                this.editableUseStyledLayout = value
            }
        },
        showLabelModel: {
            get() {
                return this.editableshowLabel == null ? this.showLabel : this.editableshowLabel
            },
            set(value) {
                this.editableshowLabel = value
            }
        }
    },
    methods: {
        updateCallbackProvider() {
            const styledAsButton = this.styledAsButtonModel
            const useStyledLayout = this.useStyledLayoutModel
            const showLabel = this.showLabelModel
            return props => {
                props.styledAsButton = styledAsButton
                props.useStyledLayout = useStyledLayout
                props.showLabel = showLabel
            }
        }
    }
}
</script>

<style scoped>

</style>
