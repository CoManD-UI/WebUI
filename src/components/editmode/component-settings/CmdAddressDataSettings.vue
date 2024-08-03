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
    <CmdBox :use-slots="['body']" :collapsible="true" :cmdHeadline="{headlineText: 'Address data', headlineLevel: 4}">
        <template v-slot:body>
            <div class="flex-container vertical component-settings-wrapper">
                <button type="button" class="button" @click="removeItems">
                    <span class="icon-trash"></span>
                    <span>{{ removeButtonLabel }}</span>
                </button>

                <CmdFormElement
                    element="input"
                    type="checkbox"
                    :toggleSwitch="true"
                    labelText="Show labels (att all)"
                    v-model="showLabelsModel"
                />

                <CmdFormElement
                    element="input"
                    type="checkbox"
                    :toggleSwitch="true"
                    :disabled="!showLabelsModel"
                    labelText="Show icons in front of labels"
                    v-model="showLabelIconsModel"
                />

                <CmdFormElement
                    element="input"
                    type="checkbox"
                    :toggleSwitch="true"
                    :disabled="!showLabelsModel || !showLabelIconsModel"
                    labelText="Show icons only (no text)"
                    v-model="showIconsOnlyModel"
                />

                <CmdFormElement
                    element="input"
                    type="checkbox"
                    :toggleSwitch="true"
                    :disabled="!showLabelsModel || !showIconsOnlyModel"
                    labelText="Show label-texts"
                    v-model="showLabelTextsModel"
                />

                <CmdFormElement
                    element="input"
                    type="checkbox"
                    :toggleSwitch="true"
                    labelText="Link address with Google Maps&trade;"
                    v-model="linkGoogleMapsModel"
                />
            </div>
        </template>
    </CmdBox>
</template>

<script>
export default {
    name: "CmdAddressDataSettings",
    inject: {
        editModeContext: {
            default: false
        }
    },
    inheritAttrs: false,
    data() {
        return {
            editableShowLabels: null,
            editableShowIconsOnly: null,
            editableShowLabelIcons: null,
            editableShowLabelTexts: null,
            editableLinkGoogleMaps: null,
        }
    },
    props: {
        /**
         * activate if only icons (without any text) should be displayed
         */
        showIconsOnly: {
            type: Boolean,
            default: false
        },
        /**
         * show an icon (if exists) in front of label-text
         */
        showLabelIcons: {
            type: Boolean,
            default: true
        },
        /**
         * show a label-text for each entry
         */
        showLabelTexts: {
            type: Boolean,
            default: true
        },
        /**
         * option to toggle labels (i.e. telephone, email etc.) in front/left of data
         */
        showLabels: {
            type: Boolean,
            default: true
        },
        /**
         * all address-data (incl. labels) that will be shown
         */
        addressData: {
            type: Array,
            required: true
        },
        /**
         * link physical address (street, no, zip and city) with Google Maps
         */
        linkGoogleMaps: {
            type: Boolean,
            default: false
        },
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
            return "Remove " + this.addressData.length + " all entries"
        },
        showLabelsModel: {
            get() {
                return this.editableShowLabels == null ? this.showLabels : this.editableShowLabels
            },
            set(value) {
                this.editableShowLabels = value
            }
        },
        showIconsOnlyModel: {
            get() {
                return this.editableShowIconsOnly == null ? this.showIconsOnly : this.editableShowIconsOnly
            },
            set(value) {
                this.editableShowIconsOnly = value
            }
        },
        showLabelIconsModel: {
            get() {
                return this.editableShowLabelIcons == null ? this.showLabelIcons : this.editableShowLabelIcons
            },
            set(value) {
                this.editableShowLabelIcons = value
            }
        },
        showLabelTextsModel: {
            get() {
                return this.editableShowLabelTexts == null ? this.showLabelTexts : this.editableShowLabelTexts
            },
            set(value) {
                this.editableShowLabelTexts = value
            }
        },
        linkGoogleMapsModel: {
            get() {
                return this.editableLinkGoogleMaps == null ? this.linkGoogleMaps : this.editableLinkGoogleMaps
            },
            set(value) {
                this.editableLinkGoogleMaps = value
            }
        }
    },
    methods: {
        removeItems() {
            if (confirm("All entries will be removed (the component itself remains). Continue anyways?")) {
                const saveHandler = this.editModeContext.settings.getSettingsSaveHandler()
                saveHandler(props => props.addressData = [])
            }
        },
        updateCallbackProvider() {
            const headlineUpdateCallback = this.$refs.headlineSettings.updateCallbackProvider()
            const showIconsOnly = this.showIconsOnlyModel
            const showLabelIcons = this.showLabelIconsModel
            const showLabelTexts = this.showLabelTextsModel
            const showLabels = this.showLabelsModel
            const linkGoogleMaps = this.linkGoogleMapsModel

            return props => {
                if (!props.cmdHeadline) {
                    props.cmdHeadline = {}
                }
                headlineUpdateCallback(props.cmdHeadline)

                props.showIconsOnly = showIconsOnly
                props.showLabelIcons = showLabelIcons
                props.showLabelTexts = showLabelTexts
                props.showLabels = showLabels
                props.linkGoogleMaps = linkGoogleMaps
            }
        }
    }
}
</script>