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

// const doRegister = async (req, res, next) => {

//     try {

//         if(req.body['password']!= req.body['password-confirm']){
//             throw new Error("The passwords don't match")
//         }

//         await User.addUser({
//             "username": req.body["username"],
//             "password": req.body["password"],
//             "firstName":req.body["firstName"],
//             "lastName":req.body["lastName"],
//             "email": req.body["email"],
//             "phone_number": req.body['phone'],
//             "role": "member"
//         })
//         next()
//     } catch (error) {
//         res.render("registrationForm",{message: error})
//     }
// }


const doLogout = (req, res, next) => {
    req.session.destroy() 
    next()
}

function checkIfAuthenticated(req, res, next) {
    if (req.session.username) { 
        res.locals.username = req.session.username
    }
    // console.log(req.session)
    next() //επόμενο middleware
}


async function userGetInfo(req, res, next){

    const info = await User.getUserInfo(req.session.username)
    // console.log("Info:",info)
    res.locals.email = info[0].email
    res.locals.phone_number = info[0].phone_number
    req.session.userID = info[0].userID
    next()

}

// async function userShowBookings(req,res,next){
    
//     const bookings = await User.userBookings(req.session.userID)
//     // console.log("bookings:",bookings)
//     res.locals.bookings = bookings
//     next()
// }

// async function cancelReservation(req,res,next){
//     try{
//         const bookingID = req.query.bookingID    
//         await User.updateStatus(bookingID)
//         next()
    
// }catch (error) {
//         next(error) 
//     }
// }

// async function removeRooms(req,res,next){
//     try{
//         const bookingID = req.query.bookingID    
//         await User.unbookRooms(bookingID)
//         next()
//     }catch (error) {
//             next(error) 
//         }
// }


module.exports =  { 
    // doRegister, 
    doLogin, 
    checkIfAuthenticated, 
    doLogout, 
    // userShowBookings, 
    userGetInfo, 
    // cancelReservation, 
    // removeRooms
}