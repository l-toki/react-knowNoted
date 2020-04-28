import React from 'react'
import {Button} from 'antd'
import {withRouter} from 'react-router-dom'
import {Head} from './style'
const Header=(props)=> {
    const history=props.history.location.pathname
    return (
        <Head>
        <Button type={history==='/'?'primary':''} onClick={()=>{props.history.push('/')}}>首页</Button>
        <Button type={history==='/lianxi'?'primary':''} onClick={()=>{props.history.push('/lianxi')}}>练习</Button>
        <Button type={history==='/biji'?'primary':''} onClick={()=>{props.history.push('/biji')}}>记笔记</Button>
      </Head>
    )
}
export default withRouter(Header)