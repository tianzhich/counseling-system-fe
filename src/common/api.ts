import axios from 'axios'

const URL = `${window.location.origin}/api/`;

export const signup = (data: any) => {
    let url = `${URL}signup`
    return axios.post(url, data)
}

