const router = require('express').Router()
const { staticControllers } = require('../controllers')
const validator = require('../middleware')
const validateToken = validator.authenticateToken
const signupValidate = [ validator.signupValidator, validator.validate ]
const loginValidate = [ validator.loginValidator, validator.validate ]
const updateProfile = [ validator.updateProfileValidator, validator.validate ]
const updatePasswordProfile = [ validator.updatePasswordValidator, validator.validate ]

router.post('/signup', ...signupValidate, staticControllers.signup)
router.post('/login', ...loginValidate, staticControllers.login)
router.post('/facebookLogin',staticControllers.facebookLogin)
router.get('/requestProfile', validateToken, staticControllers.requestProfile)
router.put('/updateProfile', ...updateProfile, validateToken, staticControllers.updateProfile, ...updatePasswordProfile, staticControllers.updatePasswordProfile)

module.exports = router