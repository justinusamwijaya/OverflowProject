module.exports = {
    generateRandomUser(){
        let randomString = ''
        let numbers = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
        while(randomString.length < 10){
            randomString += numbers[ Math.round(Math.random()*(numbers.length-1)) ]
        }
        return 'User' + randomString + numbers[ Math.round(Math.random()*9) ]
    },
}