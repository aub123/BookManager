import React from 'react'
import { Badge, SpeedDial, SpeedDialAction } from '@mui/material'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined'
import Rotate90DegreesCcwOutlinedIcon from '@mui/icons-material/Rotate90DegreesCcwOutlined'

const Navi = (args) => {
    let actions = []

    const act = (actId) => {
        switch (actId) {
            case 0:
                args.setPage(1)
                break
            case 1:
                window.localStorage.removeItem('tracker')
                args.success('已登出，等待页面刷新')
                setTimeout(() => window.location.reload(), 3500)
                break
            case 2:
                args.setPage(0)
                break
            case 3:
                args.setPage(3)
                break
            case 4:
                args.setPage(6)
                break
            case 5:
                args.setPage(7)
                break
            case 8: 
                args.setPage(8)
                break
        }
    }

    switch (args.userType) {
        case 0:
            // guest
            actions = [
                { icon: <ManageSearchOutlinedIcon />, name: '找书', id: 2 },
                { icon: <LoginOutlinedIcon />, name: '登录', id: 0 },
            ]
            break
        case 1:
            // user
            actions = [
                { icon: <Rotate90DegreesCcwOutlinedIcon />, name: '还书', id: 5 },
                { icon: <ShoppingCartOutlinedIcon />, name: '待出库', id: 4 },
                { icon: <ManageSearchOutlinedIcon />, name: '找书', id: 2 },
                { icon: <LogoutOutlinedIcon />, name: '登出', id: 1 },
            ]
            break
        case 2:
            // admin
            actions = [
                { icon: <Rotate90DegreesCcwOutlinedIcon />, name: '还书', id: 5 },
                { icon: <ShoppingCartOutlinedIcon />, name: '新增书籍', id: 8 },
                { icon: <Inventory2OutlinedIcon />, name: '库存', id: 3 },
                { icon: <ManageSearchOutlinedIcon />, name: '找书', id: 2 },
                { icon: <ShoppingCartOutlinedIcon />, name: '待出库', id: 4 },
                { icon: <LogoutOutlinedIcon />, name: '登出', id: 1 },
            ]
            break
    }

    return (
        <>
            <SpeedDial
                ariaLabel='navigation'
                sx={{
                    position: 'fixed',
                    bottom: 32,
                    right: 32
                }}
                icon={<MenuOutlinedIcon />}
                onDoubleClick={() => {
                    document.body.scrollTop = 0
                    document.documentElement.scrollTop = 0
                }}
            >
                {
                    actions.map(action => {
                        return (
                            action.id === 4 ? (
                                <SpeedDialAction
                                    key={action.name}
                                    icon={
                                        <Badge
                                            badgeContent={args.toBorrowCnt}
                                            color='secondary'
                                        >
                                            {action.icon}
                                        </Badge>
                                    }
                                    tooltipTitle={action.name}
                                    onClick={() => {
                                        act(action.id)
                                    }}
                                />
                            ) : (
                                <SpeedDialAction
                                    key={action.name}
                                    icon={action.icon}
                                    tooltipTitle={action.name}
                                    onClick={() => {
                                        act(action.id)
                                    }}
                                />
                            )
                        )
                    })
                }
            </SpeedDial>
        </>
    )
}

export default Navi