import axios from 'axios'

const URL = 'http://localhost:8081/api/'

export const register = (data: any) => {
    let url = `${URL}register`
    return axios.post(url, data)
}

