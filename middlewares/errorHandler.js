const { errorFormatter } = require('../helpers')

module.exports = (error, req, res, next) => {
  const lang = req.headers["accept-language"] || 'en'
  
  if (error?.details && Array.isArray(error.details))
    return res.status(400).json({
      // errors: error.details.map(({ type, path, context }) => errorFormatter(type, path, context, lang)),
      errors: [...error.details],
      // debug: [...error.details],
    })

  if (error instanceof SyntaxError)
    return res.status(400).json({
      errors: [
        "Syntax Error, Invalid Input."
      ],
    })

  return res.status(400).json({
    debug: error.message,
  })
}
