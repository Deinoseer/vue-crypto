import Vue from 'vue/dist/vue.js';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/ru-RU';
import 'element-ui/lib/theme-chalk/index.css';
import Components from './components/index';
import _ from 'lodash';

Vue.use(ElementUI, {locale});

window.Vue = Vue;

_.each(Components, (component, componentCode) => {
    Vue.component(componentCode, component);
});

new Vue({ el: '#app' });



