import { Button, Checkbox, Divider, FormControlLabel, FormGroup, Grid, Paper, Typography, Box } from '@mui/material'
import React from 'react'

import BreadcrumbsNavi from './widgets/BreadcrumbsNavi'

const SearchResultPage = (args) => {
    let ws = args.ws

    window.sessionStorage['fromPage'] = 4

    const [result, setResult] = React.useState()
    const [toRender, setToRender] = React.useState([])
    const [filter, setFilter] = React.useState({
        pub: {},
        cat: {}
    })

    React.useEffect(() => {
        if (!result) {
            let raw = window.sessionStorage['searchName']
            let toSearch = '%'
            for (let i = 0; i < raw.length; i++) {
                toSearch = toSearch + raw[i] + '%'
            }
            ws.emit('searchBook', toSearch, response => {
                if (response.success) {
                    setResult(response.data)
                    setToRender(response.data)
                    let categories = {}
                    let publishers = {}
                    for (let key in response.data) {
                        if (response.data[key].category !== null) {
                            categories[response.data[key].category] = 0
                        }
                        if (response.data[key].publisher !== null) {
                            publishers[response.data[key].publisher] = 0
                        }
                    }
                    setFilter({
                        pub: publishers,
                        cat: categories
                    })
                }
            })
        }
    }, [result])

    const handleCatChange = (key) => {
        let filter_ = filter
        filter.cat[key] = 1 - filter.cat[key]
        setFilter({ ...filter_ })
    }

    const handlePubChange = (key) => {
        let filter_ = filter
        filter.pub[key] = 1 - filter.pub[key]
        setFilter({ ...filter_ })
    }

    React.useEffect(() => {
        let cat = []
        let pub = []
        for (let key in filter.cat) {
            if (filter.cat[key] === 1) {
                cat.push(key)
            }
        }
        for (let key in filter.pub) {
            if (filter.pub[key] === 1) {
                pub.push(key)
            }
        }
        let tmp = []
        for (let i in result) {
            if (pub.includes(result[i].publisher) || pub.length === 0) {
                if (cat.includes(result[i].category) || cat.length === 0) {
                    tmp.push(result[i])
                }
            }
        }
        setToRender(tmp)
    }, [filter])

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
                    pageName='搜索结果'
                />
            </Box>
            <Box
                sx={{
                    width: '67vw',
                    margin: 'auto',
                    marginTop: {
                        xs: '100px',
                        md: '150px'
                    }
                }}
            >
                <Grid
                    container
                    spacing={4}
                >
                    <Grid
                        item
                        xs={12}
                        md={3}
                    >
                        <Paper>
                            <Box
                                sx={{
                                    padding: '10px 10px 10px 10px'
                                }}
                            >
                                <Typography
                                    variant='h5'
                                >
                                    筛选
                                </Typography>
                            </Box>
                            <Divider />
                            <Box
                                sx={{
                                    padding: '10px 10px 10px 10px'
                                }}
                            >
                                <Typography
                                    variant='h6'
                                >
                                    分类
                                </Typography>
                                <FormGroup>
                                    {
                                        Object.keys(filter.cat).map(key => (
                                            <FormControlLabel
                                                key={key}
                                                control={
                                                    <Checkbox
                                                        onChange={() => {
                                                            handleCatChange(key)
                                                        }}
                                                    />
                                                }
                                                label={key}
                                            />
                                        ))
                                    }
                                </FormGroup>
                                {
                                    Object.keys(filter.cat).length === 0 && (
                                        <Typography>
                                            暂无分类
                                        </Typography>
                                    )
                                }
                            </Box>
                            <Box
                                sx={{
                                    padding: '0 10px 10px 10px'
                                }}
                            >
                                <Typography
                                    variant='h6'
                                >
                                    出版社
                                </Typography>
                                <FormGroup>
                                    {
                                        Object.keys(filter.pub).map(key => (
                                            <FormControlLabel
                                                key={key}
                                                control={
                                                    <Checkbox
                                                        onChange={() => {
                                                            handlePubChange(key)
                                                        }}
                                                    />
                                                }
                                                label={key}
                                            />
                                        ))
                                    }
                                </FormGroup>
                                {
                                    Object.keys(filter.pub).length === 0 && (
                                        <Typography>
                                            暂无分类
                                        </Typography>
                                    )
                                }
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={9}
                    >
                        <Paper>
                            {
                                toRender.map(book => (
                                    <Box
                                        key={book.isbn}
                                    >
                                        <Box
                                            sx={{
                                                padding: '10px 10px 10px 10px'
                                            }}
                                        >
                                            <Typography
                                                variant='h6'
                                            >
                                                {book.bookname}
                                            </Typography>
                                            <Typography
                                                variant='paragraph'
                                                color='#c2c2c2'
                                            >
                                                {book.description}
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                padding: '0 0 10px 10px'
                                            }}
                                        >
                                            <Button
                                                variant='outlined'
                                                onClick={() => {
                                                    ws.emit('bookData', book.isbn, response => {
                                                        if (response.success) {
                                                            response.isbn = book.isbn
                                                            window.sessionStorage['bookData'] = JSON.stringify(response)
                                                            args.setPage(2)
                                                        } else {
                                                            args.fail('内部错误')
                                                        }
                                                    })
                                                }}
                                            >
                                                详情
                                            </Button>
                                        </Box>
                                        <Divider />
                                    </Box>
                                ))
                            }
                        </Paper>
                    </Grid>
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

export default SearchResultPage