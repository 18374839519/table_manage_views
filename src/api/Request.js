import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8080'
axios.defaults.headers.post['Content-Type'] = 'application/json'

/* axios get */
export function get(url) {
  return function(params) {
    const addr = params ? url + '/' + params : url
    return axios.get(addr).then(res => {
      return res.data
    }).catch(e => {
      console.log(e)
    })
  }
}

/* axios post */
export function post(url) {
  return function(params) {
    return axios.post(url, params).then(res => {
      return res.data
    }).catch(e => {
      console.log(e)
    })
  }
}
