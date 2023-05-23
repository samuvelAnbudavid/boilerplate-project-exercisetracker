const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { validate, ValidationError, Joi } = require('express-validation')
const excisesBody ={body: Joi.object({
  _id:Joi.string().optional(),
  username:Joi.string().optional(),
  description: Joi.string().required(),
  duration: Joi.string().required(),
})}
const { 
  v1: uuidv1,
} = require('uuid');
const bodyParser = require ('body-parser')
app.use(bodyParser.urlencoded({ extended:false}))
app.use(bodyParser.json())

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

var users=[];
var userlogs=[];

app.post('/api/users',(req, res) => {
  let user={
    username:req.body.username,
    _id:uuidv1()
  }
users.push(user)

res.json(user)
})
app.get('/api/users',(req, res) => {
 

res.json(users)
})
app.post('/api/users/:_id/exercises',(req, res) => {

let {_id,username} =users.find((e)=>e._id== req.params._id) 
let exercises={
  _id,
  username,
  date: req.body.date?new Date(req.body.date).toDateString():new Date().toDateString(),
  duration: Number(req.body.duration),
  description: req.body.description,
  
}
userlogs.push(exercises)
res.json(exercises)

})

app.get('/api/users/:_id/logs',(req, res) => {
  let {from,to,limit} = req.query
  let logs
  console.log(from,to)
  if(from && to){
    console.log(from,to,"Dd")
   logs = userlogs.filter((e)=>e._id == req.params._id && new Date(e.date)>= new Date(from) && new Date(e.date) <= new Date(to))
  }else if(from){
    logs = userlogs.filter((e)=>e._id == req.params._id && new Date(e.date)>= new Date(from) )
  }
  else if(to){
    logs = userlogs.filter((e)=>e._id == req.params._id && new Date(e.date)>= new Date(to) )
  }
  else{
  logs = userlogs.filter((e)=>e._id == req.params._id )
  }
  let {_id,username} = logs[0];
  let count = logs.length

  let reLogs = logs.map(({_id,username, ...rest})=> rest).slice(0,limit)
  res.json({_id,username,"count":count,"log":reLogs})
  
  })


app.use(function(err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err)
  }

  next()
})
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
