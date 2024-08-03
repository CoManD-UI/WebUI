<template>
    <CmdBox :use-slots="['body']" :collapsible="true"
            :cmdHeadline="{headlineText: 'Meta Data Settings', headlineLevel: 4, headlineIcon: {iconClass: 'icon-html'}}"
            :openCollapsedBox="openBoxStatus"
            @toggleCollapse="$emit('toggle-collapse', $event)"
    >
        <template v-slot:body>
            <div class="flex-container vertical">
                <h4>Meta Data</h4>
                <CmdFormElement
                    element="input"
                    type="text"
                    labelText="Title"
                    placeholder="Title of this page"
                    v-model="title"
                    :required="true"
                    max-length="255"
                />
                <CmdFormElement
                    element="textarea"
                    labelText="Meta Description"
                    placeholder="Meta Description"
                    v-model="description"
                    :required="true"
                    maxlength="160"
                />
                <CmdFormElement
                    element="select"
                    labelText="Rating"
                    :selectOptions="ratingOptions"
                />
                <CmdFormElement
                    element="select"
                    labelText="Robots"
                    :required="true"
                    :selectOptions="robotsOptions"
                />
                <CmdFormElement
                    element="input"
                    type="text"
                    labelText="Author"
                    placeholder="Author of this page"
                    max-length="255"
                />
            </div>
        </template>
    </CmdBox>
</template>

<script>
export default {
    name: "EditModeMetaDataSettings",
    inject: {
        editModeContext: {
            default: false
        }
    },
    data() {
        return {
            openBoxStatus: false,
            robotsOptions: [
                {
                    text: "index/follow",
                    value: "index/follow"
                },
                {
                    text: "index/nofollow",
                    value: "index/nofollow"
                },
                {
                    text: "noindex/follow",
                    value: "noindex/follow"
                },
                {
                    text: "noindex/nofollow",
                    value: "noindex/nofollow"
                }
            ],
            ratingOptions: [
                {
                    text: "Please select...",
                    value: ""
                },
                {
                    text: "general",
                    value: "general"
                },
                {
                    text: "mature",
                    value: "mature"
                },
                {
                    text: "restricted",
                    value: "restricted"
                },
                {
                    text: "adult",
                    value: "adult"
                },
                {
                    text: "14 years",
                    value: "14-years"
                },
                {
                    text: "safe for kids",
                    value: "safe-for-kids"
                }
            ]
        }
    },
    props: {
        modelValue: {
            type: Object,
            required: true
        },
        openBox: {
          type: Boolean,
          required: false
      }
    },
    computed: {
        title: {
            get() {
               return this.modelValue.title
            },
            set(value) {
               this.updateModelValue({title: value})
            }
        },
        description: {
            get() {
                return this.modelValue.description
            },
            set(value) {
                this.updateModelValue({description: value})
            }
        },
        rating: {
            get() {
                return this.modelValue.rating
            },
            set(value) {
                this.updateModelValue({rating: value})
            }
        },
        robots: {
            get() {
                return this.modelValue.robots
            },
            set(value) {
                this.updateModelValue({robots: value})
            }
        },
        author: {
            get() {
                return this.modelValue.author
            },
            set(value) {
                this.updateModelValue({author: value})
            }
        }
    },
    methods: {
      updateModelValue(value) {
          this.$emit("update:modelValue", {...this.modelValue, ...value})
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

<style>

</style>