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
            res.redirect("/admin")
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

//------------------Drivers--------------------//


//------------------Admin-----------------//
router.get("/admin", 
    UserController.checkIfAuthenticated,
    AdminController.checkIfAuthenticatedAdmin,
    AdminController.totalBins
)

router.get("/admin/statistics",
    UserController.checkIfAuthenticated,
    AdminController.checkIfAuthenticatedAdmin,
    AdminController.totalBins,
    // AdminController.IntervalStatistic,
    // RoutesController.getScenario,
    AdminController.getStatistics
    
    
)

router.get("/admin/predictions",
    UserController.checkIfAuthenticated,
    AdminController.checkIfAuthenticatedAdmin,
    AdminController.totalBins,
    AdminController.getStatistics,
    // RoutesController.getScenario,
    AdminController.getPredictions,

)



router.get("/profile",
    UserController.checkIfAuthenticated,
    (req,res, next) => {
        if(req.session.username == "admin"){            
            res.redirect("/admin")
        }
    next()},
    // UserController.userGetInfo,
    // UserController.userShowBookings,
    (req, res) => {
        res.render("userProfile")
    }
)

    
router.get("/addUser",     
    UserController.checkIfAuthenticated,
    AdminController.checkIfAuthenticatedAdmin,
    (req, res) => {
        console.log("in addUser after authenticated")
    res.render("addDriver")
})


//----------------Scenarios----------------//

router.get('/scenario',
    UserController.checkIfAuthenticated,
    AdminController.checkIfAuthenticatedAdmin,
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