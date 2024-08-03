<template>
    <!-- begin settings for CmdHeadline -->
    <CmdHeadlineSettings
        ref="headlineSettings"
        v-bind="cmdHeadline || {}"
    />
    <!-- end settings for CmdHeadline -->

    <!-- begin settings for CmdImage -->
    <CmdImageSettings
        ref="imageSettings"
        v-bind="cmdImage || {}"
    />
    <!-- end settings for CmdImage -->

    <!-- begin settings for paragraph -->
    <CmdBox :use-slots="['body']" :collapsible="true" :cmdHeadline="{headlineText: 'Paragraph', headlineLevel: 4}">
        <template v-slot:body>
            <div class="flex-container vertical component-settings-wrapper">
                <CmdFormElement
                    element="select"
                    labelText="Paragraph Text-Alignment"
                    :selectOptions="paragraphAlignmentOptions"
                    v-model="paragraphTextAlignModel"
                />
            </div>
        </template>
    </CmdBox>
    <!-- end settings for paragraph -->
</template>

<script>
export default {
    name: "CmdTextImageBlockSettings",
    inheritAttrs: false,
    data() {
        return {
            paragraphAlignmentOptions: [
                {
                    text: "left",
                    value: "left"
                },
                {
                    text: "center",
                    value: "center"
                },
                {
                    text: "right",
                    value: "right"
                }
            ],
            editableParagraphTextAlign: null
        }
    },
    props: {
        cmdHeadline: {
            type: Object,
            required: false
        },
        cmdImage: {
            type: Object,
            required: false
        },
        paragraphTextAlign: {
            type: String,
            default: "left"
        }
    },
    computed: {
        paragraphTextAlignModel: {
            get() {
                return this.editableParagraphTextAlign == null ? this.paragraphTextAlign : this.editableParagraphTextAlign
            },
            set(value) {
                this.editableParagraphTextAlign = value
            }
        }
    },
    methods: {
        updateCallbackProvider() {
            const headlineUpdateCallback = this.$refs.headlineSettings.updateCallbackProvider()
            const imageUpdateCallback = this.$refs.imageSettings.updateCallbackProvider()
            const paragraphTextAlign = this.paragraphTextAlignModel
            return props => {
                if (!props.cmdHeadline) {
                    props.cmdHeadline = {}
                }
                headlineUpdateCallback(props.cmdHeadline)
                if (!props.cmdImage) {
                    props.cmdImage = {}
                }
                imageUpdateCallback(props.cmdImage)
                props.paragraphTextAlign = paragraphTextAlign
            }
        }
    }
}
</script>

<style scoped>

</style>
<script setup>
</script>