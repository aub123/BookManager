import { Box, Grid, Pagination, Paper, Stack } from '@mui/material'
import React from 'react'

import BookCard from './widgets/BookCard'
import BreadcrumbsNavi from './widgets/BreadcrumbsNavi'

const InventoryPage = (args) => {
    const [pageCount, setPageCount] = React.useState(-1)
    const [loading, setLoading] = React.useState(true)
    const [books, setBooks] = React.useState([])
    const [page, setPage] = React.useState(1)

    window.sessionStorage['fromPage'] = 3

    window.onkeydown = (e) => {
        if (e.code === 'ArrowRight') {
            if (page !== pageCount) {
                ws.emit('inventory', page, response => {
                    if (response.stat) {
                        setBooks(response.data)
                        setPage(page + 1)
                        document.body.scrollTop = 0
                        document.documentElement.scrollTop = 0
                    }
                })
            }
        }
        if (e.code === 'ArrowLeft') {
            if (page !== 1) {
                ws.emit('inventory', page - 2, response => {
                    if (response.stat) {
                        setBooks(response.data)
                        setPage(page - 1)
                        document.body.scrollTop = 0
                        document.documentElement.scrollTop = 0
                    }
                })
            }
        }
    }

    let ws = args.ws

    React.useEffect(() => {
        if (pageCount === -1) {
            ws.emit('bookCount', response => {
                if (response.stat) {
                    setPageCount(response.count)
                    ws.emit('inventory', 0, response => {
                        if (response.stat) {
                            setBooks(response.data)
                            setLoading(false)
                        }
                    })
                }
            })
        }
    }, [pageCount])

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
                    pageName='库存'
                />
            </Box>
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
                        loading ? (
                            <>
                                {
                                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(key => (
                                        <Grid
                                            key={key}
                                            item
                                            xs={12}
                                            md={4}
                                            lg={3}
                                        >
                                            <BookCard />
                                        </Grid>
                                    ))
                                }
                            </>
                        ) : (
                            <>
                                {
                                    books.map(book => (
                                        <Grid
                                            key={book.bookid}
                                            item
                                            xs={12}
                                            md={4}
                                            lg={3}
                                        >
                                            <BookCard
                                                bookInfo={book}
                                                ws={ws}
                                                setPage={args.setPage}
                                            />
                                        </Grid>
                                    ))
                                }
                            </>
                        )
                    }
                </Grid>
            </Box>
            <Box
                sx={{
                    height: '150px'
                }}
            />
            <Paper
                elevation={0}
                sx={{
                    position: 'fixed',
                    bottom: '25px',
                    margin: 'auto',
                    left: '50%',
                    transform: 'translate(-50%)'
                }}
            >
                <Box
                    sx={{
                        padding: '5px 5px 5px 5px'
                    }}
                >
                    <Stack spacing={2}>
                        <Pagination
                            count={pageCount}
                            page={page}
                            hidefirstbutton="true"
                            hidelastbutton="true"
                            onChange={(e, p) => {
                                ws.emit('inventory', p - 1, response => {
                                    if (response.stat) {
                                        setBooks(response.data)
                                        setPage(p)
                                        document.body.scrollTop = 0
                                        document.documentElement.scrollTop = 0
                                    }
                                })
                            }}
                        />
                    </Stack>
                </Box>
            </Paper>
        </>
    )
}

export default InventoryPage