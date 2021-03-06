import {makeAutoObservable} from "mobx";
import axios from "axios";
import user from './UserState'

class AuthState {
    constructor() {
        makeAutoObservable(this)
    }

    loginERROR = false;
    registerERROR = false;

    async login(email, password) {
        let status = {}
        let data = {}
        await axios.post('/api/auth/login', {
            "email": email,
            "password": password
        }).then(response => {
            status = JSON.parse(JSON.stringify(response.status))
            data = JSON.parse(JSON.stringify(response.data))
        }).catch(e => {
            this.loginERROR = true;
            console.log(e)
        })
        if (status === 200) {
            user.name = data.name
            user.avatar = data.avatar
            user.isLogged = "yes"
            window.location.href = '/'
        }
    }

    async register(name, email, password) {
        let status = {}
        let data = {}
        await axios.post('/api/auth/register', {
            "name": name,
            "email": email,
            "password": password
        }).then(response => {
            status = JSON.parse(JSON.stringify(response.status))
            data = JSON.parse(JSON.stringify(response.data))
        }).catch(e => {
            this.registerERROR = true;
            console.log(e)
        })
        if (status === 201) {
            user.name = data.name
            user.avatar = undefined
            user.isLogged = "yes"
            window.location.href = '/'
        }
    }
}

export default new AuthState();