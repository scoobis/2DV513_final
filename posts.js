const bcrypt = require('bcrypt')

function login(req, res, con) {
    con.query('SELECT email, first_name, last_name, username, password, id from user WHERE email = ?', req.body.email, (err, rows) => {
        if (err) throw err
        
        let corect = true
        // check or else it will crach
        console.log(rows.length)
        if (rows.length === 1) {
        if (bcrypt.compareSync(req.body.password, rows[0].password)) {
            req.session.email = rows[0].email
            req.session.username = rows[0].username
            req.session.userID = rows[0].id

            corect = false
            res.redirect('/')
        }
     }

     if (corect) {
        res.render('login', {
            message: 'Wrong password or email!'
        })
     }
    })
}

function register(req, res, con) {
    // create user
    let password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(12))
    con.query(`INSERT INTO user (first_name, last_name, email, password, username, weight, height) `+
    `VALUES("${req.body.first_name}", "${req.body.last_name}", "${req.body.email.toLowerCase()}", "${password}", "${req.body.username}", 0, 0)`)

    res.redirect('/')

    con.query(`SELECT COUNT(id) AS id FROM user`, (err, user) => {
        if (err) throw err

        con.query(`INSERT INTO run (user_id, pace, racing_shoe, training_shoe) VALUES(${user[0].id}, 0, "-", "-")`)
    })
}

function addNewBike(req, res, con) {
    if (req.session.userID) {
    con.query(`INSERT INTO usersbikes (user_id, bike_id)
    VALUES(${req.session.userID}, ${req.body.bike})`)
    }
    res.redirect(req.get('referer'))
}

function chnageRunInfo(req, res, con) {
    if (req.session.userID) {
        let pace = req.body.min * 6 + req.body.sec
        con.query(`UPDATE run SET pace = ${parseInt(req.body.min * 60) + parseInt(req.body.sec)}, 
        racing_shoe = "${req.body.racingShoe}", training_shoe = "${req.body.trainingShoe}" 
        WHERE user_id = ${req.session.userID}`)
        }
        res.redirect(req.get('referer'))
}

exports.login = login
exports.register = register
exports.addNewBike = addNewBike
exports.chnageRunInfo = chnageRunInfo