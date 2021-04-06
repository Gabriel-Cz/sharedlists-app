import router from "../../router"
import axios from 'axios'
import decode from 'jwt-decode'

const state = () => ({
    token: localStorage.getItem('token') || '',
    userDB: '',
    userInput: {
      email: '',
      password: ''
    },
    newUserInput: {
      name: '',
      email: '',
      password: '',
    },
})

const mutations = {
    setNewUserInput(state, payload) {
      state.newUserInput = payload
    },
    setUserInput(state, payload) {
      state.userInput = payload
    },
    setUser(state, payload) {
        state.newUser = payload
    },
    getUser(state, payload) {
        state.token = payload
        if(payload === '') {
            state.userDB = ''
        } else {
            state.userDB = decode(payload)
            router.push({
                path: '/user/:id'
            })
        }
    },
    cleanUserInput(state) {
      state.userInput.email = "";
      state.userInput.password = "";
    },
    cleanNewUserInput(state) {
      state.newUserInput.name = "";
      state.newUserInput.email = "";
      state.newUserInput.password = "";
    }
}

const actions = {

    registerUser({commit, state, dispatch}, payload) {
        return new Promise((resolve) => {
          payload = state.newUserInput;
          axios.post('/users/new-user', payload)
          setTimeout(() => {
            dispatch('loginUser', {email: payload.email, password: payload.password})
            setTimeout(() => {
               commit('cleanNewUserInput');
            }, 100)
          }, 200)
          resolve();
        })
    }, 

    loginUser({commit, dispatch}, user) {
        axios.post('/login', user)
         .then(res => {
           let token = res.data.token;
           dispatch('saveUser', token)
           console.log(token)
           router.push({
             path: '/user/' + user.name 
           });
           setTimeout(() => {
            commit('cleanUserInput');
           }, 200)
         })
         .catch(err => {
           console.log(err);
       })
    },

    saveUser({commit}, token) {
        localStorage.setItem('token', token);
        commit('getUser', token);
    },

    signOut({commit}) {
        commit('getUser', '');
        localStorage.removeItem('token');
        setTimeout(() => {
          router.push({
            name: 'Register'
          });
        }, 200)
    },
}

const getters = {
    isActive: state => !!state.token,
    cleanNewUserInput: (state) => {
      return state.newUserInput = "";
    },
    cleanUserInput: state => state.cleanUserInput = {}
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  }