import React from 'react'
import { Box, Grid, Typography } from '@mui/material'

import BreadcrumbsNavi from './widgets/BreadcrumbsNavi'

import NothingImg from '../alldone.svg'
import BookCard from './widgets/BookCard'

const TurnBackPage = (args) => {
    let ws = args.ws

    const [borrowed, setBorrowed] = React.useState()

    const timeNow = new Date().getTime()

    window.sessionStorage['fromPage'] = 7

    const freshBorrowed = () => {
        ws.emit('borrowedBooksDetail', args.user.uid, response => {
            if (response.success) {
                setBorrowed(response.data)
            }
        })
    }
    React.useEffect(() => {
        if (!borrowed) {
            freshBorrowed()
        }
    }, [borrowed])

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
                    pageName='还书'
                />
            </Box>
            {
                borrowed === undefined || borrowed.length === 0 ? (
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
                                src={NothingImg}
                                style={{
                                    transform: 'translate(-1.5%)'
                                }}
                            />
                            <Typography
                                variant='h5'
                                sx={{
                                    transform: 'translate(0, -300%)',
                                    color: 'pink'
                                }}
                            >
                                全部还清啦
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
                                    borrowed.map((item, iter) => {
                                        let borrowTime = new Date(item.time).getTime()

                                        return (
                                            <Grid
                                                key={item.isbn}
                                                item
                                                xs={12}
                                                md={4}
                                                lg={3}
                                            >
                                                <BookCard
                                                    bookInfo={item}
                                                    ws={ws}
                                                    setPage={args.setPage}
                                                    cardActionLabel={['归还', '续借']}
                                                    cardAction={[() => {
                                                        ws.emit('turnBack', {
                                                            uid: args.user.uid,
                                                            isbn: item.isbn
                                                        }, response => {
                                                            if (response.success) {
                                                                args.success('已归还')
                                                                let tmp = borrowed
                                                                tmp.splice(iter, 1)
                                                                console.log(tmp)
                                                                setBorrowed(tmp)
                                                            } else {
                                                                args.fail('内部错误')
                                                            }
                                                        })
                                                    }, () => {
                                                        let time = 7 - parseInt((timeNow - borrowTime) / 1000 / 3600 / 24)
                                                        if (time >= 7 || time <= 0) {
                                                            args.fail('未到续期时间或者已经过期')
                                                            return
                                                        }
                                                        ws.emit('longer', {
                                                            uid: args.user.uid,
                                                            isbn: item.isbn
                                                        }, response => {
                                                            if (response.success) {
                                                                args.success('续借成功')
                                                                // window.location.reload()
                                                                freshBorrowed()
                                                            } 
                                                            else {
                                                                args.fail('内部错误')
                                                            }
                                                        })
                                                    }]}
                                                    timeLeft={7 - parseInt((timeNow - borrowTime) / 1000 / 3600 / 24)}
                                                />
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                        </Box>
                        <Box
                            sx={{
                                height: '150px'
                            }}
                        />
                    </>
                )
            }
        </>
    )
}

export default TurnBackPage