module.exports = (err, req, res, next) => res.status(400).json({ 
   debug: err.message
})