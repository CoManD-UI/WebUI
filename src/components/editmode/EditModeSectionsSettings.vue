<template>
    <CmdBox :use-slots="['body']"
            :collapsible="true"
            class="edit-mode-sections-settings"
            :cmdHeadline="{headlineText: 'Content Settings', headlineLevel: 4, headlineIcon: {iconClass: 'icon-file-settings'}}"
            :openCollapsedBox="openBoxStatus"
            @toggleCollapse="$emit('toggle-collapse', $event)"
    >
        <template v-slot:body>
            <ul class="list-of-sections">
                <li>
                    <strong>{{ numberOfSections }} sections:</strong>
                    <ul class="action-buttons">
                        <li>
                            <a class="icon-trash"
                               href="#"
                               title="Delete all sections"
                               @click.prevent="deleteSections"
                               @mouseenter="highlightAllSections"
                               @mouseleave="removeHighlightSection">
                            </a>
                        </li>
                    </ul>
                </li>
                <li v-for="(section, index) in contentSections"
                    :key="index"
                    class="sections-name-wrapper"
                    :draggable="true"
                    :data-section-index="index"
                    v-on="dragDropHandlers(index)"
                >
                    <!-- begin sectionName / navEntry -->
                    <CmdFormElement
                        v-if="editNavEntry === index"
                        class="section-name-inputfield"
                        element="input"
                        type="text"
                        :required="true"
                        labelText="Edit section name"
                        :showLabel="false"
                        placeholder="Section name"
                        v-model="section.navEntry"
                        :ref="`input_${index}`"
                    />
                    <span v-else>{{ section.navEntry }}</span>
                    <!-- end sectionName / navEntry -->

                    <ul class="action-buttons">
                        <!-- begin toggle edit name -->
                        <li>
                            <a
                                href="#"
                                :class="editNavEntry !== index ? 'icon-edit' : 'icon-blocked'"
                                :title="editNavEntry !== index ? 'Edit section name' : 'Stop editing section name'"
                                @mouseenter="section.showLinkInMainNavigation === true ? highlightNavEntry(section.id) : null"
                                @mouseleave="removeHighlightNavEntry"
                                @click.prevent="toggleEditSectionName(section, index)"
                            >
                            </a>
                        </li>
                        <!-- end toggle edit name -->

                        <!-- begin toggle navEntry -->
                        <li>
                            <a
                                href="#"
                                :class="toggleNavEntryClasses(section)"
                                :title="toggleNavEntryTooltip(section)"
                                @mouseenter="section.showLinkInMainNavigation === true ? highlightNavEntry(section.id) : null"
                                @mouseleave="removeHighlightNavEntry"
                                @click.prevent="toggleSectionNavEntry(section.componentPath)">
                            </a>
                        </li>
                        <!-- end toggle navEntry -->

                        <!-- begin toggle visibility -->
                        <li>
                            <a
                                href="#"
                                :class="section.show === false ? 'icon-not-visible' : 'icon-visible'"
                                :title="section.show === false ? 'Show this section' : 'Hide this section'"
                                @click.prevent="toggleSectionVisibility(section.componentPath)"
                                @mouseenter="section.show !== false ? highlightSection(section.id) : null"
                                @mouseleave="removeHighlightSection"
                            >
                            </a>
                        </li>
                        <!-- end toggle visibility -->

                        <!-- begin delete -->
                        <li>
                            <a
                                class="icon-trash"
                                href="#"
                                title="Delete this section"
                                @click.prevent="deleteSection(section.componentPath)"
                                @mouseenter="highlightSection(section.id)"
                                @mouseleave="removeHighlightSection"
                            >
                            </a>
                        </li>
                        <!-- end delete -->
                    </ul>
                </li>
            </ul>
        </template>
    </CmdBox>
</template>

<script>
import {mapState, mapActions} from "pinia"
import {useCmsStore} from "../../stores/cms.js"
import {highlightSection} from "../../utils/editmode.js"
import {createUuid} from "comand-component-library";

export default {
    name: "EditModeSectionsSettings",
    data() {
        return {
            openBoxStatus: false,
            yScrollPosition: 0,
            editNavEntry: null,
            inputRefs: []
        }
    },
    props: {
        openBox: {
            type: Boolean,
            required: false
        }
    },
    mounted() {
        // Populate inputRefs array with refs from the input elements
        this.contentSections.forEach((_, index) => {
            this.inputRefs.push(this.$refs[`input_${index}`]);
        });
    },
    computed: {
        ...mapState(useCmsStore, ["sections"]),

        contentSections() {
            return this.sections.map((section, index) => {
                return {
                    id: section.id,
                    navEntry: section.navEntry || 'Section' + " " + (index + 1),
                    show: section.show !== false,
                    showLinkInMainNavigation: section.showLinkInMainNavigation === true,
                    order: section.order,
                    componentPath: ["main", "sections", index]
                }
            })

        },
        numberOfSections() {
            return this.sections.length
        }
    },
    methods: {
        ...mapActions(useCmsStore, ["deleteContent", "updateContent", "updateSettings", "updateSectionsSettings"]),

        toggleNavEntryTooltip(section) {
            let tooltip = ""

            // check is link is shown in main navigation
            if (section.showLinkInMainNavigation === true) {
                tooltip = "Hide entry in main navigation"
            } else {
                tooltip = "Show entry in main navigation"
            }

            return tooltip
        },
        toggleNavEntryClasses(section) {
            const classes = []

            // check is link is shown in main navigation
            if (section.showLinkInMainNavigation === true) {
                classes.push("icon-list")
            } else {
                classes.push("icon-blocked")
            }

            return classes
        },
        getComponentPath(sectionIndex) {
            return ["main", "sections", sectionIndex]
        },
        toggleSectionVisibility(componentPath) {
            this.editNavEntry = false
            this.updateSectionsSettings(componentPath, "visibility")
        },
        toggleSectionNavEntry(componentPath) {
            this.editNavEntry = false
            this.removeHighlightNavEntry()
            this.updateSectionsSettings(componentPath, "navEntryVisibility")
        },
        toggleEditSectionName(section, sectionIndex) {
            if (this.editNavEntry === sectionIndex) {
                this.editNavEntry = null
            } else {
                this.editNavEntry = sectionIndex
                this.navEntry = section.navEntry
                this.updateSectionsSettings(section.componentPath, "editNavEntry", this.navEntry)

               // const sectionNameInputfields = document.getElementsByClassName(".section-name-inputfield")

                this.$nextTick(() => {
                    if (this.inputRefs[sectionIndex]) {
                        this.inputRefs[sectionIndex].focus();
                    }
                })
            }
        },

        // begin highlighting elements

        // highlight entries in main navigation
        highlightNavEntry(sectionId) {
            const element = document.querySelector("header nav a[href='#anchor-" + sectionId + "']")?.parentElement

            if (element) {
                element.classList.add("active")
            }
        },
        removeHighlightNavEntry() {
            const elements = document.querySelectorAll("header nav li")
            elements.forEach(element => {
                element.classList.remove("active")
            })
        },

        // highlight sections
        highlightAllSections() {
            // get all section wrappers (and sections) to apply active-class
            document.querySelectorAll(".section-wrapper").forEach((section) => {
                section.classList.add("edit-mode-active")
            })
        },
        highlightSection(sectionId) {
            // call function from utils
            highlightSection(sectionId)
        },
        removeHighlightSection() {
            const elements = document.querySelectorAll(".section-wrapper")

            elements.forEach(element => {
                element.classList.remove("edit-mode-active")
            })
        },

        // begin delete
        deleteSection(componentPath) {
            if (confirm("Delete this section (and its content)?")) {
                this.deleteContent(componentPath)
            }
        },
        deleteSections() {
            if (confirm("Delete all sections (and their content)?")) {
                this.updateContent(["main"], [{
                    update(component) {
                        component.sections = []
                    }
                }])
            }
        },
        dragDropHandlers(index) {
            return {
                dragstart(event) {
                    event.dataTransfer.dropEffect = "move"
                    event.dataTransfer.setData("text/plain", index)
                },
                // dragend(event) {
                //     console.log("dragend", event)
                // },
                // dragenter(event) {
                //     console.log("dragenter", event)
                // },
                dragover(event) {
                    event.preventDefault()
                    event.dataTransfer.dropEffect = "move"
                    return false
                },
                // dragleave(event) {
                //     console.log("dragleave", event)
                // },
                drop: (event) => {
                    event.preventDefault()
                    const sourceSectionIndex = Number(event.dataTransfer.getData("text/plain"))
                    const targetSectionIndex = Number(event.target.closest("li").dataset.sectionIndex)
                    const sourceSection = this.contentSections[sourceSectionIndex]
                    const targetSection = this.contentSections[targetSectionIndex]
                    const sourceSectionOrder = sourceSection.order
                    const targetSectionOrder = targetSection.order

                    if (sourceSectionOrder === targetSectionOrder) {
                        return
                    }

                    this.updateSettings(sourceSection.componentPath, (props, sections) => {
                        const moveDown = sourceSectionOrder < targetSectionOrder
                        if (moveDown) {
                            sections.forEach(section => {
                                if (section.order <= targetSectionOrder && section.order > sourceSectionOrder) {
                                    section.order--
                                }
                            })
                        } else {
                            sections.forEach(section => {
                                if (section.order >= targetSectionOrder && section.order < sourceSectionOrder) {
                                    section.order++
                                }
                            })
                        }
                        props.order = targetSectionOrder
                        sections.sort((a, b) => a.order - b.order)
                    })
                }
            }
        }
    },
    watch: {
        openBox: {
            handler() {
                this.openBoxStatus = this.openBox
            },
            immediate: true
        }
    }
}
</script>

<style lang="scss">
.edit-mode-sections-settings {
    ul {
        margin: 0;

        &.list-of-sections {
            display: flex;
            flex-direction: column;
            gap: calc(var(--default-gap) / 2);

            .sections-name-wrapper {
                display: flex;
                justify-content: space-between;

                .section-name-inputfield {
                    max-width: 60%;

                    input {
                        flex: none;
                        padding: 0;
                        width: 100%; // overwrite default width for inputs
                        height: auto;
                    }
                }
            }
        }

        li {
            margin-left: 0;
            list-style-type: none;
        }

        > li {
            display: flex;
            justify-content: space-between;
        }
    }

    .action-buttons {
        display: flex;
        gap: calc(var(--default-gap) / 2);
    }
}
</style>