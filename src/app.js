const express = require('express');
const app = express();
app.use("/shakti",(req,res)=>{
    res.send("you;he appeared on the shakti's page ");
})
app.use((req,res)=>{
    res.send("hello from the server!");
})
app.listen(3000,(req,res)=>{
    console.log("server is listening on port 3000");
}) 






