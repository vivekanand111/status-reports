var express = require('express')
var mysql = require('mysql')
var router = new express.Router();
var async = require('async');
var passwordHash = require('node-php-password');
var moment = require("moment")


//var con = mysql.createConnection({ host: "localhost", user: "root", password: "", database: 'star2' })
    //var con = mysql.createConnection({ host: "localhost", user: "root", password: "S0ft@secure605", database: 'star' })
    var con = mysql.createConnection({ host: "localhost", user: "root", password: "root", database: 'star2', 
    socketPath:"/Applications/MAMP/tmp/mysql/mysql.sock", port:"8889"
    })
con.connect((err) => {
    if (err) {
        console.log("Error in establishing Connection")
    } else {
        console.log("Connected Successfully")
    }
})


/*******************Function to get Common codes *******/


router.get('/api/commonCodes', (req, res) => {
    con.query('SELECT task_type from star_common_codes', (err, resp) => {
        if (err) {
            res.send(err)
        } else {
            res.send(resp)
        }
    })
})

/*********Function to get user Id based on user name **************/

router.post('/api/user', (req, res) => {
    try {
        con.query('select * from star_users where User_Name=? ', [req.body.username], (err, data) => {
            if (err) {
                res.status(401).send(err)
            } else {
                console.log(data)
                res.status(200).json({ "user_id": data[0].id, "message": "Success" })
            }
        })
    } catch (err) {}
})


/***Function to Fetch task By Id */

router.get('/api/fetchTaskById/:id', (req, res) => {
    try {
        con.query('select * from star_tasks where id= ?', [req.params.id], (err, result) => {
            if (err) {
                res.status(401).send({ "message": "Some thing went wrong" })
            } else if (result == "" || result == null) {
                res.status(404).send({ "message": "No data available" })
            } else {
                res.status(200).json(result)
            }
        })
    } catch (err) {
        res.status(500)({ "message": "There is an error while fetching task" })
    }

})


/***Function to Add Task */

router.post('/api/Tasks', (req, res) => {
    try {
        var today = new Date();
        console.log("Time", today)
        con.query('insert into star_tasks(star_id,task_desc,task_date,project,module,created_date,modified_date,sprint,hours,task_notes,task_type) values(?,?,?,?,?,?,?,?,?,?,?)', [
            req.body.star_id,
            req.body.task_desc,
            req.body.task_date,
            req.body.project,
            req.body.module,
            today,
            today,
            req.body.sprint,
            req.body.hours,
            req.body.taskNotes,
            req.body.taskType
        ], (err, rows) => {
            if (err) {
                res.status(400).send(err);
            } else {
                con.query('select * from star_tasks where star_id = ? ORDER By id DESC Limit 1', [req.body.star_id], (err, data) => {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        res.status(201).json(data);
                    }
                })

            }
        })
    } catch (err) {
        res.status(500).send({ "messgae": "Something went wrong. Please try again" });
    }
})


/**** Function to Update Task  *******/


router.put('/api/Tasks/:id', (req, res) => {
    try {
        var presentDate = new Date();
        con.query('UPDATE star_tasks SET task_date = ?,task_desc = ?,project = ?,module = ?,sprint = ?,hours = ?,modified_date = ?,task_notes = ?,task_type = ? WHERE id = ?', [
            req.body.task_date,
            req.body.task_desc,
            req.body.project,
            req.body.module,
            req.body.sprint,
            req.body.hours,
            presentDate,
            req.body.taskNotes,
            req.body.taskType,
            req.params.id,
        ], (err, result) => {
            if (err) {
                res.status(401).send({ "message": "Some thing wemt wrong. Please try again" })
            } else if (result.affectedRows == 0 || result.changedRows == 0) {
                res.status(404).send({ "message": "No task found with this id " });
            } else {
                con.query('select * from star_tasks where id= ?', [req.params.id], (err, result) => {
                    if (err) {
                        res.status(400).send(err)
                    } else {
                        res.status(200).json(result)
                    }
                })

            }
        })
    } catch (err) {
        res.status(500).send({ "messgae": "Something went wrong. Please try again" })
    }
})


/************ Function To Delete Task *************/

router.delete('/api/Tasks/:id', (req, res) => {
    con.query('delete from star_tasks where id=?', [req.params.id], (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).send(err)
        } else {
            console.log("Deleted Successfully")
            res.status(200).json({ "Task_id": req.params.id, "message": "Deleted Successfully" });
        }
    })
})

/*************Function to get Reports********** */

router.get('/api/reports/:user_id', (req, res) => {
    try {

        con.query('select * from star_reports where user_id=?', [req.params.user_id], (err, result) => {
            if (err) {
                res.status(400).json({ "message": "Something went wrong", "error": err })
            } else if (result == null || result == "" || result == undefined) {
                console.log("DATA INSIDE REPORT")
                var user = req.params.user_id
                    // res.status(200).json()
                var currentDateObj = new Date();
                currentDateObj.setDate(currentDateObj.getDate() - (currentDateObj.getDay() + 6) % 7);
                var curDate = moment(new Date(currentDateObj)).format("MM-DD-YYYY HH:mm:ss")
                presentDate = new Date()
                con.query('INSERT INTO star_reports(week_start,user_id,status,approver_id,created_dt,modified_dt,Delete_flag) VALUES(?,?,?,?,?,?,?)', [
                    curDate,
                    user,
                    "Open",
                    1,
                    presentDate,
                    presentDate,
                    'N'
                ], (err, data) => {
                    if (err) {
                        res.send(err)
                    } else {
                        con.query('select * from star_reports where user_id=? ORDER BY week_start DESC', [req.params.user_id], (err, result) => {
                            if (err) {
                                res.send(err)
                            } else {
                                var arr = [];

                                var resJson = {
                                    "id": result[0].id,
                                    "weekStart": result[0].week_start,
                                    "status": result[0].status,
                                    tasks: []
                                }
                                arr.push(resJson)
                                res.status(200).send(arr)

                            }
                        })
                    }
                })
            } else {
                var finalArray = [];
                con.query('SELECT week_start FROM `star_reports` WHERE user_id = ? ORDER BY week_start  DESC LIMIT 1', [req.params.user_id], (err, resp) => {
                    if (err) {
                        console.log(err)
                    } else {
                        var currentDateObj = new Date();
                        currentDateObj.setDate(currentDateObj.getDate() - (currentDateObj.getDay() + 6) % 7);
                        var curDate = moment(new Date(currentDateObj)).format("YYYY-MM-DD")
                        console.log("CURRENT DATE", curDate)
                        presentDate = new Date()
                        var user1 = req.params.user_id
                        console.log("RESPONSE", moment(new Date(resp[0].week_start)).format('YYYY-MM-DD'))
                        var prevDate = moment(new Date(resp[0].week_start)).format('YYYY-MM-DD')
                        if (prevDate != curDate) {
                            con.query('INSERT INTO star_reports(week_start,user_id,status,approver_id,created_dt,modified_dt,Delete_flag) VALUES(?,?,?,?,?,?,?)', [
                                curDate,
                                user1,
                                "Open",
                                1,
                                presentDate,
                                presentDate,
                                'N'
                            ], (err, data) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log("entered a new report")
                                    con.query('select * from star_reports where user_id=? ORDER BY week_start DESC', [req.params.user_id], (err, result) => {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            async.eachSeries(result, function(value, cbk) {

                                                con.query('select * from star_tasks where star_id = ? ORDER BY task_date', [value.id], (err, data) => {
                                                    var resJson = {
                                                        "id": value.id,
                                                        "weekStart": value.week_start,
                                                        "status": value.status,
                                                        tasks: data
                                                    }

                                                    finalArray.push(resJson)
                                                    cbk()

                                                })

                                            }, function(err) {
                                                if (err) {
                                                    console.log(err)
                                                    cb()
                                                } else if (finalArray == "" || finalArray == null || finalArray == undefined) {
                                                    res.send({ "message": "No data available" })
                                                } else {

                                                    res.status(200).json(finalArray)
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        } else {
                            con.query('select * from star_reports where user_id=? ORDER BY week_start DESC', [req.params.user_id], (err, result) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    async.eachSeries(result, function(value, cbk) {

                                        con.query('select * from star_tasks where star_id = ? ORDER BY task_date ', [value.id], (err, data) => {
                                            var resJson = {
                                                "id": value.id,
                                                "weekStart": value.week_start,
                                                "status": value.status,
                                                tasks: data
                                            }

                                            finalArray.push(resJson)
                                            cbk()

                                        })

                                    }, function(err) {
                                        if (err) {
                                            console.log(err)
                                            cb()
                                        } else if (finalArray == "" || finalArray == null || finalArray == undefined) {
                                            res.send({ "message": "No data available" })
                                        } else {

                                            res.status(200).json(finalArray)
                                        }
                                    })
                                }
                            })
                        }
                    }
                })

            }
        })
    } catch (err) {
        res.status(500).send(err)
    }
})

/*************** Function to submit report ***************/

router.put('/api/submit', (req, res) => {
    con.query('select * from star_reports WHERE id = ? ', [req.body.id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            if (result[0].status != "Submitted") {
                con.query('Update star_reports SET status = "Submitted" where id =' + result[0].id, (err, data) => {
                    if (err) {
                        res.status(400).send(err)
                    } else {
                        res.status(200).json({ "status": "Submitted", "id": result[0].id, "message": "Report submitted" })
                    }
                })
            } else {
                res.status(200).send({ "message": "Already report submitted" })
            }
        }
    })
})


// select * FROM star_reports sr, star_tasks st where sr.id=st.star_id
router.post('/api/getReport', (req, res) => {
    con.query('select * from star ')
})


/***************************** API TO GET PROJECT NAME AND MODULES *******************/
router.post('/api/projectList', (req, res) => {
    con.query('Select project_code from star_projects ORDER BY project_code', (err, data) => {
        if (err) {
            res.send(err)
        } else {
            var projectArray = [];
            async.eachSeries(data, function(value, cbk) {
                proj = value.project_code
                con.query('select module_code from star_project_modules where project_code =?', [proj], (err, result) => {
                    var details = {}
                    details[proj] = result

                    projectArray.push(details)
                    console.log("PROJECT", details)
                    cbk()

                })

            }, function(err) {
                if (err) {
                    console.log(err)
                    cb()
                } else {
                    res.send(projectArray)
                }
            })
        }
    })
})


/**Function To create User ****/

router.post('/api/createUser', (req, res) => {
    var presentDate = new Date();
    var pass = passwordHash.hash(req.body.password)
    con.query('INSERT INTO star_users(User_Name,Supervisor_id,Email,Mobile_Number,Role_id,Password,Created_date,Modified_date,Delete_flag) Values(?,?,?,?,?,?,?,?,?)', [
        req.body.user_id,
        req.body.supervisor_id,
        req.body.email,
        req.body.mobileNumber,
        req.body.role_id,
        pass,
        presentDate,
        presentDate,
        req.body.delete_flag
    ], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(201).send("Created user successfully")
        }
    })

})

/************** Function to reset password *****************/

router.post('/api/resetPwd', (req, res) => {
    var username = req.body.username;
    var oldPwd = req.body.oldPwd;
    var newPwd = passwordHash.hash(req.body.newPwd);
    if (username) {
        con.query('select * from star_users where User_Name = ?', [username], (err, result) => {
            if (result.length > 0) {
                if (passwordHash.verify(oldPwd, result[0].Password)) { // console.log("value", results[0].Role_id)
                    console.log("old", result[0].Password)
                    console.log("newpwd", newPwd)
                    console.log("Password", result[0].Password == newPwd)
                    con.query('Update star_users SET Password = ? where User_Name =' + result[0].User_Name, [newPwd], (err, result1) => {
                        if (err) {
                            res.send({ "message": "error while reseting password" })
                        } else {
                            res.status(200).send({ "message": "Successfully changed password" })
                        }
                    })
                } else {
                    res.status(401).json({ "message": "Invalid Password" })
                }
            } else {
                res.status(401).send({ "message": "User Not found" })
            }
        })
    }
})


/**Login Api **** */

router.post('/api/login', function(req, res) {
    var username = req.body.username;
    var email = req.body.username;
    var pass = req.body.password
    try {
        if (username || email) {
            con.query('SELECT * FROM star_users WHERE User_Name = ? OR Email = ?', [
                username, email
            ], function(error, results, fields) {
                if (error) {
                    res.status(401).send({ "message": "User Not found" })
                } else if (results == null || results == undefined) {
                    res.json({ "message": "No data available" })
                } else {

                    if (passwordHash.verify(pass, results[0].Password)) {

                        res.status(200).json({ "user_id": results[0].User_Name, role_id: results[0].Role_id, "message": "Loggedin Successfully" })
                    } else {
                        res.status(401).json({ "message": "Invalid Username and Password" })
                    }
                }

            });
        } else {
            res.status(401).json({ "message": "Please enter Username and Password" })
        }
    } catch (err) {
        res.status(500).send({ "message": "Something went wrong" })
    }

});


/****************** Function to get project names *****************/


router.get('/api/projectNames', (req, res) => {
    con.query('select project_code from star_projects', (err, data) => {
        if (err) {
            res.send(err)
        } else {
            res.send(data)
        }
    })
})


/*****************************Function to get project Modules **********************/
router.post('/api/modules', (req, res) => {
    con.query('select module_code from star_project_modules where project_code = ?', [req.body.project_code], (err, data) => {
        if (err) {
            res.send(err)
        } else {
            res.send(data)
        }
    })
})

var request = require('request');

router.post('/api/getNounce', (req, res) => {
    nonce = req.body.nonce;
    var auth = req.body.auth;
    console.log("NONCE", nonce)
    const options = {
        method: "GET",
        uri: "https://softforceapps.com/wp-json/custom/loggedinuser?_wpnonce=" + nonce,
        headers: {
            'X-WP-Nonce': nonce,
            'Access-Control-Allow-Origin': '*',
            'Cookie': 'wordpress_logged_in_e31cf72f486e719b99049dc1c8eea8cf=' + auth
        }
    }
    console.log("DATA", options.uri)

    request(options, function(err, response, body) {
        console.log("DATA URL", response.body)
        if (response.statusCode == 200 && response.body != "" && response.body != undefined && response.body != null) { // if(!err){
            var response = JSON.parse(response.body)
            con.query('Select Role_id from star_users where User_name =? ', [response], (err, result) => {
                if (err) {
                    res.status(400).json({ "status": "error", "message": err })
                } else {
                    res.status(200).json({ 'status': "Success", "data": response, "role_id": result[0].Role_id })
                }
            })
        } else {
            console.log("error", err)
            res.json({ "status": "failure", "data": err })

        }
    })
})


/****Function to get report for admin ****/

router.post('/api/adminReport', (req, res) => {
    con.query('SELECT  A.project,B.user_id,A.task_type,A.task_desc,A.task_date,A.hours,A.module,A.sprint,A.task_notes FROM star_tasks A  LEFT JOIN star_reports B ON A.star_id = B.id WHERE A.task_date >= ? AND A.task_date <= ?', [req.body.startDate, req.body.toDate], (err, data) => {
        if (err) {
            res.send(err)
        } else {
            console.log("result", data)
            res.send(data)
        }
    })
})

module.exports = router;