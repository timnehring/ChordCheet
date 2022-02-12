import Vue from 'vue'
import VueRouter from 'vue-router'
import ActiveSong from '../views/ActiveSong.vue'
import AddEditSong from '../views/AddEditSong.vue'
import SettingsPage from '../views/SettingsPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/activesong',
    name: 'Active Song',
    component: ActiveSong,
  },
  {
    path: '/activesong/:songID',
    name: 'Active Song ID',
    component: ActiveSong,
    props: true
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsPage
  },
  {
    path: '/song/:addEdit',
    name: 'Add Edit Song',
    component: AddEditSong,
    props: true
  },
  {
    path: '/song/:addEdit/:songID',
    name: 'Add Edit Song ID',
    component: AddEditSong,
    props: true
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
