import Vue from 'vue'
import Router from 'vue-router'
import PlayerForm from '@/components/PlayerForm'

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
