import axios from 'axios'
import { get } from 'lodash'

const instance = axios.create()

instance.interceptors.response.use(
    function(response) {
        return response.data
    },
    function(error) {
        const errMsg = get(error, 'response.data.message')
        return Promise.reject(errMsg)
    }
)

export default instance
