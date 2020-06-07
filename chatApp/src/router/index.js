import Vue from 'vue'
import Router from 'vue-router'
import ViewUI from 'view-design';
import Index from '@/components/Index'
import Chat from '@/components/Chat'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Interface from '@/components/Interface'
import 'view-design/dist/styles/iview.css';
Vue.use(Router)
Vue.use(ViewUI)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      redirect:'/login',
      children:[
        {
          path:'/login',
          name:'Login',
          component:Login
        },
        {
          path:'/register',
          name:'Register',
          component:Register
        },
      ]
    },
    {
      path:'/chat',
      name:'Chat',
      component:Chat,
      children:[
        {
          path:'/interface',
          name:'Interface',
          component:Interface
        }
      ]
    }
  ]
})
