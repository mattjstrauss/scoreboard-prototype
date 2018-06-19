import Vue from 'vue'
import Router from 'vue-router'
import PlayerForm from '@/components/PlayerForm'
import _ from 'lodash';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'PlayerForm',
      component: PlayerForm
    }
  ]
})
