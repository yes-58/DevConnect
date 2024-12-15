const express = require('express');

const app = express(); //instance of expressjs application


app.listen(3000,()=>{
    console.log("Server is listening successfully on port 3000");
});