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

    <CmdBox :use-slots="['body']" :collapsible="true" :cmdHeadline="{headlineText: 'Slideshow', headlineLevel: 4}">
        <template v-slot:body>
            <div class="flex-container vertical component-settings-wrapper">
        <button type="button" class="button" @click="removeItems">
            <span class="icon-trash"></span>
            <span>{{removeButtonLabel}}</span>
        </button>

        <h5>Autoplay options</h5>
        <CmdFormElement
            element="input"
            type="checkbox"
            :toggleSwitch="true"
            labelText="Autoplay"
            v-model="autoplayModel"
        />
        <CmdFormElement
            v-show="autoplayModel"
            element="input"
            type="number"
            max="100000"
            labelText="Autoplay intervall"
            placeholder="Enter milliseconds"
            v-model="autoplayIntervalModel"
        />

        <hr />

        <h5>Display options</h5>
        <CmdFormElement
            element="input"
            type="checkbox"
            :toggleSwitch="true"
            labelText="Show slide-buttons"
            v-model="showSlideButtonsModel"
        />
        <CmdFormElement
            element="input"
            type="checkbox"
            :toggleSwitch="true"
            labelText="Show quick link icons"
            v-model="showQuickLinkIconsModel"
        />
        <CmdFormElement
            element="input"
            type="checkbox"
            :toggleSwitch="true"
            labelText="Show counter"
            v-model="showCounterModel"
        />
    </div>
        </template>
    </CmdBox>
</template>

<script>
export default {
    name: "CmdSlideshowSettings",
    inject: {
        editModeContext: {
            default: false
        }
    },
    inheritAttrs: false,
    data() {
        return {
            editableAutoplay: null,
            editableAutoplayInterval: null,
            editableShowSlideButtons: null,
            editableShowQuickLinkIcons: null,
            editableShowCounter: null
        }
    },
    props: {
        /**
         * list of images to display (use slot must be set to false)
         */
        slideshowItems: {
            type: Array,
            required: true
        },
        /**
         * toggle slide-buttons-visibility
         */
        showSlideButtons: {
            type: Boolean,
            default: false
        },
        /**
         * activate if images should switch automatically
         */
        autoplay: {
            type: Boolean,
            default: false
        },
        /**
         * set milliseconds to switch images (if autoplay is activated only)
         */
        autoplayInterval: {
            type: Number,
            default: 5000
        },
        /**
         * shows buttons/icons to let user quick jump to each image
         */
        showQuickLinkIcons: {
            type: Boolean,
            default: true
        },
        /**
         * activate if current number of each image should be displayed
         */
        showCounter: {
            type: Boolean,
            default: false
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
          return "Remove all " + this.slideshowItems.length + " images/items"
        },
        autoplayModel: {
            get() {
                return this.editableAutoplay == null ? this.autoplay : this.editableAutoplay
            },
            set(value) {
                this.editableAutoplay = value
            }
        },
        autoplayIntervalModel: {
            get() {
                return this.editableAutoplayInterval == null ? this.autoplayInterval : this.editableAutoplayInterval
            },
            set(value) {
                this.editableAutoplayInterval = value
            }
        },
        showSlideButtonsModel: {
            get() {
                return this.editableShowSlideButtons == null ? this.showSlideButtons : this.editableShowSlideButtons
            },
            set(value) {
                this.editableShowSlideButtons = value
            }
        },
        showQuickLinkIconsModel: {
            get() {
                return this.editableShowQuickLinkIcons == null ? this.showQuickLinkIcons : this.editableShowQuickLinkIcons
            },
            set(value) {
                this.editableShowQuickLinkIcons = value
            }
        },
        showCounterModel: {
            get() {
                return this.editableShowCounter == null ? this.showCounter : this.editableShowCounter
            },
            set(value) {
                this.editableShowCounter = value
            }
        }
    },
    methods: {
        removeItems() {
            if (confirm("All images/items will be removed (the component itself remains). Continue anyways?")) {
                const saveHandler = this.editModeContext.settings.getSettingsSaveHandler()
                saveHandler(props => props.slideshowItems = [])
            }
        },
        updateCallbackProvider() {
            const autoplay = this.autoplayModel
            const autoplayInterval = this.autoplayIntervalModel
            const showQuickLinkIcons = this.showQuickLinkIconsModel
            const showCounter = this.showCounterModel

            // assign values from v-models to props of component
            return props => {
                props.autoplay = autoplay
                props.autoplayInterval = autoplayInterval
                props.showQuickLinkIcons = showQuickLinkIcons
                props.showCounter = showCounter
            }
        }
    }
}
</script>

<style lang="scss">

</style>
