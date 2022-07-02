const { Server } = require('socket.io')
const http = require('http')
const request = require('request')
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mysql = require('mysql2')
const crypto = require('crypto')

dotenv.config()

const app = express()
app.use(cors())
const server = http.createServer(app)
const io = new Server(server, {
    cors: true
})

var userList = {}

io.on('connection', socket => {
    socket.on('login', (args, callback) => {
        switch (args.type) {
            case 'pwd':
                connection.query('select `uid` from `users` where `name` = ? and `pwd` = ?',
                    [args.user.name, crypto.createHash('md5').update(args.user.pwd).digest('hex')],
                    async (err, rows) => {
                        if (!err) {
                            if (rows.length !== 0) {
                                let tracker = await genTracker(rows[0].uid)
                                callback({
                                    stat: true,
                                    uid: rows[0].uid,
                                    tracker: tracker
                                })
                            }
                            else {
                                callback({
                                    stat: false
                                })
                            }
                        }
                    })
                break
            case 'tracker':
                connection.query('select `name`, `uid`, `role`, `email`, `borrowed` from `users` where `uid` = (select `uid` from `trackers` where `tracker` = ?)', args.tracker, (err, rows) => {
                    if (err) {
                        callback({
                            stat: false
                        })
                    } else {
                        if (rows.length !== 0) {
                            callback({
                                stat: true,
                                uid: rows[0].uid,
                                role: rows[0].role,
                                avatar: crypto.createHash('md5').update(rows[0].email).digest('hex'),
                                limit: 12 - rows[0].borrowed,
                                uname: rows[0].name
                            })
                        }
                        else {
                            callback({
                                stat: false
                            })
                        }
                    }
                })
                break
        }
    })

    socket.on('register', (args, callback) => {
        const user = { ...args.user };
        // user.pwd = crypto.createHash()
        console.log(user)
        connection.query('insert into `users` (`name`, `email`, `pwd`, `role`, `borrowed`) values (?, ?, ?, ?, ?)',
            [user.name, crypto.createHash('md5').update(user.email).digest('hex'), crypto.createHash('md5').update(user.pwd).digest('hex'), user.role, user.borrowed], err => {
                if (err) {
                    callback({
                        success: false,
                        msg: err
                    })
                } else {
                    // let tracker = await genTracker(rows[0].uid)
                    callback({
                        success: true,
                        // tracker: tracker
                    })
                }
            })
    })
    socket.on('queryUser', (username, callback) => {
        if (username in userList) {
            callback({
                found: true,
                emailHash: crypto.createHash('md5').update(userList[username]).digest('hex')
            })
        }
        else {
            callback({
                found: false
            })
        }
    })

    socket.on('longer', (args, callback) => {
        connection.query('select time from borrowed where uid = ? and ISBN = ?', [args.uid, args.isbn],
            (err, res) => {
                console.log(res[0])
                const date = new Date(new Date(res[0].time).setDate(new Date(res[0].time).getDate() + 7))
                // console.log(date.toLocaleString())
                // console.log((date).toISOString())
                // console.log(date, date - 7)
                connection.query('UPDATE borrowed SET time = ? WHERE uid = ? and ISBN = ?', [date.toLocaleString(), args.uid, args.isbn], err => {
                    if (err) {
                        callback({
                            success: false,
                            msg: err
                        })
                    } else {
                        callback({
                            success: true
                        })
                    }
                })
            }
        )
        // await console.log(date)

    })

    socket.on('bookData', (isbn, callback) => {
        connection.query('select `bookname`, `authors`, `description`, `photo`, `publisher`, `price`, `stock`, `borrowed` from `inventory` where `isbn` = ?',
            isbn, (err, rows) => {
                if (err) {
                    callback({
                        success: false
                    })
                } else {
                    if (rows.length > 0) {
                        callback({
                            success: true,
                            bookName: rows[0].bookname,
                            author: rows[0].authors,
                            photo: rows[0].photo,
                            description: rows[0].description,
                            publisher: rows[0].publisher,
                            price: rows[0].price,
                            stock: rows[0].stock - rows[0].borrowed,
                            isbn: isbn
                        })
                    } else {
                        let api = `https://ixnet.icu/api/book?isbn=${isbn}`
                        request({
                            url: api,
                            timeout: 5000,
                            method: 'GET',
                            rejectUnauthorized: false
                        }, (err, res, body) => {
                            if (!err && res.statusCode === 200) {
                                body = JSON.parse(body)
                                if (body.success) {
                                    callback({
                                        success: true,
                                        bookName: body.data.name,
                                        author: body.data.author,
                                        photo: body.data.cover,
                                        description: body.data.summary,
                                        publisher: body.data.publisher,
                                        price: body.data.price,
                                        stock: -1,
                                        isbn: isbn
                                    })
                                } else {
                                    callback({
                                        success: false
                                    })
                                }
                            } else {
                                callback({
                                    success: false
                                })
                            }
                        })
                    }
                }
            })
    })

    socket.on('bookCount', callback => {
        connection.query('select count(*) from `inventory`', (err, rows) => {
            if (err) {
                callback({
                    stat: false
                })
            } else {
                callback({
                    stat: true,
                    count: Math.ceil(rows[0]['count(*)'] / 12)
                })
            }
        })
    })

    socket.on('inventory', (page, callback) => {
        connection.query('select `bookid`, `bookname`, `description`, `photo`, `isbn` from `inventory` where `bookid` > ? and `bookid` <= ?',
            [parseInt(page) * 12, (parseInt(page) + 1) * 12], (err, rows) => {
                if (err) {
                    callback({
                        stat: false
                    })
                } else {
                    callback({
                        stat: true,
                        data: rows
                    })
                }
            })
    })

    socket.on('searchBook', (key, callback) => {
        connection.query('select `isbn`, `bookname`, `description`, `photo`, `publisher`, `price`, `category`, `stock` from `inventory` where `bookname` like ?', key, (err, rows) => {
            if (err) {
                callback({
                    success: false
                })
            } else {
                callback({
                    success: true,
                    data: rows
                })
            }
        })
    })

    socket.on('addBook', (data, callback) => {
        connection.query('insert into `inventory` (`isbn`, `bookname`, `authors`, `description`, `photo`, `category`, `stock`, `price`, `publisher`) values (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [data.isbn, data.name, data.author, data.description, data.photo, data.category, data.count, data.price, data.publisher], err => {
                if (err) {
                    callback({
                        success: false,
                        msg: err
                    })
                } else {
                    callback({
                        success: true
                    })
                }
            })
    })

    socket.on('deleteBook', (data, callback) => {
        connection.query(`delete from inventory where isbn = ?`, [data],( err, res) => {
            console.log(data)
            if (err) {
                callback({
                    success: false,
                    msg: err
                })
                console.log(err)
            }else {
                console.log(res)
                callback({
                    success: true,
                    msg: res.affectedRows
                })
            }
        })
    })

    /*
    data: 
        name: name,
        author: author,
        publisher: publisher,
        isbn: isbn,
        count: count,
        price: price,
        description: description,
        photo: photo,
        category: category
    */

    socket.on('editBook', (data, callback) => {
        connection.query(`update inventory set bookname = ? , authors = ?, description = ?, photo = ?,  publisher = ?, price = ?  where isbn = ?`, 
        [data.name, data.author, data.description, data.photo, data.publisher, data.price ,data.isbn],(err, res) => {
            // console.log(data)
            if (err) {
                callback({
                    success: false,
                    msg: err
                })
                console.log(err)
            }else {
                console.log(res)
                callback({
                    success: true,
                    msg: res.affectedRows
                })
            }
        })
    })

    socket.on('borrowBook', async (data, callback) => {
        let uid = data.uid
        let stat = {}
        let borrowedCnt = 0
        for (let key in data.books) {
            let isbn = data.books[key]
            await new Promise(resolve => {
                connection.query('update `inventory` set `borrowed` = `borrowed` + 1 where `isbn` = ?', isbn, err => {
                    if (err) {
                        stat[isbn] = false
                    } else {
                        borrowedCnt++
                        stat[isbn] = true
                        connection.query('insert into `borrowed` (`isbn`, `uid`) values (?, ?)', [isbn, uid])
                    }
                    resolve()
                })
            })
        }

        connection.query('update `users` set `borrowed` = `borrowed` + ?', borrowedCnt)

        callback({
            stat: stat,
            successCnt: borrowedCnt
        })
    })

    socket.on('queryBookBorrowed', (uid, callback) => {
        connection.query('select `isbn`, `time` from `borrowed` where `uid` = ?', uid, (err, rows) => {
            if (err) {
                callback({
                    success: false
                })
            } else {
                callback({
                    success: true,
                    data: rows
                })
            }
        })
    })

    socket.on('borrowedBooksDetail', (uid, callback) => {
        connection.query('select `bookname`, `photo`, `description`, `borrowed`.`isbn`, `borrowed`.`time`, `borrowed`.`uid` from `inventory` inner join `borrowed` on `borrowed`.`isbn` = `inventory`.`isbn` where `uid` = ?',
            uid, (err, rows) => {
                if (err) {
                    callback({
                        success: false
                    })
                } else {
                    callback({
                        success: true,
                        data: rows
                    })
                }
            })
    })

    socket.on('turnBack', (data, callback) => {
        connection.query('delete from `borrowed` where `isbn` = ? and `uid` = ?', [data.isbn, data.uid], err => {
            if (err) {
                callback({
                    success: false
                })
            } else {
                connection.query('update `users` set `borrowed` = `borrowed` - 1 where `uid` = ?', data.uid)
                connection.query('update `inventory` set `borrowed` = `borrowed` - 1 where `isbn` = ?', data.isbn)
                callback({
                    success: true
                })
            }
        })
    })
})

server.listen(process.env.PORT || 1333, () => {
    console.log(`server started at *:${process.env.PORT || 1333}`)
})

const connection = mysql.createConnection({
    host: process.env.SQL_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME
})

connection.connect(err => {
    if (err) {
        console.log('\x1B[31m[Erro] \x1B[0m%s', err)
        console.log('[Info] Program will be exit, please check the DB configuration')
        process.exit(0)
    }

    console.log('[Info] DB Connection Established')
    updateUserList()
})

const updateUserList = () => {
    connection.query('select `name`, `email` from `users`', (err, rows) => {
        if (err) {
            throw err
        }
        for (let key in rows) {
            userList[rows[key].name] = rows[key].email
        }
        console.log('[Info] User list loaded', userList)
    })
}

const genTracker = (uid) => {
    let result = new Promise((resolve, reject) => {
        let tracker = 'T-' + crypto.createHash('md5').update(Date.now() + '.' + uid).digest('hex')
        connection.query('delete from `trackers` where `uid` = ?', [uid], err => {
            if (err) {
                reject(err)
                throw err
            }
            connection.query('insert into `trackers` (`tracker`, `uid`) values (?, ?)', [tracker, uid], err => {
                if (err) {
                    reject(err)
                    throw err
                }
                resolve(tracker)
            })
        })
    })

    return result
}