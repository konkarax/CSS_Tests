const User = require('../model/user-model.js');

const doLogin = async (req, res, next) => {
    try{
        console.log("in doLogin")
        const user = await User.login(req.body.username, req.body.password)
        console.log("controller-user:",user)
        next()
    }catch(error){
        res.render("loginForm", {message: error})
    }
   
}


const doLogout = (req, res, next) => {
    req.session.destroy() 
    next()
}

function checkIfAuthenticated(req, res, next) {
    
    if (req.session.username) {
        res.locals.username = req.session.username
    }
    
    
    next() 
}


async function userGetInfo(req, res, next){

    const info = await User.getUserInfo(req.session.username)
    res.locals.email = info[0].email
    res.locals.phone_number = info[0].phone_number
    req.session.userID = info[0].userID
    next()

}


module.exports =  { 
    doLogin, 
    checkIfAuthenticated, 
    doLogout, 
    userGetInfo, 
}