<template>
    <!-- begin cmd-headline (headline is required in section) -->
    <CmdHeadline v-if="cmdHeadlide?.headlineText" :headlineText="cmdHeadlide?.headlineText" :headlineLevel="cmdHeadlide?.headlineLevel"/>
    <!-- end cmd-headline -->
    <CmdForm v-if="!loginStatus" @submit="login" :textLegend="cmdForm.login" :showLegend="cmdForm.showLegend">
        <CmdSystemMessage v-if="error && systemMessage" :systemMessage="systemMessage" validationStatus="error" />
        <CmdFormElement element="input" type="password" :labelText="passwordLabelText" :placeholder="passwordLabelText" v-model="password" />
        <div class="button-wrapper">
            <CmdFormElement element="button" :native-button="{text: submitButtonText}" />
        </div>
    </CmdForm>
    <div v-else>
        <h2>Downloads</h2>
        <ul>
            <li v-for="(file, index) in filesToDownload">
                <a href="#" :data-filename="file.name" @click.prevent="downloadFile" :target="file.target">{{file.text}}</a>
            </li>
        </ul>
        <!-- begin link logout -->
        <a v-if="linkLogout.show" :href="linkLogout.path" :title="linkLogout.tooltip" @click.prevent="logout">
            <span v-if="linkLogout.iconClass" :class="linkLogout.iconClass"></span>
            <span v-if="linkLogout.text">{{ linkLogout.text }}</span>
        </a>
        <!-- end link logout -->
    </div>
</template>

<script>
import {mapActions, mapState} from "pinia"
import {usePiniaStore} from "../stores/pinia"

// import mixins
import BaseI18nComponent from "../components/mixins/BaseI18nComponent"
export default {
    name: "LoginArea",
    mixins: [BaseI18nComponent],
    data() {
        return {
            loginStatus: false,
            password: "",
            error: false,
            systemMessage: ""
        }
    },
    props: {
        linkLogout: {
            type: Object,
            default() {
                return {
                    show: true,
                    path: "#",
                    iconClass: "icon-logout",
                    text: "Logout",
                    tooltip: ""
                }
            }
        },
        loginArea: {
            type: Object,
            default: {}
        },
        filesToDownload: {
          type: Array,
          default: []
        },
        baseUrl: {
            type: String,
            required: true
        },
        cmdForm: {
            type: Object,
            default () {
                return {
                    textLegend: "Login",
                    showLegend: true
                }
            }
        },
        passwordLabelText: {
            type: String,
            default: "Password"
        },
        submitButtonText: {
            type: String,
            default: "Login"
        },
        cmdHeadline: {
            type: Object,
            required: false
        }
    },
    computed: {
        ...mapState(usePiniaStore, ["authToken"])
    },
    methods: {
        ...mapActions(usePiniaStore, ["setAuthToken", "deleteAuthToken"]),

        login() {
            if(!this.password) {
                this.error = true
                this.systemMessage = this.label("login_area.please_enter_password")
                return
            }

            const formData = new FormData()
            formData.set("username", "admin")
            formData.set("password", this.password)
            const url = new URL(this.baseUrl + "/auth/login")
            const options = {
                method: "POST",
                body: formData
            }
            this.loginStatus = false

            fetch(url.href, options)
                .then(response => {
                    if (response.ok) {
                        return response.text()
                    }
                    throw new Error(this.label("login_area.wrong_password"))
                })
                .then(token => {
                    this.setAuthToken(token)
                    this.loginStatus = true
                    this.error = false
                    this.systemMessage = ""
                })
                .catch(error => {
                    this.error = true
                    this.systemMessage = error
                })
        },
        downloadFile(event) {
            const url = new URL(this.baseUrl + "/files/download")
            url.searchParams.set("filename", event.target.dataset.filename)
            const options = {
                headers: {
                    Authorization: "Bearer " + this.authToken
                }
            }
            const fileInfo = {}
            fetch(url.href, options)
                .then(response => {
                    if (response.ok) {
                        fileInfo.fileName = response.headers.get("x-op-filename")
                        return response.blob()
                    }
                    if (response.status === 401) {
                        throw new Error("")
                    }
                    throw new Error(this.label("login_area.an_error_occurred"))
                })
                .then(data => new File([data], fileInfo.fileName))
                .then(file => open(URL.createObjectURL(file)))
                .catch(error => {
                    if (error) {
                        this.error = true
                        this.systemMessage = error
                    }
                    this.logout()
                })
        },
        logout() {
            this.deleteAuthToken()
            this.loginStatus = false
        }
    }
}
</script>

<style>

</style>