const router = require('express').Router()
const { answerControllers } = require('../controllers')
const validator = require('../middleware')
const validateToken = validator.authenticateToken
const answerValidator = [ validator.answerValidator, validator.validate ]

router.post('/', validateToken, ...answerValidator, answerControllers.addAnswer)
router.get('/:postId', answerControllers.getAllAnswer)
router.put('/addupvote/:id',validateToken, answerControllers.addUpvote)
router.put('/removeupvote/:id',validateToken,answerControllers.removeUpvote)
router.put('/adddownvote/:id',validateToken, answerControllers.addDownvote)
router.put('/removedownvote/:id',validateToken,answerControllers.removeDownvote)
router.put('/:id', validateToken, ...answerValidator, answerControllers.updateAnswer)
router.delete('/:id', validateToken, answerControllers.deleteAnswer)

module.exports = router