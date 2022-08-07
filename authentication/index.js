const User = require('../models/user');
const localStrategy = require('./strategies/local');

module.exports = (passport) => {

    passport.use(localStrategy)

    passport.serializeUser((user, callback) => {
        console.log('Serializing...');
        callback(null, user.id)
    })
    
    passport.deserializeUser(async (id, callback) => {
        try {
            console.log('deserializing...');
            const user = await User.findOne({
                _id: id
            })
            user.user_id = user._id
            return callback(false, user)            
        } catch (error) {
            return callback(error, false) 
        }
    })
}