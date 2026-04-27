import { createApp } from 'vue'
import 'bulma/css/bulma.min.css'
import '@fortawesome/fontawesome-free/css/all.css'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
