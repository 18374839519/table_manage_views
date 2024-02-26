import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-plus'
import 'element-plus/dist/index.css'
import CommonCss from '@/assets/css/Common.css'

createApp(App).use(store).use(router).use(ElementUI).use(CommonCss).mount('#app')
