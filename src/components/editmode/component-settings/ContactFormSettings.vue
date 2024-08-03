<template>
    <CmdBox :use-slots="['body']" :collapsible="true" :cmdHeadline="{headlineText: 'Headline', headlineLevel: 4}">
        <template v-slot:body>
            <CmdHeadlineSettings
                    ref="headlineSettings"
                    v-bind="cmdHeadline || {}"
            />
        </template>
    </CmdBox>
    <CmdBox :use-slots="['body']" :collapsible="true"
            :cmdHeadline="{headlineText: 'Receiver Address', headlineLevel: 4}">
        <template v-slot:body>
            <div class="component-settings-wrapper">
                <CmdFormElement
                        element="input"
                        type="email"
                        :required="true"
                        labelText="Receiver E-Mail-Address"
                        placeholder="Receiver E-Mail-Address"
                        v-model="emailAddressModel"
                />
            </div>
        </template>
    </CmdBox>
</template>

<script>
export default {
    name: "ContactFormSettings",
    inheritAttrs: false,
    data() {
        return {
            editableEmailAddress: null
        }
    },
    props: {
        emailAddress: {
            type: String,
            default: ""
        },
        /**
         * properties for CmdHeadline-component
         */
        cmdHeadline: {
            type: Object,
            required: false
        }
    },
    computed: {
        emailAddressModel: {
            get() {
                return this.editableEmailAddress == null ? this.emailAddress : this.editableEmailAddress
            },
            set(value) {
                this.editableEmailAddress = value
            }
        }
    },
    methods: {
        updateCallbackProvider() {
            const headlineUpdateCallback = this.$refs.headlineSettings.updateCallbackProvider()
            return props => {
                if (!props.cmdHeadline) {
                    props.cmdHeadline = {}
                }
                headlineUpdateCallback(props.cmdHeadline)
            }
        }
    }
}
</script>

<style scoped>

</style>
