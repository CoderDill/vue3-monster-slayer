import HomeMonsterSlayer from './views/HomeMonsterSlayer.vue'
import NotFound from './views/NotFound.vue'

export const routes = [
  { path: '/', component: HomeMonsterSlayer, meta: { title: 'HomeMonsterSlayer' }},
  { path: '/:pathMatch(.*)*', component: NotFound, meta: { title: 'Page not found' }},
]
