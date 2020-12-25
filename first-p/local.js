const LocalStrategy = require('passport-local').Strategy
const passport = require('passport')
const DB = require('./config.js')

passport.serializeUser((user, done) => {
    done(null, user.login)
})

passport.deserializeUser(async (login, done) => {
    try {
        const get_login = await DB.promise().query(
            `SELECT * FROM users WHERE login = '${login}'`
        )
        if (get_login[0][0]) {
            done(null, get_login[0][0])
        }
    } catch (error) {
        done(err, null)
    }
})

const passportInit = (req, res, next) => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'login',
                passwordField: 'passwd',
            },
            async (login, pass, done) => {
                console.log('authorize')
                try {
                    const get_login = await DB.promise().query(
                        `SELECT * FROM users WHERE login = '${login}'`
                    )
                    if (get_login[0][0].length === 0) {
                        done(null, false)
                    } else {
                        if (get_login[0][0].pass === pass) {
                            done(null, get_login[0][0])
                        } else {
                            done(null, false)
                        }
                    }
                } catch (err) {
                    done(err, false)
                }
            }
        )
    )

    next()
}

module.exports = {
    passportInit,
}
