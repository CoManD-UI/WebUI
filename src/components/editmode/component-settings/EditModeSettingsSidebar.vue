<template>
    <CmdSidebar
        v-if="showSettingsSidebar"
        :openSidebar="openSidebarStatus"
        @toggleSidebar="setOpenStatus($event)"
        id="edit-mode-settings-sidebar"
        :collapseToLeft="false"
        :cmdHeadline="{headlineText: 'Component Settings', headlineLevel: 3, textAlign: 'center'}"
    >
        <template v-slot:open>
            <template v-if="editModeContext.settings.getAction() === 'edit'">
                <CmdSystemMessage v-if="showSystemMessage" validation-status="success" system-message="You changes have been saved successfully!" />
                <CmdBoxWrapper
                    :boxesPerRow="[1]"
                    :allowMultipleExpandedBoxes="false"
                    :allowUserToToggleOrientation="false"
                    :useRowViewAsDefault="true"
                    :openBoxesByDefault="openBoxes"
                    :useGap="false"
                >
                <template v-if="isComponent || !isSection">
                    <!-- begin component selection -->
                    <CmdBox v-if="isComponent && !isSection"
                            :use-slots="['body']"
                            :collapsible="true"
                            :cmdHeadline="{headlineText: 'Component Selection', headlineLevel: 4, headlineIcon: {iconClass: 'icon-cogs'}}"
                    >
                        <!-- begin selection of allowed components to switch component type -->
                        <template v-slot:body>
                            <!-- begin components-view-selection -->
                            <ul class="components-view-selection no-list-items">
                                <li>
                                    <a href="#"
                                       @click.prevent="showComponentsAsIcons = !showComponentsAsIcons"
                                       :title="showComponentsAsIcons ? 'Switch to dropdown-view for components' : 'Switch to icon-view for components'"
                                    >
                                        <CmdIcon :iconClass="showComponentsAsIcons ? 'icon-list' : 'icon-blocks-small'"/>
                                    </a>
                                </li>
                            </ul>
                            <!-- end components-view-selection -->

                            <!-- begin select components from icons -->
                            <ul v-if="showComponentsAsIcons" class="components-icon-view">
                                <li v-for="(component, index) in listOfValidComponents" :key="index">
                                    <a href="#"
                                       @click.prevent="switchComponent"
                                       :class="{'active': currentComponentName === component.value}"
                                       title="Select this component"
                                    >
                                    <span class="icon-hexagon">
                                        <CmdIcon :iconClass="component.iconClass"/>
                                    </span>
                                        <span>{{ component.text }}</span>
                                    </a>
                                </li>
                            </ul>
                            <!-- end select components from icons -->

                            <!-- begin select components from dropdown -->
                            <CmdFakeSelect
                                v-else
                                labelText="Current component"
                                :required="true"
                                :selectData="listOfValidComponents"
                                defaultOptionName="Select a component:"
                                v-model="currentComponentName"
                                @update:modelValue="switchComponent"
                            />
                            <!-- end select components from dropdown -->
                        </template>
                        <!-- end selection of allowed components to switch component type -->
                    </CmdBox>
                    <!-- end component selection -->
                </template>

                <!-- begin list of components -->
                <template v-if="componentProps">
                    <!--
                    <CmdBox
                        v-if="!isComponent && !isSection"
                        :use-slots="['body']"
                        :collapsible="true"
                        :cmdHeadline="{headlineText: 'Item Settings', headlineLevel: 4, headlineIcon: {iconClass: 'icon-cog'}}"
                    >
                        <template v-slot:body>
                            <component ref="settings" :is="settingsComponentName" v-bind="componentProps"/>
                        </template>
                    </CmdBox>
                    -->
                    <component ref="settings" :is="settingsComponentName" v-bind="componentProps"/>
                </template>
                <!-- end list of components -->
                </CmdBoxWrapper>

                <!-- begin button-wrapper -->
                <div class="button-wrapper action-buttons-wrapper">
                    <button class="button confirm" @click="saveSettings" aria-label="Save settings">
                        <span class="icon-check-circle"></span>
                        <span>Save</span>
                    </button>
                    <button class="button cancel" @click="cancelSettings" aria-label="Cancel settings">
                        <span class="icon-cancel-circle"></span>
                        <span>Cancel</span>
                    </button>
                </div>
                <!-- end button-wrapper -->
                <!-- end edit -->
            </template>

            <!-- begin add -->
            <template v-if="editModeContext.settings.getAction() === 'add'">
                <div class="flex-container vertical component-settings-wrapper add-component-tab">
                    <h3>
                    <span
                       :class="[isSection && componentProps.addComponent !== true ? 'icon-square' : 'icon-hexagon', 'use-icon-as-background']">
                        <span class="icon-plus"></span>
                    </span>
                        <span>{{
                                isSection && componentProps.addComponent !== true ? 'Add new section' : 'Add new component'
                            }}</span>
                    </h3>

                    <!-- begin positioning -->
                    <CmdBox v-if="!isSection || componentProps.addComponent !== true"
                            :use-slots="['body']"
                            :collapsible="true"
                            class="edit-mode-sections-settings"
                            :cmdHeadline="{headlineText: 'New component', headlineLevel: 4, headlineIcon: {iconClass: 'icon-file-settings'}}"
                            :openCollapsedBox="openBoxStatus">
                    >
                        <template v-slot:body>
                            <h5>Positioning</h5>
                        <!-- begin selection of available positions for added component -->
                        <CmdFakeSelect
                            :labelText="isSection ? 'Select inserted section position' : 'Select inserted component position'"
                            :required="true"
                            :selectData="availablePositions"
                            defaultOptionName="Select component:"
                            v-model="addedPosition"
                        />
                        <!-- end selection of available positions for added component -->
                        <hr/>
                        <!-- end positioning -->

                    <!-- begin selection of allowed components to add additional component -->
                    <div class="flex-container current-component-wrapper">
                        <h5 class="no-flex">{{ isSection ? 'Component for section' : 'Component to add' }}</h5>
                        <ul class="components-view-selection no-list-items">
                            <li>
                                <a href="#"
                                   @click.prevent="showComponentsAsIcons = !showComponentsAsIcons"
                                   :title="showComponentsAsIcons ? 'Switch to dropdown-view for components' : 'Switch to icon-view for components'"
                                >
                                    <CmdIcon :iconClass="showComponentsAsIcons ? 'icon-list' : 'icon-blocks-small'"/>
                                </a>
                            </li>
                        </ul>
                        <!-- end selection of allowed components to add additional component -->
                    </div>

                    <!-- begin select components from icons -->
                    <ul v-if="showComponentsAsIcons" class="components-icon-view">
                        <li v-for="(component, index) in listOfValidComponents" :key="index">
                            <a href="#"
                               @click.prevent="selectComponentToAdd(component.value)"
                               :class="{ 'active': addedComponentName === component.value}"
                               title="Select this component">
                            <span class="icon-hexagon">
                                <CmdIcon :iconClass="component.iconClass"/>
                            </span>
                                <span>{{ component.text }}</span>
                            </a>
                        </li>
                    </ul>
                    <!-- end select components from icons -->

                    <!-- begin select components from dropdown -->
                    <CmdFakeSelect
                        v-else
                        :labelText="isSection ? 'Select component to insert in section' : 'Select component to add'"
                        :required="true"
                        :selectData="listOfValidComponents"
                        defaultOptionName="Select component:"
                        v-model="addedComponentName"
                    />
                    <!-- end select components from dropdown -->
                        </template>
                    </CmdBox>
                </div>
                <!-- end selection of allowed components to add additional component -->

                <div class="button-wrapper stretch-buttons action-buttons-wrapper">
                    <button class="button confirm" @click="addComponent" aria-label="Add selected component">
                        <span class="icon-check-circle"></span>
                        <span>Add</span>
                    </button>
                    <button class="button cancel" @click="cancelAddComponent"
                            aria-label="Cancel adding selected component">
                        <span class="icon-cancel-circle"></span>
                        <span>Cancel</span>
                    </button>
                </div>
            </template>
        </template>
    </CmdSidebar>
</template>

<script>
// import data
import componentStructure from "../../../assets/data/component-structure.json"
import {mapState} from "pinia";
import {usePiniaStore} from "../../../stores/pinia.js"
import {createHtmlId, createUuid} from "comand-component-library";

export default {
    name: "EditModeSettingsSidebar",
    inject: {
        editModeContext: {
            default: false
        }
    },
    data() {
        return {
            openBoxStatus: false,
            openSidebarStatus: true,
            showSettingsSidebar: true,
            showComponentsAsIcons: false,
            currentComponentName: "",
            addedComponentName: "CmdContainer",
            addedPosition: "after",
            showSystemMessage: false,
            openBoxes: [1],
            listOfValidComponents: [
                {
                    text: "Empty Container",
                    value: "CmdContainer",
                    iconClass: "icon-square-outline"
                },
                {
                    text: "Address Data",
                    value: "CmdAddressData",
                    iconClass: "icon-mail"
                },
                {
                    text: "Headline",
                    value: "CmdHeadline",
                    iconClass: "icon-square"
                },
                {
                    text: "Image",
                    value: "CmdImage",
                    iconClass: "icon-image"
                },
                {
                    text: "Image Gallery",
                    value: "CmdImageGallery",
                    iconClass: "icon-square"
                },
                {
                    text: "List of links",
                    value: "CmdListOfLinks",
                    iconClass: "icon-list"
                },
                {
                    text: "Opening Hours",
                    value: "CmdOpeningHours",
                    iconClass: "icon-clock"
                },
                {
                    text: "Slideshow",
                    value: "CmdSlideshow",
                    iconClass: "icon-square"
                },
                {
                    text: "Social Networks",
                    value: "CmdSocialNetworks",
                    iconClass: "icon-square"
                },
                {
                    text: "Text-Image-Block",
                    value: "CmdTextImageBlock",
                    iconClass: "icon-square"
                },
                {
                    text: "Thumbnail-Scroller",
                    value: "CmdThumbnailScroller",
                    iconClass: "icon-square"
                },
                {
                    text: "Toggle Dark-Mode",
                    value: "CmdToggleDarkMode",
                    iconClass: "icon-square"
                }
            ]
        }
    },
    computed: {
        ...mapState(usePiniaStore, ["site", "sections"]),
        readableComponentName() {
            // remove prefix from current component-name
            let currentComponentName = this.currentComponentName.replace("Cmd", "")

            // use a regular expression to find the positions of capital letters
            let capitalPositions = []
            currentComponentName.replace(/[A-Z]/g, function (match, index) {
                capitalPositions.push(index)
                return match
            })

            // add a space before each capital letter based on the found positions
            for (let i = capitalPositions.length - 1; i >= 0; i--) {
                currentComponentName = currentComponentName.slice(0, capitalPositions[i]) + ' ' + currentComponentName.slice(capitalPositions[i]);
            }

            return currentComponentName
        },
        availablePositions() {
            const positionOptions = [
                {
                    text: "Before selected " + this.readableComponentName,
                    value: "before",
                    iconClass: "icon-arrow-up"
                },
                {
                    text: "After selected " + this.readableComponentName,
                    value: "after",
                    iconClass: "icon-arrow-down"
                }
            ]

            // add additional option for containers
            if (this.componentName === "CmdContainer") {
                positionOptions.splice(1, 0, {
                    text: "Inside container",
                    value: "inside",
                    iconClass: "icon-home"
                })
            }

            return positionOptions
        },
        tabs() {
            const tabs = [{name: 'Settings', iconClass: 'icon-cog'}]

            // show second tab (to add component) is settings belong to component (and not item)
            if (this.isComponent) {
                tabs.push({name: 'Add Component', iconClass: 'icon-plus'})
            }

            return tabs
        },
        componentName() {
            return this.editModeContext.settings.getComponentName()
        },
        componentProps() {
            return this.editModeContext.settings.getComponentProps()
        },
        settingsComponentName() {
            if (this.editModeContext.settings.getSettingsComponentName() === 'sectionSettings') {
                return 'SectionSettings'
            }
            return this.editModeContext.settings.getSettingsComponentName()
        },
        isComponent() {
            return !this.editModeContext.settings.getAllowedContentTypes() || this.editModeContext.settings.getAllowedContentTypes().length > 0;

        },
        isSection() {
            return this.componentName === "section"
        }
    },
    methods: {
        setOpenStatus(event) {
            this.openSidebarStatus = event

            if (!this.openSidebarStatus) {
                this.openTemplateSettingsStatus = false
                this.openMetaSettingsStatus = false
                this.openSectionsSettingsStatus = false
            }
        },
        selectComponentToAdd(selectedComponent) {
            this.addedComponentName = selectedComponent
        },
        switchComponent(selectedComponent) {
            if (this.componentName === "section") {
                return
            }

            if (confirm("All content for this component will be deleted. Switch to new component anyway?")) {
                // add new/selected component and delete existing one if switch is confirmed (and update settings)
                this.editModeContext.content.addContent(this.editModeContext.settings.getComponentPath(), () => JSON.parse(JSON.stringify(componentStructure[selectedComponent])))
                this.editModeContext.content.deleteContent(this.editModeContext.settings.getComponentPath())
                this.editModeContext.settings.updateEditing(selectedComponent, componentStructure[selectedComponent].props)
            } else {
                this.$nextTick(() => this.currentComponentName = this.componentName)
            }
        },
        cancelSettings() {
            if (confirm('Are you sure your want to cancel? (changes will not be saved)')) {
                this.editModeContext.settings.stopEditing()
            }
        },
        saveSettings() {
            const saveHandler = this.editModeContext.settings.getSettingsSaveHandler()
            saveHandler(this.$refs.settings.updateCallbackProvider())
            this.editModeContext.settings.stopEditing()
        },
        addComponent() {
            // if empty container is added
            if (this.addedPosition === "inside") {
                const componentPathForContainer = [...this.editModeContext.settings.getComponentPath()]

                // extend component path to add select component inside CmdContainer
                componentPathForContainer.push("components", -1)

                // add content and create deep copy of componentStructure
                this.editModeContext.content.addContent(componentPathForContainer, () => JSON.parse(JSON.stringify(componentStructure[this.addedComponentName])), "after")
            } else {
                const addedElement = this.isSection && this.componentProps.addComponent !== true ? 'section' : this.addedComponentName
                // make deep copy to create new sections object and new components array.
                const sectionElement = JSON.parse(JSON.stringify(componentStructure[addedElement]))

                if (this.isSection && this.componentProps.addComponent !== true) {
                    // get structure of component to be added in new section
                    const addedComponentStructure = componentStructure[this.addedComponentName]

                    // add new component-structure to list of components for new sections
                    sectionElement.components.push(addedComponentStructure)

                    sectionElement.id = createHtmlId()
                }
                console.log("getComponentPath()", this.editModeContext.settings.getComponentPath())
                this.editModeContext.content.addContent(this.editModeContext.settings.getComponentPath(), () => JSON.parse(JSON.stringify(sectionElement)), this.addedPosition)
            }
            this.editModeContext.settings.stopEditing()
        },
        cancelAddComponent() {
            if (confirm('Are you sure your want to cancel? (changes will not be saved)')) {
                this.editModeContext.settings.stopEditing()
            }
        }
    },
    watch: {
        componentName: {
            handler() {
                this.currentComponentName = this.componentName
            },
            immediate: true
        }
    }
}
</script>

<style>
#edit-mode-settings-sidebar {
    justify-content: space-between;
    background: var(--default-background);
    position: fixed;
    padding: 0;
    top: 0;
    right: 0;
    z-index: 1001;
    height: 100vh;

    .component-settings-top-wrapper {
        padding: var(--default-padding);

        .cmd-fake-select {
            width: 100%;
        }
    }

    h3 {
        display: flex;
        align-items: center;
        justify-content: center;

        > span {
            font-size: 2.2rem;

            &[class*="icon"] {
                &::before {
                    font-size: 2.2rem;
                }

                [class*="icon"] {
                    &::before {
                        font-size: 1rem;
                        line-height: 200%; /* fixes vertical position */
                    }
                }
            }
        }
    }

    .current-component-wrapper {
        align-items: center;

        h4 {
            margin: 0;
        }

    }

    .action-buttons-wrapper {
        > * {
            flex: 1;
        }
    }

    input:not(.toggle-switch), select, textarea, .input {
        --input-height: 3rem;
        padding-top: .5rem;
        padding-bottom: .5rem;
    }

    .list-of-components {
        padding: var(--default-padding);
    }

    .components-view-selection {
        display: flex;
        width: 100%;
        justify-content: flex-end;
        margin: 0;
    }

    .component-settings-wrapper {
        .cmd-fake-select {
            width: 100%;
        }

        > h3:first-child {
            .use-icon-as-background {
                &::before, & + span {
                    color: var(--primary-color);
                }
            }
        }

        &.add-component-tab {
            > h3:first-child {
                .use-icon-as-background {
                    &::before, & + span {
                        color: var(--success-color);
                    }
                }
            }
        }
    }

    .no-image {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: calc(var(--default-gap) / 2);
        padding: var(--default-padding);
        border: var(--default-border);

        [class*="icon"] {
            font-size: 3rem;
        }
    }

    .components-icon-view {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        grid-gap: 1.5rem 0;

        li {
            border: var(--default-border);
            border-color: transparent;
            list-style-type: none;
            margin-left: 0;

            a {
                display: flex;
                flex-direction: column;
                gap: var(--default-gap-half);
                align-items: center;
                text-align: center;
                font-size: small;
                text-decoration: none;
                width: 100%;

                > span[class*="icon"] {
                    font-size: 5rem;
                }

                span {
                    margin: 0;

                    [class*="icon"] {
                        font-size: var(--icon-size-large);
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        z-index: 2;
                        transform: translate(-50%, -50%);
                        color: var(--pure-white);
                    }
                }

                &:hover, &:active, &:focus {
                    span:not([class*="icon"]) {
                        text-decoration: underline;
                    }
                }

                &.active:not([class*="icon-"]) {
                    background: none;
                    padding: 0;
                }
            }
        }
    }
}
</style>