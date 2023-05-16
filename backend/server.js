const express=require("express")
const app=express()
const routes = require('./src/routes')
const middleware = require('./src/middlewares')
const dbConnection=require('./config.js');

middleware(app);
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

routes(app)

dbConnection(
  
  app.listen(3000,()=>{
    console.log("listening")
      })
      
);

