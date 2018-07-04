const router = require('express').Router();
const staticRoutes = require('./staticRoutes.js');
const postRoutes = require('./postRoutes.js')
const answerRoutes = require('./answerRoutes.js')

router.use('/',staticRoutes)
router.use('/posts',postRoutes)
router.use('/answers',answerRoutes)


module.exports = router