import { Grid, Box, Paper, Typography, Divider, Button } from '@mui/material'
import React from 'react'

import BookCard from './widgets/BookCard'
import BreadcrumbsNavi from './widgets/BreadcrumbsNavi'

import NothingImg from '../nothing.svg'
// import strRand from '../functions/strRand'

const CartPage = (args) => {
    // const [progress, setProgress] = React.useState(0)
    const [borrowed, setBorrowed] = React.useState(
        'borrowedList' in window.sessionStorage ? JSON.parse(window.sessionStorage['borrowedList']) : {}
    )
    let ws = args.ws

    window.sessionStorage['fromPage'] = 6

    /*
    window.onscroll = () => {
        if (document.body.scrollTop + document.documentElement.scrollTop < -50) {
            document.getElementById('refreshIndicator').style.display='block'
            setProgress(Math.min(100, -(50 + document.body.scrollTop + document.documentElement.scrollTop) * 4))
        } else {
            document.getElementById('refreshIndicator').style.display='none'

        }
    }

    window.ontouchend = () => {
        if (document.body.scrollTop + document.documentElement.scrollTop < -75) {
            window.location.reload()
        }
    }
    */
    // const photo = strRand()
    return (
        <>
            <Box
                sx={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px'
                }}
            >
                <BreadcrumbsNavi
                    setPage={args.setPage}
                    pageName='借阅清单'
                />
            </Box>
            {
                Object.keys(borrowed).length === 0 ? (
                    <>
                        <Box
                            sx={{
                                margin: 'auto',
                                textAlign: 'center',
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            <img
                                alt='noBook'
                                src={NothingImg}
                                style={{
                                    transform: 'translate(-1.5%)'
                                }}
                            />
                            <Typography
                                variant='h5'
                                sx={{
                                    transform: 'translate(0, -300%)',
                                    color: 'white'
                                }}
                            >
                                没有书了
                            </Typography>
                        </Box>
                    </>
                ) : (
                    <>
                        <Box
                            sx={{
                                width: {
                                    md: '67vw',
                                    xs: '75vw'
                                },
                                margin: 'auto',
                                left: 0,
                                right: 0,
                                marginTop: '120px'
                            }}
                        >
                            <Grid
                                container
                                spacing={4}
                            >
                                {
                                    Object.keys(borrowed).map(key => {

                                        let bookInfo = {
                                            bookname: borrowed[key].bookName,
                                            isbn: key,
                                            photo: borrowed[key].photo,
                                            description: borrowed[key].description
                                        }

                                        return (
                                            <Grid
                                                key={key}
                                                item
                                                xs={12}
                                                md={4}
                                                lg={3}
                                            >
                                                <BookCard
                                                    key={key}
                                                    bookInfo={bookInfo}
                                                    cardActionLabel={'移出借阅清单'}
                                                    cardAction={() => {
                                                        let tmp = borrowed
                                                        delete tmp[key]
                                                        window.sessionStorage['borrowedList'] = JSON.stringify(tmp)
                                                        args.setToBorrowCnt(Object.keys(tmp).length)
                                                        setBorrowed({ ...tmp })
                                                    }}
                                                    ws={ws}
                                                    setPage={args.setPage}
                                                />
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                        </Box>
                        <Box
                            sx={{
                                height: '230px'
                            }}
                        />
                        <Paper
                            elevation={2}
                            sx={{
                                position: 'fixed',
                                margin: 'auto',
                                top: {
                                    md: '120px',
                                    xs: 'calc(100% - 200px)'
                                },
                                width: '180px',
                                left: '-20px'
                            }}
                        >
                            <Box
                                sx={{
                                    padding: '10px 10px 5px 30px'
                                }}
                            >
                                <Typography
                                    variant='h6'
                                >
                                    合计：
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    padding: '0 10px 5px 30px'
                                }}
                            >
                                <Divider />
                            </Box>
                            <Box
                                sx={{
                                    padding: '0 10px 5px 30px'
                                }}
                            >
                                <Typography
                                    variant='paragraph'
                                >
                                    已加清单：{Object.keys(borrowed).length} 本
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    padding: '0 10px 5px 30px'
                                }}
                            >
                                <Typography
                                    variant='paragraph'
                                >
                                    剩余可借：{args.user.limit - Object.keys(borrowed).length} 本
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    padding: '5px 10px 10px 30px'
                                }}
                            >
                                <Button
                                    fullWidth
                                    variant='outlined'
                                    onClick={() => {
                                        ws.emit('queryBookBorrowed', args.user.uid, response => {
                                            let needNotify = 0
                                            let dateNow = new Date().getTime()
                                            for (let key in response.data) {
                                                let dateBorrowed = new Date(response.data[key].time).getTime()
                                                if (dateNow - dateBorrowed > 3600 * 1000 * 24 * 7) {
                                                    needNotify++
                                                }
                                            }
                                            if (needNotify > 0) {
                                                args.fail('你有' + needNotify + '本书过期未还，请先归还已过期图书！')
                                            } else {
                                                ws.emit('borrowBook', {
                                                    uid: args.user.uid,
                                                    books: Object.keys(borrowed)
                                                }, result => {
                                                    args.success('借阅成功: ' + result.successCnt + '本')
                                                    setTimeout(() => {
                                                        window.sessionStorage.removeItem('borrowedList')
                                                        setBorrowed({})
                                                        args.setToBorrowCnt(0)
                                                    }, 3500)
                                                })
                                            }
                                        })
                                    }}
                                >
                                    借阅
                                </Button>
                            </Box>
                        </Paper>
                    </>
                )
            }
        </>
    )
}

export default CartPage