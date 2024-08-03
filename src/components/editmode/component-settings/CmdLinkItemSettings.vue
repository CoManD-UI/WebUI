<template>
    <div class="flex-container vertical component-settings-wrapper">
        <CmdFormElement
            element="input"
            type="text"
            labelText="Link text"
            placeholder="Link text"
            v-model="textModel"
        />
        <CmdFormElement
            element="input"
            type="url"
            labelText="URL"
            placeholder="URL"
            :required="true"
            v-model="pathModel"
        />
        <CmdFormElement
            element="select"
            labelText="Open content in"
            :selectOptions="targetOptions"
            v-model="targetModel"
        />
    </div>
</template>

<script>
export default {
    name: "CmdLinkItemSettings",
    inheritAttrs: false,
    data() {
        return {
            editableText: null,
            editablePath: null,
            targetOptions: [
                {
                    text: "Please select",
                    value: ""
                },
                {
                    text: "new tab",
                    value: "_blank"
                },
                {
                    text: "popup/fancybox",
                    value: "fancybox"
                }
            ],
            editableTarget: null
        }
    },
    props: {
        text: {
            type: String,
            default: ""
        },
        path: {
            type: String,
            default: ""
        },
        target: {
            type: String
        },
        fancybox: {
            type: Boolean
        }
    },
    computed: {
        textModel: {
            get() {
                return this.editableText == null ? this.text : this.editableText
            },
            set(value) {
                this.editableText = value
            }
        },
        pathModel: {
            get() {
                return this.editablePath == null ? this.path : this.editablePath
            },
            set(value) {
                this.editablePath = value
            }
        },
        targetModel: {
            get() {
                if (this.editableTarget == null) {
                    if (this.fancybox) {
                        return "fancybox"
                    }
                    return this.target || ""
                }

                return this.editableTarget
            },
            set(value) {
                this.editableTarget = value
            }
        }
    },
    methods: {
        updateCallbackProvider() {
            const text = this.textModel
            const path = this.pathModel
            const target = this.targetModel
            return props => {
                props.text = text
                props.path = path

                if (target === "fancybox") {
                    props.fancybox = true
                    props.target = ""
                } else {
                    props.fancybox = false
                    props.target = target
                }
            }
        }
    }
}
</script>

<style scoped>

</style>
