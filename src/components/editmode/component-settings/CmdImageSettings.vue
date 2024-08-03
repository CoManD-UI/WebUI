<template>
    <CmdBox :use-slots="['body']" :collapsible="true" :cmdHeadline="{headlineText: 'Image', headlineLevel: 4}">
        <template v-slot:body>
            <div class="flex-container vertical component-settings-wrapper">
                <!-- begin CmdTooltip -->
                <CmdTooltip related-id="show-tooltip">
                    <dl>
                        <dt>Dimensions:</dt>
                        <dd>{{ imageWidth }} x {{ imageHeight }}</dd>
                        <dt>File type:</dt>
                        <dd>{{ getFileExtension(this.image?.src?.large) }}</dd>
                        <!--dt>File size:</dt><dd>{{ image?.src?.large }}</dd-->
                        <dt>Path to file:</dt>
                        <dd>{{ image?.src?.large }}</dd>
                    </dl>
                </CmdTooltip>
                <!-- end CmdTooltip -->

                <!-- begin image -->
                <h5>
                    <span class="icon-image"></span>
                    <span>Image</span>
                </h5>
                <a href="#" @click.prevent="selectFiles" class="image-wrapper">
                    <figure v-if="image?.src" class="cmd-image" id="show-tooltip">
                        <div :class="['box drop-area flex-container vertical', { 'allow-drop': allowDrop }]"
                             v-on="dragAndDropHandler">
                            <span class="icon-image"></span>
                            <img v-show="image?.src" :src="imgSrc" :alt="image?.alt" ref="contentImage">
                        </div>
                        <figcaption :title="image?.src.medium">{{ imageFileName }}</figcaption>
                    </figure>
                    <span v-else class="no-image">
                <span class="icon-image"></span>
                <span>(no image uploaded)</span>
            </span>
                </a>
                <button type="button" class="button" @click="removeImage">
                    <span class="icon-trash"></span>
                    <span>Remove image</span>
                </button>
                <!-- end image -->

                <hr/>

                <!-- begin CmdFormElement -->
                <CmdFormElement
                    class="hidden"
                    element="input"
                    type="file"
                    labelText="Select file"
                    :disabled="uploadInitiated"
                    @change="fileSelected"
                    ref="formElement"
                />
                <!-- end CmdFormElement -->

                <!-- begin figcaption -->
                <h5>Figcaption</h5>
                <CmdFormElement
                    element="input"
                    type="checkbox"
                    :toggleSwitch="true"
                    labelText="Show figcaption"
                    v-model="editableShowFigcaption"
                />
                <CmdFormElement
                    v-show="editableShowFigcaption"
                    element="input"
                    type="text"
                    :required="true"
                    labelText="Figcaption Text"
                    placeholder="Figcaption Text"
                    v-model="editableFigcaptionText"
                />
                <div v-show="editableShowFigcaption" class="flex-container">
                    <CmdFormElement
                        element="select"
                        labelText="Position"
                        :selectOptions="positionOptions"
                        v-model="editableFigcaptionPosition"
                    />
                    <CmdFormElement
                        element="select"
                        labelText="Alignment"
                        :selectOptions="textAlignOptions"
                        v-model="editableFigcaptionTextAlign"
                    />
                </div>
                <!-- end figcaption -->

                <hr/>

                <!-- begin miscellaneous -->
                <h5>Miscellaneous</h5>
                <CmdFormElement
                    element="input"
                    type="text"
                    :required="true"
                    labelText="Alternative Text"
                    placeholder="Alternative Text"
                    v-model="editableAlternativeText"
                />
                <CmdFormElement
                    element="input"
                    type="text"
                    :required="false"
                    labelText="Tooltip"
                    placeholder="Tooltip"
                    v-model="editableTooltip"
                />
                <!-- end miscellaneous -->
            </div>
        </template>
    </CmdBox>
</template>

<script>
import {checkAndUploadFile} from "../../../utils/checkAndUploadFile.js"
import {getFileExtension} from "comand-component-library"

export default {
    name: "CmdImageSettings",
    inject: {
        editModeContext: {
            default: false
        }
    },
    inheritAttrs: false,
    data() {
        return {
            allowedFileExtensions: ["jpg", "jpeg", "png"],
            uploadInitiated: false,
            allowDrop: false,
            showFigcaption: null,
            figcaptionText: null,
            figcaptionPosition: null,
            figcaptionTextAlign: null,
            tooltip: null,
            alternativeText: null,
            positionOptions: [
                {
                    text: "Above image",
                    value: "top"
                },
                {
                    text: "Below image",
                    value: "bottom"
                }
            ],
            textAlignOptions: [
                {
                    text: "Left",
                    value: "left"
                },
                {
                    text: "Center",
                    value: "center"
                },
                {
                    text: "Right",
                    value: "right"
                }
            ]
        }
    },
    props: {
        /**
         * figcaption-object including visibility, position (top/bottom), text
         */
        figcaption: {
            type: Object,
            required: false
        },
        /**
         * image-object including source, alternative text, tooltip (not required)
         */
        image: {
            type: Object,
            required: false
        }
    },
    computed: {
        imageWidth() {
            const img = new Image();
            img.src = this.image.src.large

            return img.naturalWidth + " px"

        },
        imageHeight() {
            const img = new Image();
            img.src = this.image.src.large

            return img.naturalHeight + " px"
        },
        dragAndDropHandler() {
            // register handlers only if drag-and-drop is enabled
            return {
                dragenter: this.dragEnter,
                dragover: this.dragOver,
                dragleave: this.dragLeave,
                drop: this.drop
            }
        },
        imageFileName() {
            if (typeof this.image?.src === "string") {
                return this.image?.src.replace("/media/images/slideshow-images/", "")
            }
            return this.image?.src?.medium.replace("/media/images/slideshow-images/medium/", "")
        },
        imgSrc() {
            if (typeof this.image?.src === "string") {
                return this.image?.src
            }
            return this.image?.src?.medium
        },
        editableAlternativeText: {
            get() {
                return this.alternativeText == null ? this.image?.alt : this.alternativeText
            },
            set(value) {
                this.alternativeText = value
            }
        },
        editableTooltip: {
            get() {
                return this.tooltip == null ? this.image?.tooltip : this.tooltip
            },
            set(value) {
                this.tooltip = value
            }
        },
        editableShowFigcaption: {
            get() {
                return this.showFigcaption == null ? this.figcaption?.show : this.showFigcaption
            },
            set(value) {
                this.showFigcaption = value
            }
        },
        editableFigcaptionPosition: {
            get() {
                return this.figcaptionPosition == null ? this.figcaption?.position : this.figcaptionPosition
            },
            set(value) {
                this.figcaptionPosition = value
            }
        },
        editableFigcaptionTextAlign: {
            get() {
                return this.figcaptionTextAlign || this.figcaption?.textAlign
            },
            set(value) {
                this.figcaptionTextAlign = value
            }
        },
        editableFigcaptionText: {
            get() {
                return this.figcaptionText || this.figcaption?.text
            },
            set(value) {
                this.figcaptionText = value
            }
        }
    },
    methods: {
        // use imported function as method (to use in template)
        getFileExtension(filename) {
            return getFileExtension(filename)
        },
        removeImage() {
            if (confirm("Remove this image (a copy of the file will remain on the server)?")) {
                // call getter from composables
                const deleteInnerComponent = this.editModeContext.settings.getDeleteInnerComponent()

                // call returned function from getter
                deleteInnerComponent()
            }
        },
        fileSelected(event) {
            if (event.target.files.length > 0) {
                checkAndUploadFile(event.target.files[0], this.allowedFileExtensions, this.minImageWidth, this.maxFileUploadSize, this.$refs.contentImage)
            }
        },
        selectFiles() {
            let inputFile = this.$refs.formElement.getDomElement().querySelector("input[type='file']")
            inputFile.click()
        },
        updateCallbackProvider() {
            const data = {
                image: {
                    alt: this.editableAlternativeText,
                    tooltip: this.editableTooltip
                },
                figcaption: {
                    text: this.editableFigcaptionText,
                    position: this.editableFigcaptionPosition,
                    textAlign: this.editableFigcaptionTextAlign,
                    show: this.editableShowFigcaption
                }
            }
            return props => {
                if (!props.image) {
                    props.image = {}
                }
                props.image.alt = data.image.alt
                props.image.tooltip = data.image.tooltip
                if (!props.figcaption) {
                    props.figcaption = {}
                }
                props.figcaption.text = data.figcaption.text
                props.figcaption.position = data.figcaption.position
                props.figcaption.textAlign = data.figcaption.textAlign
                props.figcaption.show = data.figcaption.show
            }
        }
    }
}
</script>

<style scoped>
.image-wrapper {
    display: flex;
    background: var(--color-scheme-background);
    align-self: center;

    .cmd-image {
        span[class*="icon-"] {
            font-size: 4rem;
        }

        img {
            border: var(--default-border);;
        }

        .no-image {
            display: flex;
            flex-direction: column;
            gap: .5rem;
            align-items: center;
            padding: var(--default-padding);

            [class*="icon"] {
                font-size: 7rem;
            }
        }

        &:hover, &:active, &:focus {
            cursor: pointer;

            img {
                border-color: var(--hyperlink-color-highlighted);
            }
        }
    }
}
</style>
<script setup>
</script>