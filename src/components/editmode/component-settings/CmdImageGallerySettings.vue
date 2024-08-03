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
            :cmdHeadline="{headlineText: 'Image Gallery', headlineLevel: 4}">
        <template v-slot:body>
            <div class="flex-container vertical component-settings-wrapper">
                <button type="button" class="button" @click="removeItems">
                    <span class="icon-trash"></span>
                    <span>{{removeButtonLabel}}</span>
                </button>
                <CmdFormElement
                    element="input"
                    type="checkbox"
                    :toggleSwitch="true"
                    labelText="Use Fancybox for large images"
                    v-model="useFancyboxForLargeImagesModel"
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
            editableUseFancyboxForLargeImages: null
        }
    },
    props: {
        /**
         * list of images to display
         */
        images: {
            type: Array,
            default: []
        },
        cmdHeadline: {
            type: Object,
            default() {
                return {
                    headlineLevel: "2"
                }
            }
        },
        useFancyboxForLargeImages: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        removeButtonLabel() {
            return "Remove " + this.images.length + " all images"
        },
        useFancyboxForLargeImagesModel: {
            get() {
                return this.editableUseFancyboxForLargeImages == null ? this.useFancyboxForLargeImages : this.editableUseFancyboxForLargeImages
            },
            set(value) {
                this.editableUseFancyboxForLargeImages = value
            }
        }
    },
    methods: {
        removeItems() {
            if (confirm("All images will be removed (the component itself remains). Continue anyways?")) {
                const saveHandler = this.editModeContext.settings.getSettingsSaveHandler()
                saveHandler(props => props.images = [])
            }
        },
        updateCallbackProvider() {
            const headlineUpdateCallback = this.$refs.headlineSettings.updateCallbackProvider()
            const useFancyboxForLargeImages = this.useFancyboxForLargeImagesModel
            return props => {
                if (!props.cmdHeadline) {
                    props.cmdHeadline = {}
                }
                headlineUpdateCallback(props.cmdHeadline)
                props.useFancyboxForLargeImages = useFancyboxForLargeImages
            }
        }
    }
}
</script>

<style scoped>

</style>
