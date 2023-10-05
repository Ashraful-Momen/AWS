//import express 
const express = require('express')
const axios = require('axios') 


const app = express()
const port = 3000

app.get('/',(req,res)=>{
    res.send("Hello Aws guru")
})

//for axios todos=> 
app.get('/todos',async(req,res)=>{
    const resp = await axios.get('https://jsonplaceholder.typicode.com/todos')
    res.send(resp.data)
})

app.listen(port,()=>{
    console.log("Express app listen on port: ",port);
})

