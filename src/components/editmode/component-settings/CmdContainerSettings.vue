<template>
    <div class="flex-container vertical component-settings-wrapper">
        <CmdFormElement
            element="input"
            type="checkbox"
            :colored="true"
            :toggleSwitch="true"
            labelText="Show pre-headline above headline"
            v-model="usePreHeadlineModel"
        />
        <CmdFormElement
            v-if="preHeadlineText || usePreHeadlineModel"
            element="input"
            type="text"
            labelText="Pre-Headline Text"
            placeholder="Pre-Headline Text"
            v-model="preHeadlineTextModel"
        />
        <CmdFormElement
            element="input"
            type="text"
            :required="true"
            labelText="Headline Text"
            placeholder="Headline Text"
            v-model="headlineTextModel"
        />
        <div class="flex-container">
            <CmdFormElement
                element="select"
                :required="true"
                labelText="Level"
                :selectOptions="headlineLevelOptions"
                v-model="headlineLevelModel"
            />
            <CmdFormElement
                element="select"
                labelText="Alignment"
                :selectOptions="textAlignOptions"
                v-model="textAlignModel"
            />
        </div>
    </div>
</template>

<script>
export default {
    name: "CmdContainerSettings",
    inheritAttrs: false,
    data() {
        return {
            editableUsePreHeadline: null,
            editablePreHeadlineText: null,
            editableHeadlineText: null,
            editableHeadlineLevel: null,
            headlineLevelOptions: [
                {
                    text: "1",
                    value: "1"
                },
                {
                    text: "2",
                    value: "2"
                },
                {
                    text: "3",
                    value: "3"
                },
                {
                    text: "4",
                    value: "4"
                },
                {
                    text: "5",
                    value: "5"
                },
                {
                    text: "6",
                    value: "6"
                }
            ],
            editableTextAlign: null,
            textAlignOptions: [
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
            ]
        }
    },
    props: {
        preHeadline: {
            type: Boolean
        },
        preHeadlineText: {
            type: String,
            default: ""
        },
        headlineText: {
            type: String,
            default: ""
        },
        headlineLevel: {
            type: [String, Number]
        },
        textAlign: {
            type: String,
            default: "left"
        }
    },
    computed: {
        usePreHeadlineModel: {
            get() {
                return this.editableUsePreHeadline == null ? this.preHeadline : this.editableUsePreHeadline
            },
            set(value) {
                this.editableUsePreHeadline = value
            }
        },
        preHeadlineTextModel: {
            get() {
                return this.editablePreHeadlineText == null ? this.preHeadlineText : this.editablePreHeadlineText
            },
            set(value) {
                this.editablePreHeadlineText = value
            }
        },
        headlineTextModel: {
            get() {
                return this.editableHeadlineText == null ? this.headlineText : this.editableHeadlineText
            },
            set(value) {
                this.editableHeadlineText = value
            }
        },
        headlineLevelModel: {
            get() {
                return (this.editableHeadlineLevel == null ? this.headlineLevel : this.editableHeadlineLevel) || "1"
            },
            set(value) {
                this.editableHeadlineLevel = value
            }
        },
        textAlignModel: {
            get() {
                return this.editableTextAlign == null ? this.textAlign : this.editableTextAlign
            },
            set(value) {
                this.editableTextAlign = value
            }
        }
    },
    methods: {
        updateCallbackProvider() {
            const preHeadlineText = this.preHeadlineTextModel
            const headlineText = this.headlineTextModel
            const headlineLevel = this.headlineLevelModel
            const textAlign = this.textAlignModel

            return props => {
                props.preHeadlineText = preHeadlineText
                props.headlineText = headlineText
                props.headlineLevel = headlineLevel
                props.textAlign = textAlign
            }
        }
    }
}
</script>

<style lang="scss">

</style>
