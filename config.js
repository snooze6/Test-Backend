/**
 * Created by snooze on 4/23/16.
 */
module.exports = {
    'this': process.env.this || 'localhost',
    'api': process.env.api || '/api/v1',
    'secretKey': process.env.secret || 'secret',
    'mongoUrl' : process.env.mongoUrl || 'mongodb://localhost:27017/testerz',
    'facebook': {
        clientID: process.env.fclient || 'fclient',
        clientSecret: process.env.fsecret || 'fsecret',
        callbackURL: process.env.fcallback || 'https://localhost:3443/users/login/facebook/callback'
    },
    'port': process.env.port || 3000
}