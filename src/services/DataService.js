import axios from 'axios'

const credentials = {
  username : "apitest@broccoli.ae",
  password : "test1234"
}
//axios.defaults.baseURL = '/api/';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';



export default {
  get (url) {
    return new Promise((resolve, reject) => {
      axios.get(url)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },

  post (url) {
    return new Promise((resolve, reject) => {
      axios.post(url)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },

  applyMiddleWare(token) {
    
    axios.defaults.headers.common['Authorization'] = "Bearer " + token;

    axios.interceptors.request.use(function (config) {
      // Do something before request is sent  
      return config;
    }, function (error) {
    // Do something with request error
      return Promise.reject(error);
    });
  },

  auth () {
    const url = '/api/auth/login/' + '?email=' + credentials.username 
    + '&password=' + credentials.password

    return new Promise((resolve, reject) => {
      axios.post(url)
        .then(response => {
          return resolve(response.data.token);
        })
        .catch(response => {
          return reject(response)
        });         
    })
  }

}