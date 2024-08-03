<template>
    <CmdSidebar
        v-if="showMainSidebar"
        :openSidebar="openSidebarStatus"
        @toggleSidebar="setOpenStatus($event)"
        id="edit-mode-main-sidebar"
        :cmdHeadline="{headlineText: 'Site Settings', headlineLevel: 3, textAlign: 'center'}"
    >
        <template v-slot:open>
            <div class="accordions-wrapper">
                <CmdSystemMessage v-if="showSystemMessage" validation-status="success" system-message="You changes have been saved successfully!" />
                <CmdBoxWrapper
                    :boxesPerRow="[1]"
                    :allowMultipleExpandedBoxes="false"
                    :allowUserToToggleOrientation="false"
                    :useRowViewAsDefault="true"
                    :openBoxesByDefault="openBoxes"
                    :useGap="false"
                >
                    <template v-slot="slotProps">
                        <EditModeTemplateSettings
                            :editModeMessage="editModeMessage"
                            :openBox="slotProps.boxIsOpen(0)"
                            @toggleCollapse="slotProps.boxToggled(0, $event)"
                            @input="changeTemplate"
                        />
                        <EditModeMetaDataSettings
                            v-model="metaData"
                            :openBox="slotProps.boxIsOpen(1)"
                            @toggleCollapse="slotProps.boxToggled(1, $event)"
                        />
                        <EditModeSectionsSettings
                            :openBox="slotProps.boxIsOpen(2)"
                            @toggleCollapse="slotProps.boxToggled(2, $event)"
                        />
                    </template>
                </CmdBoxWrapper>
            </div>
            <div class="button-wrapper stretch-buttons action-buttons-wrapper">
                <button class="button confirm" @click="saveSettings">
                    <span class="icon-check-circle"></span>
                    <span>Save</span>
                </button>
                <button class="button cancel" @click="cancelSettings">
                    <span class="icon-cancel-circle"></span>
                    <span>Cancel</span>
                </button>
            </div>
            <dl class="comand-versions">
                <dt>Frontend-Framework Version:</dt>
                <dd>{{ packageJson.dependencies['comand-frontend-framework'].replace("^", "") }}</dd>
                <dt>Component-Library Version:</dt>
                <dd>{{ packageJson.dependencies['comand-component-library'].replace("^", "") }}</dd>
                <dt>OnePager Version:</dt>
                <dd>{{ packageJson.version }}</dd>
            </dl>
        </template>
        <template v-slot:closed>
            <div class="closed-sidebar">
                <a class="button primary" href="#" title="Open Template Settings" @click.prevent="openTemplateSettings">
                    <span class="icon-settings-template"></span>
                </a>
                <a class="button primary" href="#" title="Open Meta Settings" @click.prevent="openMetaSettings">
                    <span class="icon-html"></span>
                </a>
                <a class="button primary" href="#" title="Open Section Settings" @click.prevent="openSectionsSettings">
                    <span class="icon-settings-component"></span>
                </a>
            </div>
        </template>
    </CmdSidebar>
</template>

<script>
import {mapActions, mapState} from "pinia"
import {useCmsStore} from "../../stores/cms.js"
import packageJson from '../../../package.json'

export default {
    name: "EditModeMainSidebar",
    inject: {
        editModeContext: {
            default: false
        }
    },
    data() {
        return {
            packageJson,
            openSidebarStatus: true,
            showMainSidebar: true,
            showSystemMessage: false,
            openTemplateSettingsStatus: false,
            openMetaSettingsStatus: false,
            openSectionsSettingsStatus: false,
            metaData: {},
            openBoxes: [1]
        }
    },
    props: {
        editModeMessage: {
            type: Boolean
        }
    },
    methods: {
        ...mapActions(useCmsStore, ["updateMetaData"]),

        setOpenStatus(event) {
            this.openSidebarStatus = event

            if(!this.openSidebarStatus) {
                this.openTemplateSettingsStatus = false
                this.openMetaSettingsStatus = false
                this.openSectionsSettingsStatus = false
            }
        },
        openTemplateSettings() {
            this.openSidebarStatus = true
            this.openTemplateSettingsStatus = true
        },
        openMetaSettings() {
            this.openSidebarStatus = true
            this.openMetaSettingsStatus = true
        },
        openSectionsSettings() {
            this.openSidebarStatus = true
            this.openSectionsSettingsStatus = true
        },
        cancelSettings() {
            if (confirm("Are you sure your want to cancel? (Changes will not be saved!)")) {
                this.showSystemMessage = false
                this.openTemplateSettingsStatus = false
                this.openMetaSettingsStatus = false
                this.openSectionsSettingsStatus = false
                this.openSidebarStatus = false
            }
        },
        saveSettings() {
            this.updateMetaData(this.metaData)

            this.showSystemMessage = true
        },
        changeTemplate(event) {
            this.$emit("change-template", event)
        }
    },
    computed: {
        ...mapState(useCmsStore, {storeMetaData: "metaData"})
    },
    watch: {
        storeMetaData: {
            handler() {
                // assign metadata from store to local data-property (and watch)
                this.metaData = {...this.storeMetaData}
            },
            immediate: true
        }

    }
}
</script>

<style>
.edit-mode {
    #edit-mode-main-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 2000;
        max-width: 30rem;
        height: 100vh;
        margin: 0;
        padding: 0;
        gap: 0;
        border: 0;
        border-right: var(--default-border);

        select {
            color: var(--color-scheme-text-color);
        }

        &.open {
            .cmd-box {
                border: 0;

                &:last-of-type {
                    border-bottom: var(--default-border);
                }
            }
        }
    }

    .action-buttons-wrapper {
        margin-top: auto;
        padding: var(--default-padding);
    }

    .closed-sidebar {
        display: flex;
        flex-direction: column;
        gap: var(--default-gap);
        padding: var(--default-padding);
    }
}
</style>