const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const localStrategy = require('passport-local').Strategy;


module.exports = new localStrategy(async (username, password, done) => {
    try {        
        console.log('Finding User...');
        const foundUser = await User.findOne({ username })
        if(!foundUser) done(null, false)
        const isMatch = bcrypt.compareSync(password, foundUser.password)
        if(!isMatch) return done(null, false)
        return done(null, foundUser)
    } catch (error) {
        throw error
    }
})