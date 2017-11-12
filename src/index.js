import Vue from 'vue'
import App from './components/App.vue'
//import Home from './components/Home.vue'
import Workouts from './components/Workouts.vue'
//import Signup from './components/Signup.vue'
import WorkoutBuilder from './components/WorkoutBuilder.vue'
import Login from './components/Login.vue'
import store from './vuex/store'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
//import auth from './auth'
Vue.use(VueResource)
Vue.use(VueRouter)

// inject vuex store
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})

export var router = new VueRouter()

//Vue.http.headers.common['Authorization'] = auth.getAuthHeader()

//auth.checkAuth()

// Set up routing and match routes to components

router.map({
  /*
  '/home': {
    component: Home
  },
  '/secretquote': {
    component: SecretQuote
  },*/
  '/workoutBuilder': {
    component: WorkoutBuilder
  },
  '/login': {
    component: Login
  },
  '/workouts': {
    component: Workouts
  }
  /*,
  '/signup': {
    component: Signup
  }*/
})

// Redirect to the home route if any routes are unmatched
router.redirect({
  '*': '/workouts'
})

// Start the app on the #app div with vuex store
router.start(App, '#app')
