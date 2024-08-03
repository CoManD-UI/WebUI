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
    <CmdBox :use-slots="['body']" :collapsible="true" :cmdHeadline="{headlineText: 'Opening Hours', headlineLevel: 4}">
        <template v-slot:body>
            <div class="flex-container vertical component-settings-wrapper">
                <button type="button" class="button" @click="removeItems">
                    <span class="icon-trash"></span>
                    <span>{{ removeButtonLabel }}</span>
                </button>
                <CmdFormElement
                    element="input"
                    type="text"
                    labelText="Abbreviation text for 'hours'"
                    v-model="abbreviationTextModel"
                />
                <CmdFormElement
                    element="select"
                    :select-options="separators"
                    labelText="Select separator (for time span)"
                    v-model="separatorModel"
                />
            </div>
        </template>
    </CmdBox>
</template>

<script>
export default {
    name: "CmdOpeningHoursSettings",
    inject: {
        editModeContext: {
            default: false
        }
    },
    inheritAttrs: false,
    data() {
        return {
            separators: [
                {
                    text: "– (n-dash)",
                    value: "–"
                },
                {
                    text: "- (minus)",
                    value: "-"
                },
                {
                    text: "till",
                    value: "till"
                }
            ],
            editableAbbreviationText: null,
            editableSeparator: null
        }
    },
    props: {
        headlineText: {
            type: String,
            default: ""
        },
        headlineLevel: {
            type: [String, Number],
            default: "2"
        },
        /**
         * activate if only icons (without any text) should be displayed
         */
        showAbbreviationText: {
            type: Boolean,
            default: false
        },
        /**
         * show an icon (if exists) in front of label-text
         */
        abbreviationText: {
            type: String,
            default: "h"
        },
        /**
         * show a label-text for each entry
         */
        separator: {
            type: String,
            default: "–"
        },
        /**
         * list of opening-hours
         */
        openingHours: {
            type: Array,
            required: true
        },
        /**
         * settings for CmdHeadline-component
         */
        cmdHeadline: {
            type: Object,
            default() {
                return {
                    headlineLevel: "2"
                }
            }
        }
    },
    computed: {
        removeButtonLabel() {
            return "Remove " + this.openingHours.length + " all entries"
        },
        abbreviationTextModel: {
            get() {
                return this.editableAbbreviationText == null ? this.abbreviationText : this.editableAbbreviationText
            },
            set(value) {
                this.editableAbbreviationText = value
            }
        },
        separatorModel: {
            get() {
                return this.editableSeparator == null ? this.separator : this.editableSeparator
            },
            set(value) {
                this.editableSeparator = value
            }
        }
    },
    methods: {
        removeItems() {
            if (confirm("All entries will be removed (the component itself remains). Continue anyways?")) {
                const saveHandler = this.editModeContext.settings.getSettingsSaveHandler()
                saveHandler(props => props.openingHours = [])
            }
        },
        updateCallbackProvider() {
            const headlineUpdateCallback = this.$refs.headlineSettings.updateCallbackProvider()
            const abbreviationText = this.abbreviationTextModel
            const separator = this.separatorModel
            return props => {
                if (!props.cmdHeadline) {
                    props.cmdHeadline = {}
                }
                headlineUpdateCallback(props.cmdHeadline)

                props.abbreviationText = abbreviationText
                props.separator = separator
            }
        }
    }
}
</script>