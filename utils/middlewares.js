const errorHandler = (err,req,res,next) => {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message })
    } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'invalid token'
        });
    }
    next(err)
}

const tokenExtractor = (req,res,next) => {
    const authorization = req.get('authorization');

    req.token = (authorization && authorization.toLowerCase().startsWith('bearer ')) ? authorization.substring(7) : null; 
    next();
}

module.exports = {
    errorHandler,
    tokenExtractor
}