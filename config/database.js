const mongoose = require('mongoose');
mongoose.set("strictQuery",true);

uri = "mongodb+srv://dbuser:dbuser@devconnectdb.bx5eg.mongodb.net/devconnectdb?retryWrites=true&w=majority appName=DevConnectDB"

async function connectToMongoDb() {
    await mongoose.connect(uri,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        writeConcern: { w: "majority" },
    })
}

module.exports = connectToMongoDb ;