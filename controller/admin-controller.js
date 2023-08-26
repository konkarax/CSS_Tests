const Admin = require('../model/admin-model.js'); 


const checkIfAuthenticatedAdmin = async(req, res, next) => { //dinoume access ston admin gia tis selides tou
    
    if(req.session.username == 'admin'){
        next()
    }
    else{
        res.render("error", {message: "Wrong Credentials, access denied!"})
    }
}


const totalBins = async(req,res,next)=>{
    try{
        const binsNum = await Admin.getBins()
        console.log("controller-bins:", binsNum)
        console.log("controller-id:", req.query.scenarioId)

        if (req.query.scenarioId){
            console.log("Scenario statistics was selected")
            // req.query.scenId=req.query.scenarioId
            req.query.bins = binsNum
            next()
        }
        else{
            console.log("Access to admin page")
            res.render("admin",{bins:binsNum})
        }

    }catch(error){
        throw error
        }
}

const getStatistics = async (req, res, next) => {
    try {
        
        const binsNum = req.query.bins
        const scenarioId = req.query.scenarioId
        console.log("scenario Id in getStatistics: ", scenarioId)

        const binsData = await Admin.getBinsData(scenarioId)

        const loadData = binsData.loads
        const humidityData = binsData.humidity
        const tempData = binsData.temperature
        console.log('controller: bins',binsData)
        console.log('controller: load',loadData)
        console.log('controller: humidity',humidityData)

        
        res.render("admin",{bins:binsNum, binsLoad:JSON.stringify(loadData), binsHumidity:JSON.stringify(humidityData),binsTemp:JSON.stringify(tempData)}) 

    } catch (error) {
        next(error);
    }
};



// const findAllUsers = async (req, res, next) => {
//     const users = await seqObj.User.findAll()
//     const sanitized_users = users.map( entry => entry.dataValues)
//     req.users = sanitized_users
//     next()
// }

// const adminDoAddUser = async (req, res, next) => {
//     try{
//         console.log(req.body)

//         await Admin.addUser({
//             // "userID": req.body["userID"],
//             "firstName": req.body["firstName"],
//             "lastName": req.body["lastName"],
//             "email":req.body["email"],
//             "address": req.body["address"],
//             "phone_number": req.body["phone_number"],
//         })
//         console.log("perase")
//         res.locals.message = 'User Added!'
//         // req.message = 'User Added!'
//         next()
//     } catch(error){
//             res.locals.message = 'Failed to add User'
//         // req.message = 'Failed to add User!'
//     }
// }

// const adminDeleteUser = async(req, res, next) => {
//     try{

//         await Admin.deleteUser(req.query["userID"])
//         req.message = 'User successfully deleted!'
//         next()
//     } catch(error){
//         req.message = 'Failed to delete user!'

//     }
// }

// const findAllBookings = async (req, res, next) => {
//     const bookings = await Admin.showReservations()
//     req.bookings = bookings
//     next()
// }

// const adminDoAddBooking = async (req, res, next) => {
//     try {
//         await Admin.addReservation({
//             "check_in_date": req.body["check_in_date"],
//             "check_out_date": req.body["check_out_date"],
//             "total_price": req.body["total_price"],
//             "guests_count": req.body["guests_count"],
//             "status": "completed",
//             "paymentMethod": req.body["paymentMethod"],
//             "UserUserID": req.body["userID"],
//             "RoomRoomID":req.body["roomID"]
//         })
//         req.message = 'Booking Added!'
//         next()
//     } catch(error){
       
//         // throw error
//         req.message = 'Failed to add Booking!'
//         next()
//     }
// }

// const getBookingInfo = async (req, res, next) => {
//     try{
//         const reservationID = req.query.reservationID //pernoume to reservationID sto opoio 
//         //o admin thelei na kanei kapoio edit 
//         const bookingInfo = await Admin.findReservation(reservationID) //dinoume to reservationID gia na vroume 
//         //ta upoloipa stoixeia tis kratisis kai to roomID sto opoio anaferetai 
//         console.log("Booking Info after findReservation:", bookingInfo)

//         const resInfo = {
//             reservationID: bookingInfo.resInfo.reservationID,
//             check_in_date: bookingInfo.resInfo.check_in_date,
//             check_out_date: bookingInfo.resInfo.check_out_date,
//             total_price: bookingInfo.resInfo.total_price,
//             guests_count: bookingInfo.resInfo.guests_count,
//             paymentMethod: bookingInfo.resInfo.paymentMethod,
//             userID: bookingInfo.resInfo.UserUserID,
//             roomID: bookingInfo.roomID
//         }
//         console.log("resInfo:",resInfo)
//         req.bookingInfo = resInfo
//         // return req.bookingInfo
//         next()
//     }catch(error){
//         // req.message = 'Error'
//         next(error)
//     }
// }

// const adminDeleteBooking = async (req, res, next) => {
//     try {
//       const reservationID = req.query.reservationID;
//       await Admin.deleteReservation(reservationID);
//       req.message = 'Booking successfully deleted!';
//       next();
//     } catch (error) {
//       req.message = 'Failed to delete booking!';
//       next();
//     }
//   };
  
// const adminDoEditBooking = async (req, res, next) =>{
//     try {
//         // console.log(req.query.reservationID)
     
//         await Admin.updateReservation({
//             "reservationID": req.query.reservationID,
//             "check_in_date": req.body["check_in_date"],
//             "check_out_date": req.body["check_out_date"],
//             "total_price": req.body["total_price"],
//             "guests_count": req.body["guests_count"],
//             "paymentMethod": req.body["paymentMethod"],
//             "UserUserID": req.body["userID"],
//             "RoomRoomID":req.body["roomID"]
//         })
    
//         req.message = 'Booking Updated!'
//         next()
//     } catch(error){
       
//         // throw error
//         req.message = 'Failed to update Booking!'
//         next()
//     }
// }

module.exports = {
    // findAllUsers,
    // adminDoAddUser,
    // adminDeleteUser,
    // findAllBookings,
    // adminDoAddBooking,
    // getBookingInfo,
    // adminDeleteBooking,
    // adminDoEditBooking,
    checkIfAuthenticatedAdmin,
    totalBins,
    getStatistics,
  };