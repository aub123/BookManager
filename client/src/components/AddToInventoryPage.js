import { Paper, Typography, Box, Divider, TextField, Grid, InputAdornment, Button, Breadcrumbs, Link } from '@mui/material'
import React from 'react'

import resolveISBN from '../functions/resolveISBN'

const AddToInventoryPage = (args) => {
    // let data = eval(window.sessionStorage['bookData'])

    // console.log(data)
    let ws = args.ws

    return (
        <>
            <Box
                sx={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px'
                }}
            >
                <Breadcrumbs separator='›'>
                    <Link
                        underline='hover'
                        onClick={(e) => {
                            e.preventDefault()
                            args.setPage(0)
                        }}
                        color='inherit'
                        href='/'
                    >
                        主页
                    </Link>
                    <Link
                        underline='hover'
                        onClick={(e) => {
                            e.preventDefault()
                            args.setPage(2)
                        }}
                        color='inherit'
                        href='/'
                    >
                        图书信息
                    </Link>
                    <Typography color='text.primary'>入库</Typography>
                </Breadcrumbs>
            </Box>
            <Paper
                sx={{
                    width: {
                        xs: '67vw',
                        md: '55vw'
                    },
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <Box
                    sx={{
                        padding: '10px 10px 10px 10px'
                    }}
                >
                    <Typography
                        variant='h5'
                    >
                        添加新书
                    </Typography>
                </Box>
                <Divider />
                <Box
                    sx={{
                        padding: '20px 10px 10px 10px'
                    }}
                >
                    <Grid
                        container
                        spacing={2}
                    >
                        <Grid
                            item
                            xs={8}
                        >
                            <TextField
                                label='书名'
                                fullWidth
                                id='bookname'
                                // defaultValue={data.bookName}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={4}
                        >
                            <TextField
                                label='出版社'
                                fullWidth
                                id='publisher'
                                // defaultValue={data.publisher}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={3}
                        >
                            <TextField
                                label='作者'
                                id='author'
                                fullWidth
                                // defaultValue={data.author}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={3}
                        >
                            <TextField
                                fullWidth
                                label='ISBN'
                                id='isbn'
                                // defaultValue={resolveISBN(data.isbn)}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={3}
                        >
                            <TextField
                                fullWidth
                                label='数量'
                                id='count'
                                defaultValue='1'
                            />
                        </Grid>
                        <Grid
                            item
                            xs={3}
                        >
                            <TextField
                                fullWidth
                                label='售价（每本）'
                                id='price'
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">￥</InputAdornment>,
                                }}
                                // defaultValue={data.price}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                label='描述'
                                id='description'
                                multiline
                                minRows={2}
                                maxRows={4}
                                // defaultValue={data.description}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={4}
                        >
                            <TextField
                                fullWidth
                                label='分类'
                                id='category'
                                defaultValue='默认分类'
                            />
                        </Grid>
                        <Grid
                            item
                            xs={8}
                        >
                            <TextField
                                fullWidth
                                label='封面图片链接'
                                id='photo'
                                // defaultValue={data.photo}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Divider />
                <Box
                    sx={{
                        padding: '10px 10px 10px 10px'
                    }}
                >
                    <Button
                        variant='outlined'
                        onClick={() => {
                            let name = document.getElementById('bookname').value
                            let author = document.getElementById('author').value
                            let publisher = document.getElementById('publisher').value
                            let isbn = document.getElementById('isbn').value.replace(/-+/g, "")
                            let count = document.getElementById('count').value
                            let price = document.getElementById('price').value
                            let description = document.getElementById('description').value
                            let photo = document.getElementById('photo').value
                            let category = document.getElementById('category').value

                            let toAdd = {
                                name: name,
                                author: author,
                                publisher: publisher,
                                isbn: isbn,
                                count: count,
                                price: price,
                                description: description,
                                photo: photo,
                                category: category
                            }

                            ws.emit('addBook', toAdd, response => {
                                if (response.success) {
                                    args.setPage(0)
                                    args.success('添加成功')
                                } else {
                                    args.fail('内部错误')
                                }
                            })
                        }}
                    >
                        确认
                    </Button>
                </Box>
            </Paper>
        </>
    )
}

export default AddToInventoryPage