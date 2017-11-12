import {router} from '../index'
// api root
const API_URL = 'http://localhost:3001/'
// where to start a session. Starting with only login: JM
const LOGIN_URL = API_URL + 'sessions/create/'
// directory for new users
// const SIGNUP_URL = API_URL + 'users/'
// directories for new exercises
const RETURN_EXERCISES_URL = API_URL + 'api/protected/exercises-return/'
const CREATE_EXERCISE_URL = API_URL + 'api/protected/exercise-create/'
const UPDATE_EXERCISE_URL = API_URL + 'api/protected/exercise-update/'
const DELETE_EXERCISE_URL = API_URL + 'api/protected/exercise-delete/'

export default {
  // default auth to false. user must log in each session
  user: {
    authenticated: false,
    admin: false
  },
  // get all exercises on load to reduce calls only to updates to the db
  exercises: [],
  // login function. creds is object with un and pw. redir is optional.
  login(context, creds, redirect) {
    // if creds match data then set auth to true and redir. Else error
    context.$http.post(LOGIN_URL, creds, (data) => {
      localStorage.setItem('id_token', data.id_token)

      this.user.authenticated = true

      // is user an admin?
      // get token with user info
      let encodedToken = data.id_token.split(".")[1]
      // decode user info for admin
      let decodedToken = atob(encodedToken)
      // parse into json
      let tokenObj = JSON.parse(decodedToken)
      // does the token contain information about being an admin
      if(tokenObj.admin === 1){
        this.user.admin = true
      }

      // if redirecting, send to that page using router
      if(redirect) {
        router.go(redirect)
      }

    }).error((err) => {
      context.error = err
    })
  },
  /* removing. possibly temporarily -JM
  signup(context, creds, redirect) {
    context.$http.post(SIGNUP_URL, creds, (data) => {
      localStorage.setItem('id_token', data.id_token)

      this.user.authenticated = true

      if(redirect) {
        router.go(redirect)
      }

    }).error((err) => {
      context.error = err
    })
  },
  */
  // removes user token and sets auth to false
  logout() {
    localStorage.removeItem('id_token')
    this.user.authenticated = false
    this.user.admin = false
  },
  // runs to double-check user is authd to perform an action
  checkAuth() {
    var jwt = localStorage.getItem('id_token')
    if(jwt) {
      this.user.authenticated = true
    }
    else {
      this.user.authenticated = false
      this.user.admin = false
    }
  },

  getAuthHeader() {
    return {
      'Authorization': 'Bearer ' + localStorage.getItem('id_token')
    }
  },

  // return all exercises
  getExercises(context, callback){
    // send params
    context.$http.post(RETURN_EXERCISES_URL, (data) => {
      this.exercises = data
      if(callback){
        callback()
      }
    }, {
      headers: this.getAuthHeader()
    }).error((err) => {
      context.error = err
      console.log(err)
    })
  },

  filterExercises(filters) {
    var context = this;
    var filteredExercises = [];
    // return all exercises if missing or empty filters
    if(!filters
      || (!filters.search
      && !filters.types[0].status
      && !filters.types[1].status
      && !filters.types[2].status
      && !filters.types[3].status
      && !filters.types[4].status
      && !filters.types[5].status
      && !filters.types[6].status
    )) {
      return context.exercises
    }
    var searchLower = filters.search.toLowerCase()
    for(var i = 0; i < context.exercises.length; i++){
      if((searchLower.length == 0 ||
        context.exercises[i].name.toLowerCase().search(searchLower) !== -1) &&
        ((!filters.types[0].status &&
          !filters.types[1].status &&
          !filters.types[2].status &&
          !filters.types[3].status &&
          !filters.types[4].status &&
          !filters.types[5].status &&
          !filters.types[6].status) ||
          ((filters.types[0].status && (context.exercises[i].types.indexOf('Legs') != -1)) ||
          (filters.types[1].status && (context.exercises[i].types.indexOf('Back') != -1)) ||
          (filters.types[2].status && (context.exercises[i].types.indexOf('Chest') != -1)) ||
          (filters.types[3].status && (context.exercises[i].types.indexOf('Shoulders') != -1)) ||
          (filters.types[4].status && (context.exercises[i].types.indexOf('Arms') != -1)) ||
          (filters.types[5].status && (context.exercises[i].types.indexOf('Core') != -1)) ||
          (filters.types[6].status && (context.exercises[i].types.indexOf('Cardio') != -1))))) {
            filteredExercises.push(context.exercises[i])
        }
    }

    return filteredExercises
  },

  createExercise(context, newExerciseData) {
    // set proxy for this to update exercises after removal
    var contextProxy = this

    if(this.user.admin){
      // get concatonated encoded tokens
      newExerciseData.append('token', localStorage.getItem('id_token'))

      context.$http.post(CREATE_EXERCISE_URL, newExerciseData, (data) => {
        console.log("added to database succesfully")
        // add new exercise to display of existing exercises
        contextProxy.getExercises(context)
      }, {
        headers: this.getAuthHeader()
      }).error((err) => {
        context.error = err
        console.log(err)
      })
    }
  },

  updateExercise(context, exerciseDetail) {
    // set proxy for this to update exercises after removal
    var contextProxy = this

    if(this.user.admin) {
      // get concatonated encoded tokens
      exerciseDetail.append('token', localStorage.getItem('id_token'))

      // update exercise in database with edits
      context.$http.post(UPDATE_EXERCISE_URL, exerciseDetail, (data) => {
        console.log("updated database succesfully")
        // update exercises to display current exercises
        contextProxy.getExercises(context)
      }, {
        headers: this.getAuthHeader()
      }).error((err) => {
        context.error = err
        console.log(err)
      })
    }
  },

  deleteExercise(context, exerciseId) {
    if(this.user.admin) {
      // set id of user to variable
      var reqData = {
        token: localStorage.getItem('id_token'),
        id: exerciseId
      }

      // set proxy for this to update exercises after removal
      var contextProxy = this

      // remove exercise from database
      context.$http.post(DELETE_EXERCISE_URL, reqData, (data, res) => {
        console.log("removed from database succesfully")
        // remove deleted exercise to view of existing exercises
        contextProxy.getExercises(context)
      }, {
        headers: this.getAuthHeader()
      }).error((err) => {
        context.error = err
        console.log(err)
      })
    }
  }
}
