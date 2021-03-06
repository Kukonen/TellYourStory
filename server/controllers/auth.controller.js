const bcrypt = require('bcryptjs')
const User = require('../models/User')
const uuid = require('uuid')

class authController {
    async register(ctx) {
        const {name, email, password} = ctx.request.body
        if (email.indexOf('@') === -1) {
            ctx.throw(400, "Email value is not email")
        }
        const user = await User.findOne({email})
        if (user) {
            ctx.throw(400, "Email already exists")
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const key = uuid.v4()
        const id = uuid.v4()
        await new User({id, key, email, name, password: hash, avatar: undefined}).save()
            .then()
            .catch(e => {
                console.log(e)
                ctx.throw(501, "User can't create")
            })
        ctx.cookies.set('key', key, {httpOnly: true})
        ctx.status = 201
        ctx.body = {
            "name": name
        }
    }

    async login(ctx) {
        const {email, password} = ctx.request.body
        const user = await User.findOne({email})
        if (!user)
            ctx.throw(400, "User with this email does not exist")
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (passwordMatch) {
            ctx.cookies.set('key', user.key, {httpOnly: true})
            ctx.status = 200
            ctx.body = {
                "name": user.name,
                "avatar": user.avatar
            }
        } else {
            ctx.throw(400, "Password does not match")
        }
    }
}

module.exports = new authController();