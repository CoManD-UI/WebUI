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

    <CmdBox :use-slots="['body']" :collapsible="true" :cmdHeadline="{headlineText: 'Networks', headlineLevel: 4}">
        <template v-slot:body>
            <div class="flex-container vertical component-settings-wrapper">
                <div class="button-wrapper align-left">
                    <button
                        v-for="(socialNetwork, index) in listOfAllNetworks"
                        :key="index"
                        :class="['button', {disabled: !socialNetwork.active}]"
                        :id="socialNetwork.id"
                        :title="tooltipForNetworkButton(socialNetwork)"
                        @click="toggleSocialNetwork(index)"
                    >
                        <span :class="socialNetwork.iconClass"></span>
                    </button>
                </div>
                <button type="button" class="button" @click="removeItems">
                    <span class="icon-trash"></span>
                    <span>{{removeButtonLabel}}</span>
                </button>

                <CmdFormElement
                    element="select"
                    labelText="Alignment"
                    :selectOptions="alignOptions"
                    v-model="alignModel"
                />

                <CmdFormElement
                    element="input"
                    type="checkbox"
                    :toggleSwitch="true"
                    labelText="User must accept data privacy"
                    v-model="userMustAcceptDataPrivacyModel"
                />

                <CmdFormElement
                    element="input"
                    type="checkbox"
                    :toggleSwitch="true"
                    labelText="Use gap between buttons"
                    v-model="useGapModel"
                />

                <CmdFormElement
                    element="input"
                    type="checkbox"
                    :toggleSwitch="true"
                    labelText="Stretch buttons"
                    v-model="stretchButtonsModel"
                />
            </div>
        </template>
    </CmdBox>
</template>

<script>
export default {
    name: "CmdSocialNetworksSettings",
    inject: {
        editModeContext: {
            default: false
        }
    },
    inheritAttrs: false,
    data() {
        return {
            editableAlign: null,
            editableUserMustAcceptDataPrivacy: null,
            editableUseGap: null,
            editableStretchButtons: null,
            alignOptions: [
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
            ],
            listOfAllNetworks: [
                {
                    "name": "facebook",
                    "id": "social-network-facebook",
                    "path": "https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fdevelopment.comand-cms.com%2Fmodule%2Fteam.html",
                    "tooltip": "Share this page on facebook",
                    "iconClass": "icon-facebook",
                    "linkText": "Share",
                    active: false
                },
                {
                    "name": "twitter",
                    "id": "social-network-twitter",
                    "path": "https://twitter.com/home?status=http%3A%2F%2Fdevelopment.comand-cms.com%2Fmodule%2Fteam.html",
                    "tooltip": "Share this page on twitter",
                    "iconClass": "icon-twitter",
                    "linkText": "Share",
                    active: false
                },
                {
                    "name": "xing",
                    "id": "social-network-xing",
                    "path": "https://www.xing.com/spi/shares/new?sc_p=b7910_cb&amp;url=http%3A%2F%2Fdevelopment.comand-cms.com%2Fmodule%2Fteam.html",
                    "tooltip": "Share this page on xing",
                    "iconClass": "icon-xing",
                    "linkText": "Share",
                    active: false
                },
                {
                    "name": "linked in",
                    "id": "social-network-linkedin",
                    "path": "https://www.linkedin.com/cws/share?url=http%3A%2F%2Fdevelopment.comand-cms.com%2Fmodule%2Fteam.html",
                    "tooltip": "Share this page on linkedin",
                    "iconClass": "icon-linkedin",
                    "linkText": "Share",
                    active: false
                }
            ]
        }
    },
    props: {
        cmdHeadline: {
            type: Object,
            required: false
        },
        networks: {
            type: Array,
            required: false,
        },
        align: {
            type: String,
            required: false
        },
        userMustAcceptDataPrivacy: {
            type: Boolean,
            default: true
        },
        useGap: {
            type: Boolean,
            default: true
        },
        stretchButtons: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        removeButtonLabel() {
            return "Remove all " + this.networks.length + " networks"
        },
        alignModel: {
            get() {
                return this.editableAlign == null ? this.align : this.editableAlign
            },
            set(value) {
                this.editableAlign = value
            }
        },
        userMustAcceptDataPrivacyModel: {
            get() {
                return this.editableUserMustAcceptDataPrivacy == null ? this.userMustAcceptDataPrivacy : this.editableUserMustAcceptDataPrivacy
            },
            set(value) {
                this.editableUserMustAcceptDataPrivacy = value
            }
        },
        useGapModel: {
            get() {
                return this.editableUseGap == null ? this.useGap : this.editableUseGap
            },
            set(value) {
                this.editableUseGap = value
            }
        },
        stretchButtonsModel: {
            get() {
                return this.editableStretchButtons == null ? this.stretchButtons : this.editableStretchButtons
            },
            set(value) {
                this.editableStretchButtons = value
            }
        }
    },
    methods: {
        removeItems() {
            if (confirm("All networks will be removed (the component itself remains). Continue anyways?")) {
                const saveHandler = this.editModeContext.settings.getSettingsSaveHandler()
                saveHandler(props => props.networks = [])
            }
        },
        tooltipForNetworkButton(socialNetwork) {
            if (socialNetwork.active) {
                return "Deactivate " + socialNetwork.name
            }
            return "Activate " + socialNetwork.name
        },
        toggleSocialNetwork(index) {
            // toggle active-status for clicked network
            this.listOfAllNetworks[index].active = !this.listOfAllNetworks[index].active
        },
        updateCallbackProvider() {
            const headlineUpdateCallback = this.$refs.headlineSettings.updateCallbackProvider()
            const data = {
                align: this.alignModel,
                userMustAcceptDataPrivacy: this.userMustAcceptDataPrivacyModel,
                useGap: this.useGapModel,
                stretchButtons: this.stretchButtonsModel,
                networks: this.listOfAllNetworks.filter(network => network.active)
            }
            return props => {
                if (!props.cmdHeadline) {
                    props.cmdHeadline = {}
                }
                headlineUpdateCallback(props.cmdHeadline)

                props.align = data.align
                props.userMustAcceptDataPrivacy = data.userMustAcceptDataPrivacy
                props.useGap = data.useGap
                props.stretchButtons = data.stretchButtons
                props.networks = data.networks
            }
        }
    },
    watch: {
        networks: {
            handler() {
                for (let i = 0; i < this.networks.length; i++) {
                    const activeNetwork = this.listOfAllNetworks.find((item) => item.id === this.networks[i].id)

                    if (activeNetwork) {
                        activeNetwork.active = true
                    }
                }
            },
            immediate: true
        }
    }
}
</script>

<style lang="scss">
button.disabled:is(:hover, :active, :focus) {
    cursor: pointer !important;
}

#social-network-facebook {
    --social-network-color: #3c5a99;
}

#social-network-twitter {
    --social-network-color: #6bacde;
}

#social-network-xing {
    --social-network-color: #007575;
}

#social-network-linkedin {
    --social-network-color: #0077b5;
}
</style>