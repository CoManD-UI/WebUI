<template>
    <CmdBox :use-slots="['body']" :collapsible="true" :cmdHeadline="{headlineText: 'Headline', headlineLevel: 4}">
        <template v-slot:body>
            <!-- begin cmdHeadline -->
            <CmdHeadlineSettings
                    ref="headlineSettings"
                    v-bind="cmdHeadline || {}"
            />
            <!-- end cmdHeadline -->
        </template>
    </CmdBox>

    <CmdBox :use-slots="['body']"
            :collapsible="true"
            :cmdHeadline="{headlineText: 'Thumbnail-Scroller', headlineLevel: 4}">
        <template v-slot:body>
            <div class="flex-container vertical component-settings-wrapper">
                <button type="button" class="button" @click="removeItems">
                    <span class="icon-trash"></span>
                    <span>{{removeButtonLabel}}</span>
                </button>
                <CmdFormElement
                        element="select"
                        labelText="Orientation"
                        :selectOptions="orientationOptions"
                        v-model="orientationModel"
                />
                <CmdFormElement
                        element="input"
                        type="checkbox"
                        :toggleSwitch="true"
                        labelText="Stretch to full width"
                        v-model="fullWidthModel"
                />
                <CmdFormElement
                        element="input"
                        type="checkbox"
                        :toggleSwitch="true"
                        labelText="Allow open images Fancybox"
                        v-model="allowOpenFancyBoxModel"
                />
            </div>
        </template>
    </CmdBox>
</template>

<script>
export default {
    name: "CmdImageGallerySettings",
    inject: {
        editModeContext: {
            default: false
        }
    },
    inheritAttrs: false,
    data() {
        return {
            orientationOptions: [
                {
                    text: "horizontal",
                    value: "horizontal"
                },
                {
                    text: "vertical",
                    value: "vertical"
                }
            ],
            editableOrientation: null,
            editableFullWidth: null,
            editableAllowOpenFancyBox: null
        }
    },
    props: {
        orientation: {
            type: String,
            default: "horizontal"
        },
        fullWidth: {
            type: Boolean,
            default: true
        },
        allowOpenFancyBox: {
            type: Boolean,
            default: true
        },
        cmdHeadline: {
            type: Object,
            default() {
                return {
                    headlineLevel: "2"
                }
            }
        },
        /**
         * list of thumbnail-scroller-items
         */
        thumbnailScrollerItems: {
            type: Array,
            required: true
        },
    },
    computed: {
        removeButtonLabel() {
            return "Remove " + this.thumbnailScrollerItems.length + " all images"
        },
        orientationModel: {
            get() {
                return this.editableOrientation == null ? this.orientation : this.editableOrientation
            },
            set(value) {
                this.editableOrientation = value
            }
        },
        fullWidthModel: {
            get() {
                return this.editableFullWidth == null ? this.fullWidth : this.editableFullWidth
            },
            set(value) {
                this.editableFullWidth = value
            }
        },
        allowOpenFancyBoxModel: {
            get() {
                return this.editableAllowOpenFancyBox == null ? this.allowOpenFancyBox : this.editableAllowOpenFancyBox
            },
            set(value) {
                this.editableAllowOpenFancyBox = value
            }
        }
    },
    methods: {
        removeItems() {
            if (confirm("All images/items will be removed (the component itself remains). Continue anyways?")) {
                const saveHandler = this.editModeContext.settings.getSettingsSaveHandler()
                saveHandler(props => props.thumbnailScrollerItems = [])
            }
        },
        updateCallbackProvider() {
            const headlineUpdateCallback = this.$refs.headlineSettings.updateCallbackProvider()
            const data = {
                orientation: this.orientationModel,
                fullWidth: this.fullWidthModel,
                allowOpenFancyBox: this.allowOpenFancyBoxModel
            }
            return props => {
                if (!props.cmdHeadline) {
                    props.cmdHeadline = {}
                }
                headlineUpdateCallback(props.cmdHeadline)

                props.orientation = data.orientation
                props.fullWidth = data.fullWidth
                props.allowOpenFancyBox = data.allowOpenFancyBox
            }
        }
    }
}
</script>

<style scoped>

</style>
<script setup>
</script>