const express = require('express');
const path = require('path');
const RoutesController = require('./controller/routes-controller.js');
const UserController = require('./controller/user-controller.js');
const AdminController = require('./controller/admin-controller.js');

const {MongoClient} = require('mongodb')
const url="mongodb+srv://grt2000:grt2000st3@cluster0.4px4edr.mongodb.net/test";
const client=new MongoClient(url);

const router = express.Router()

//-----------------home---------------------//
router.get("/",(req, res) => {
    UserController.checkIfAuthenticated,
    res.redirect("/home")
})

router.get("/home", 
    UserController.checkIfAuthenticated,
    (req, res)=>{
    res.render("home")
})


router.get("/login", (req, res) => {
    res.render("loginForm")
})

router.post("/dologin",
    UserController.doLogin,
    (req, res) => {
        console.log("here")
        req.session.username = req.body.username
        res.locals.username = req.session.username
        if(req.session.username === 'admin'){
            // AdminController.getStatistics
            res.render("admin")
        }
        else{
            res.render("home")
        }
        
    }
)

router.get("/logout", UserController.doLogout, 
    (req, res) => {
    res.redirect("/")
})

//------------------Admin-----------------//
router.get("/admin", 
    UserController.checkIfAuthenticated,
    AdminController.checkIfAuthenticatedAdmin,
    // AdminController.getStatistics
)

router.get("/profile",
    UserController.checkIfAuthenticated,
    (req,res, next) => {
        if(req.session.username == "admin"){
            res.redirect("/admin")
        }
    next()},
    UserController.userGetInfo,
    // UserController.userShowBookings,
    (req, res) => {
        res.render("userProfile")
    }
)

// router.get("/adminShowUsers", 
//     UserController.checkIfAuthenticated,
//     AdminController.checkIfAuthenticatedAdmin,  
//     AdminController.findAllUsers, 
//     (req,res) => {
//     res.render("adminShowUsers", {users: req.users})
// })

// router.get("/adminAddUser", (req, res) => {
//     UserController.checkIfAuthenticated,
//     AdminController.checkIfAuthenticatedAdmin,
//     res.render("adminAddUser")
// })

// router.post("/adminDoAddUser",
//     UserController.checkIfAuthenticated,
//     AdminController.checkIfAuthenticatedAdmin,
//     AdminController.adminDoAddUser,
//     AdminController.findAllUsers,
//     (req, res) => {
//         console.log(req.body),
//         res.render("adminShowUsers", { message: req.message, users: req.users })
//     }
// )

// router.get("/adminDeleteUser",
//     UserController.checkIfAuthenticated,
//     AdminController.checkIfAuthenticatedAdmin,
//     AdminController.adminDeleteUser,
//     AdminController.findAllUsers, 
//     (req,res) => {
//     res.render("adminShowUsers", { users: req.users })
// })

//show, add & delete bookings
// router.get("/adminShowBookings",
//     UserController.checkIfAuthenticated,
//     AdminController.checkIfAuthenticatedAdmin,
//     AdminController.findAllBookings, 
//     (req,res) => {
//     res.render("adminShowBookings", { bookings: req.bookings })
// })

// router.get("/adminAddBooking", (req, res) => {
//     UserController.checkIfAuthenticated,
//     AdminController.checkIfAuthenticatedAdmin,
//     res.render("adminAddBooking")
// })

// router.post("/adminDoAddBooking",
//     UserController.checkIfAuthenticated,
//     AdminController.checkIfAuthenticatedAdmin,
//     AdminController.adminDoAddBooking,
//     AdminController.findAllBookings,
//     (req, res) => {
//         res.render("adminShowBookings",{ message:req.message, bookings: req.bookings })
//     }
// )

// router.get("/adminDeleteBooking",
//     UserController.checkIfAuthenticated,
//     AdminController.checkIfAuthenticatedAdmin,
//     AdminController.adminDeleteBooking,
//     AdminController.findAllBookings, 
//     (req,res) => {
//     res.render("adminShowBookings", { bookings: req.bookings })
// })

// router.get("/adminEditBooking",
//     UserController.checkIfAuthenticated,
//     AdminController.checkIfAuthenticatedAdmin,
//     AdminController.getBookingInfo,
//     (req, res) => {
//         res.render("adminEditBooking", { bookingInfo: req.bookingInfo })
//     }
// )

// router.post("/adminDoEditBooking",
//     UserController.checkIfAuthenticated,
//     AdminController.checkIfAuthenticatedAdmin,
//     AdminController.adminDoEditBooking,
//     AdminController.findAllBookings,
//     (req, res) => {
//         res.render("adminShowBookings", { bookings: req.bookings })
//     }
// )


// router.get("/adminShowRooms",
//     UserController.checkIfAuthenticated,
//     AdminController.checkIfAuthenticatedAdmin,
//     AdminController.findAllRooms,
//     (req, res) => {
//         res.render("adminShowRooms", { rooms: req.rooms })
//     }
// )


//----------------Scenarios----------------//

router.get('/scenario',
    RoutesController.getScenario,
    async (req,res)=>{
        res.render("scenario");
})

router.get('/get_bins',async (req,res)=>{
    let result= await client.connect();
    let db = result.db("waste_managment");
    let data =  db.collection('bins');
    data = await data.find().toArray();
    res.send(data);
})

router.get('/get_trucks',async (req,res)=>{
    let result= await client.connect();
    let db = result.db("waste_managment");
    let data =  db.collection('trucks');
    data = await data.find().toArray();
    res.send(data);
})



module.exports = router;