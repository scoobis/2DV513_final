const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const handle = require('express-handlebars')
const session = require('express-session')
const mysql = require('mysql')


const routing = require('./routing')
const posts = require('./posts')
const createTable = require('./functions/createTables')

app.use(bodyParser.json())

//setup for express-session
app.set('trust proxy', 1)
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// MySQL setup
var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: '2dv513_final',
  password: 'Gabbe123'
})

// create tables if not already exists
con.connect(function (err) {
  if (err) throw err
  else {
    createTable.createUserTable(con)
    createTable.creataBikeTable(con)
    createTable.createUsersBikesTable(con)
    createTable.createRunTable(con)
    createTable.createSwimTable(con)
    createTable.createEventTable(con)
    createTable.createUsersEvents(con)
  }
})


// setup for handlebars
app.engine('handlebars', handle({
    defaultLayout: false,
    partialsDir: path.join(__dirname, 'public'),
    layoutsDir: path.join(__dirname, 'views')
  }))
  app.set('view engine', 'handlebars')

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(express.static(path.join(__dirname, '/public')))

  // ** ROUTING **

  // Rout to index page, if logged in routs to profile
  app.get('/', (req, res) => {
    routing.mainPage(req, res)
  })

  // Rout to profile page
  app.get('/profile/:id', (req, res) => {
    routing.profile(req, res, con)
  })

  // Rout to login page
  app.get('/login', (req, res) => {
    routing.loginPage(res)
  })

  // Rout to registration page
  app.get('/register', (req, res) => {
    routing.registerPage(res)
  })

  // Rout to stats page
  app.get('/stats', (req, res) => {
    routing.statsPage(req, res, con)
  })

  // ** POSTS **
  app.post('/login', (req, res) => {
    posts.login(req, res, con)
  })

  // Registration form
  app.post('/register', (req, res) => {
    posts.register(req, res, con)
  })

  // Add new bike
  app.post('/addNewBike', (req, res) => {
    posts.addNewBike(req, res, con)
  })

  // Change run info
  app.post('/chnageRunInfo', (req, res) => {
    posts.chnageRunInfo(req, res, con)
  })

  // Change swim info
  app.post('/chnageSwimInfo', (req, res) => {
    posts.changeSwimInfo(req, res, con)
  })

  // Edit profile information
  app.post('/editProfile', (req, res) => {
    posts.editHeightAndWeight(req, res, con)
  })

  // Add new event
  app.post('/addNewEvent', (req, res) => {
    posts.addNewEvent(req, res, con)
  })

  // logout
  app.post('/logout', (req, res) => {
    posts.logout(req, res)
  })


// catch 404
app.use((req, res, next) => {
    res.status(404)
    res.send()
  })
  
  // error handler
  app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send(err.message || 'Internal Server Error')
  })
  
  // listen to provided port
  app.listen(4000, () => console.log('Server running on port 4000'))