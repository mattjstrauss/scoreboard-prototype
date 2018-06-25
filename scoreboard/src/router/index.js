import Vue from 'vue'
import Router from 'vue-router'

import _ from 'lodash';

Vue.use(Router)

import Welcome from '@/pages/Welcome'
import Players from '@/pages/PlayerList'
import CreatePlayer from '@/pages/AddPlayer'
import ChallengeList from '@/pages/ChallengeList'
import CurrentMatch from '@/pages/CurrentMatch'

export default new Router({
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: Welcome
    },
    {
    	path: '/player-list',
    	name: 'player-list',
		  component: Players
    },
    {
    	path: '/create-player',
    	component: CreatePlayer
    },
    {
    	path: '/challenge',
    	name: 'challenge-list',
    	component: ChallengeList
    },
    {
      path: '/current-match',
      name: 'current-match',
      component: CurrentMatch,
    },
  ]
})
