import React from 'react'

import LoginPage from './LoginPage'
import FindBookPage from './FindBookPage'
import BookData from './BookData'
import InventoryPage from './InventoryPage'
import SearchResultPage from './SearchResultPage'
import AddToInventoryPage from './AddToInventoryPage'
import { createContext } from 'react'
import notification from '../functions/notification'
import EditBook from './EditBook'
import Navi from './widgets/Navi'
import { Snackbar, Alert, Box } from '@mui/material'
import CartPage from './CartPage'
import TurnBackPage from './TurnBackPage'

const MainPageFrame = (args) => {
    let ws = args.ws
    const Context = createContext(ws)
    const {Provider} = Context
    const [msg, setMsg] = React.useState('')
    const [msgOn, setMsgOn] = React.useState(false)
    const [failMsgOn, setFailMsgOn] = React.useState(false)
    const [infoMsgOn, setInfoMsgOn] = React.useState(false)
    const [toBorrowCnt, setToBorrowCnt] = React.useState(
        'borrowedList' in window.sessionStorage ? Object.keys(JSON.parse(window.sessionStorage['borrowedList'])).length : 0
    )

    const success = (msg) => {
        setMsg(msg)
        setMsgOn(true)
    }

    const sendInfo = (msg) => {
        setMsg(msg)
        setInfoMsgOn(true)
    }

    const fail = (msg) => {
        setMsg(msg)
        setFailMsgOn(true)
    }

    React.useEffect(() => {
        if (args.user.loggedin) {
            ws.emit('queryBookBorrowed', args.user.uid, response => {
                let needNotify = 0
                let dateNow = new Date().getTime()
                for (let key in response.data) {
                    let dateBorrowed = new Date(response.data[key].time).getTime()
                    if (dateNow - dateBorrowed > 3600 * 1000 * 24 * 6) {
                        needNotify++
                    }
                }
                if (needNotify > 0) {
                    notification('你有借阅即将到期或已经到期！', '合计：' + needNotify + '本，请尽快归还！\n详情请前往还书界面查看', 7, setPage, true, sendInfo)
                }
            })
        }
    }, [args.user])

    /* pages:
        -0: searching page
        -1: login page
        -2: book data
    */
    const [page, setPage] = React.useState(0)

    return (
        <Provider value = {ws}>
            <Navi
                userType={args.user.loggedin ? (args.user.type) : 0}
                setPage={setPage}
                success={success}
                toBorrowCnt={toBorrowCnt}
            />
            {
                page === 0 && <FindBookPage
                    ws={ws}
                    setPage={setPage}
                    fail={fail}
                    sendInfo={sendInfo}
                />
            }
            {
                page === 1 && <LoginPage
                    ws={ws}
                    fail={fail}
                />
            }
            {
                page === 2 && <BookData
                    user={args.user}
                    fail={fail}
                    success = {success}
                    setPage={setPage}
                    ws = {ws}
                    setToBorrowCnt={(n) => setToBorrowCnt(n)}
                />
            }
            {
                page === 3 && <InventoryPage
                    ws={ws}
                    setPage={setPage}
                />
            }
            {
                page === 4 && <SearchResultPage
                    ws={ws}
                    setPage={setPage}
                    fail={fail}
                />
            }
            {
                page === 5 && <AddToInventoryPage
                    ws={ws}
                    setPage={setPage}
                    success={success}
                />
            }
            {
                page === 6 && <CartPage
                    ws={ws}
                    setPage={setPage}
                    user={args.user}
                    setToBorrowCnt={setToBorrowCnt}
                    success={success}
                    fail={fail}
                />
            }
            {
                page === 7 && <TurnBackPage
                    ws={ws}
                    setPage={setPage}
                    user={args.user}
                    success={success}
                    fail={fail}
                />
            }
            {
                page === 8 && <AddToInventoryPage
                    ws={ws}
                    setPage={setPage}
                    user={args.user}
                    success={success}
                    fail={fail}
                />
            }
            {
                page === 9 && <EditBook
                    ws={ws}
                    setPage={setPage}
                    user={args.user}
                    success={success}
                    fail={fail}
                />
            }
            {
                (msgOn || failMsgOn || infoMsgOn) &&
                <Box>
                    <Snackbar
                        open={msgOn}
                        autoHideDuration={3000}
                        onClose={() => setMsgOn(false)}
                    >
                        <Alert severity='success' onClose={() => setMsgOn(false)} sx={{ width: '100%' }}>{msg}</Alert>
                    </Snackbar>
                    <Snackbar
                        open={failMsgOn}
                        autoHideDuration={3000}
                        onClose={() => setFailMsgOn(false)}
                    >
                        <Alert severity='error' onClose={() => setFailMsgOn(false)} sx={{ width: '100%' }}>{msg}</Alert>
                    </Snackbar>
                    <Snackbar
                        open={infoMsgOn}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left'
                        }}
                        autoHideDuration={5000}
                        onClose={() => setInfoMsgOn(false)}
                    >
                        <Alert severity='info' onClose={() => setInfoMsgOn(false)} sx={{ width: '100%' }}>{msg}</Alert>
                    </Snackbar>
                </Box>
            }
        </Provider>
    )
}

export default MainPageFrame