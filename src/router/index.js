import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login/Login'
import SubRouter from '@/components/SubRouter'
import Admin from '@/components/Admin/Admin'
import LiveRun from '@/components/LiveRun/LiveRun'
import Race from '@/components/LiveRun/Race'
import RaceResume from '@/components/LiveRun/RaceResume'
import AddRace from '@/components/Races/Create'
import Races from '@/components/Races/List'
import UpdateRace from '@/components/Races/Update'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/admin/live-run'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/admin',
      component: Admin,
      meta: {auth: true},
      children: [
        {
          path: 'live-run',
          component: SubRouter,
          children: [
            {
              path: '/',
              component: LiveRun
            },
            {
              path: 'race/:raceId',
              component: Race
            },
            {
              path: 'race/:raceId/resume',
              component: RaceResume
            }
          ]
        },
        {
          path: 'races',
          component: SubRouter,
          children: [
            {
              path: '/',
              component: Races
            },
            {
              path: 'add',
              component: AddRace
            },
            {
              path: 'edit/:raceId',
              component: UpdateRace
            }
          ]
        }
      ]
    },
    {
      path: '*',
      redirect: {path: '/admin'}
    }
  ]
})
