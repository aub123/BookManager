import React from 'react'
import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Box, Typography, Skeleton } from '@mui/material'
// import strRand from '../../functions/strRand'
const BookCard = (args) => {
    let bookInfo = args.bookInfo
    let ws = args.ws

    if (bookInfo === undefined) {
        return (
            <>
                <Card>
                    <CardActionArea>
                        <CardMedia>
                            <Skeleton
                                variant="rectangular"
                                width={'100%'}
                                height={140}
                            />
                        </CardMedia>
                        <CardContent>
                            <Skeleton
                                variant="text"
                                width={'100%'}
                                height={30}
                                animation="wave"
                            />
                            <Skeleton
                                variant="text"
                                width={'100%'}
                                height={20}
                                animation="wave"
                            />
                            <Skeleton
                                variant="text"
                                width={'100%'}
                                height={20}
                                animation="wave"
                            />
                            <Skeleton
                                variant="text"
                                width={'90%'}
                                height={20}
                                animation="wave"
                            />
                        </CardContent>
                    </CardActionArea>
                </Card>
            </>
        )
    } else {
        return (
            <>
                <Card>
                    <CardActionArea
                        onClick={() => {
                            ws.emit('bookData', bookInfo.isbn, response => {
                                window.sessionStorage['bookData'] = JSON.stringify(response)
                                args.setPage(2)
                            })
                        }}
                    >
                        <CardMedia
                            component='img'
                            height='140'
                            image={bookInfo.photo}
                            alt='book cover'
                        />
                        <CardContent>
                            <Typography
                                variant='h5'
                            >
                                {bookInfo.bookname.length > 15 ? bookInfo.bookname.substr(0, 13) + '...' : bookInfo.bookname}
                            </Typography>
                            <Box
                                sx={{
                                    padding: '10px 0 0 0'
                                }}
                            />
                            <Typography
                                variant='body2'
                                color='#c2c2c2'
                            >
                                {bookInfo.description.length > 70 ? bookInfo.description.substr(0, 70) + '...' : bookInfo.description}
                            </Typography>
                            {
                                args.timeLeft !== undefined && (
                                    <Typography>
                                        {args.timeLeft >= 0 ? '剩余时间' : '已逾期'}:
                                        <Typography
                                            color={
                                                args.timeLeft > 3 ? 'green' : args.timeLeft >= 0 ? 'orange' : 'red'
                                            }
                                            variant='paragraph'
                                        >
                                            &nbsp;{Math.abs(args.timeLeft)}&nbsp;
                                        </Typography>
                                        天
                                    </Typography>
                                )
                            }
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        {/* {console.log(args)} */}
                        
                        {
                            typeof (args.cardActionLabel) === 'object' ?


                                args.cardActionLabel?.map(
                                    (ele, ind) =>
                                    (<Button
                                        onClick={args.cardAction[ind] === undefined ? () => {
                                            alert('nonono')
                                        } : args.cardAction[ind]}
                                    >
                                        { args.cardActionLabel[ind]}
                                    </Button>)
                                ) :
                                (<Button
                                    onClick={args.cardAction === undefined ? () => {
                                        alert('nonono')
                                    } : args.cardAction}
                                >
                                    {args.cardActionLabel === undefined ? '编辑' : args.cardActionLabel}
                                </Button>)
                        }

                    </CardActions>
                </Card>
            </>
        )
    }
}

export default BookCard