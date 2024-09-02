/* begin imports css from comand-frontend-framework ---------------------------------------------------------------------------------------- */
/* import generated css from components */
import 'comand-frontend-framework/styles'
/* end imports css from comand-frontend-framework ---------------------------------------------------------------------------------------- */

import { createApp } from "vue"
import App from "./App.vue"

/* begin imports from comand-component-library ---------------------------------------------------------------------------------------- */
/* import additional iconfont containing base-icons */
import 'comand-ui-iconfonts/src/fonts/base-iconfont/base-iconfont.css'

/* import additional iconfont containing company-logos */
import 'comand-ui-iconfonts/src/fonts/logos-iconfont/logos-iconfont.css'

/* import additional iconfont containing editmode-icons */
import 'comand-ui-iconfonts/src/fonts/editmode-iconfont/editmode-iconfont.css'

/* import css for global-styles */
import 'comand-component-library/src/assets/styles/component-library-global-styles.scss'

/* import css for global transitions */
//import 'comand-component-library/src/assets/styles/transitions.scss'

/* import generated css from components */
import 'comand-component-library/dist/style.css'

/* import css for your custom styles */
import 'comand-component-library/src/assets/styles/template.css'

/* end imports from comand-component-library ---------------------------------------------------------------------------------------- */

/* end imports from comand-ui-website ---------------------------------------------------------------------------------------- */
/* import global css */
import './assets/styles/comand-ui-website-global-styles.scss'

/* import css for editmode */
import './assets/styles/editmode.css'
/* end imports from comand-ui-website ---------------------------------------------------------------------------------------- */

import {bootstrapAndMount} from "./index.js";

const app = createApp(App)

bootstrapAndMount(app)
