const express = require('express');
const router = require('./routes.js')
const session = require('express-session')
const { engine } = require('express-handlebars');
// const createMemoryStore = ('memorystore')


// const MemoryStore = createMemoryStore(session)


// const WasteManagementSession = session({
//     secret: process.env.SESSION_SECRET || '05afd00f3d330e4e1c10ca0227de6c29241dd2aa7495601ab53354722f5558ca',
//     store: new MemoryStore({ checkPeriod: 86400 * 1000 }), //ana 24 wres o server mas tha svinei tis sinedries pou exoun liksei
//     //(an leitourgei 24 wres)
//     resave: false,
//     saveUninitialized: false,
//     name: "HotelRes-sid", // an den to orisoume connect.sid = onoma sto cookie wste na isxuei gia auth thn efarmogh tou hostname
//     cookie: {
//         maxAge: 1000 * 60 * 20 // 20 λεπτά
//     }
// });


const app = express();
const PORT = process.env.PORT || 5000;
//sessions
// app.use(WasteManagementSession);

//static files
app.use(express.static("public"));
//handlebars
app.use(express.urlencoded({extended:false}));
app.engine(".hbs", engine({extname:".hbs"}));
app.set("view engine",".hbs");


app.use("/",router)


app.listen(PORT, console.log(`Server started on port ${PORT}`));
