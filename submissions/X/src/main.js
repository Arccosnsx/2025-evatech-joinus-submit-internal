import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faPlus,
    faList,
    faTable,
    faGrip,
    faEye,
    faFilter,
    faSearch,
    faArrowRight,
    faArrowLeft,
    faLock
} from '@fortawesome/free-solid-svg-icons'
import { faExclamationTriangle, faBell, faCheck } from '@fortawesome/free-solid-svg-icons'
library.add(faPlus, faList, faTable, faGrip, faEye, faExclamationTriangle, faBell, faCheck, faFilter, faSearch, faArrowLeft, faLock, faArrowRight)
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
