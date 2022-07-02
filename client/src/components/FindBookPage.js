import React from 'react'
import { Box, Paper, IconButton, InputBase, LinearProgress } from '@mui/material'
import BookOutlinedIcon from '@mui/icons-material/BookOutlined'
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined'

import resolveISBN from '../functions/resolveISBN'
import notification from '../functions/notification'

import findBookImg from '../search.svg'

const FindBookPage = (args) => {
    let ws = args.ws

    const [searching, setSearching] = React.useState(false)

    const handleSubmit = () => {
        if (searching) {
            return
        }
        setSearching(true)
        let key = document.getElementById('isbn').value.replace(/-+/g, "")
        if (isNaN(key)) {
            // search by title
            window.sessionStorage['searchName'] = key
            args.setPage(4)
        } else {
            // search by isbn
            ws.emit('bookData', key, response => {
                if (response.success) {
                    response.isbn = key
                    window.sessionStorage['bookData'] = JSON.stringify(response)
                    window.sessionStorage['fromPage'] = 0
                    args.setPage(2)
                } else {
                    setSearching(false)
                    args.fail('没有结果！')
                }
            })
        }
    }

    return (
        <>
            {
                searching && (
                    <LinearProgress />
                )
            }
            <Box
                sx={{
                    width: {
                        sx: '67vw',
                        md: '45vw',
                        lg: '35vw'
                    },
                    margin: 'auto',
                    position: 'absolute',
                    textAlign: 'center',
                    left: '50%',
                    top: 'calc(50% - 144px)',
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <img
                    alt='logo'
                    src={findBookImg}
                    style={{
                        width: 300,
                        height: 300,
                        transform: 'translate(0, 8%)' 
                    }}
                />
                <Box
                    sx={{
                        padding: '20px 0 0 0'
                    }}
                />
                <Paper
                    component='form'
                    onSubmit={(event) => {
                        event.preventDefault()
                        handleSubmit()
                    }}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        height: '57px'
                    }}
                >
                    <IconButton
                        sx={{
                            p: '10px'
                        }}
                        aria-label="isbn"
                        onClick={() => notification('hello there', 'now you found me')}
                    >
                        <BookOutlinedIcon />
                    </IconButton>
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="输入书名模糊匹配，输入书号精确搜索"
                        id='isbn'
                        onChange={() => {
                            let resolved = resolveISBN(document.getElementById('isbn').value)
                            if (resolved) {
                                document.getElementById('isbn').value = resolved
                            }
                        }}
                        inputProps={{ 'aria-label': 'isbn' }}
                        autoFocus
                    />
                    <IconButton
                        sx={{ p: '10px' }}
                        aria-label="search"
                        onClick={handleSubmit}
                        disabled={searching}
                    >
                        <ManageSearchOutlinedIcon />
                    </IconButton>
                </Paper>
            </Box>
        </>
    )
}

export default FindBookPage