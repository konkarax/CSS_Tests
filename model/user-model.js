const {MongoClient} = require('mongodb')
const url="mongodb+srv://grt2000:grt2000st3@cluster0.4px4edr.mongodb.net/test";
const client=new MongoClient(url);



async function login(username,password){
    const conn = await client.connect();
    const db = conn.db("waste_managment")
    console.log("in model: ", username,password)
    // if (!username || !password)
    //     throw new Error("Missing username or password")
    
    const collection = db.collection("users")
    // console.log("after collection")
    user = await collection.find({"username":username}).toArray();
    console.log('model: user',user[0])
    
    if (!user){
        throw new Error("User " + username + " doesn't exist")
    }
    console.log(password,user[0].password)
    // const match = await bcrypt.compare(password, user[0].password)
    // console.log(match)
    console.log("match")
        return user[0]
    // if (match){
    //     console.log("match")
    //     return user[0]
    // }
    // else{
    //     throw new Error("Wrong credentials")
    // }
}

async function getUserInfo(username){
    try{
        const user = await User.findAll({
        where: { username: username },
        raw: true
    })
        return user
    }catch (error) {
        throw error
    }
}


module.exports =  { login,
                    getUserInfo}