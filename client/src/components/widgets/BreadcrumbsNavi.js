import { Breadcrumbs, Link, Typography } from '@mui/material'
import React from 'react'

const BreadcrumbsNavi = (args) => {
    return (
        <>
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
                <Typography color='text.primary'>{args.pageName}</Typography>
            </Breadcrumbs>
        </>
    )
}

export default BreadcrumbsNavi