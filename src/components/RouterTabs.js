import React, { useState } from 'react'
import { navigate } from 'gatsby'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

const RouterTabs = ({ routers = [], currentPage, ...props }) => {
  const [index, setIndex] = useState(
    routers.findIndex(v => v.link === currentPage)
  )
  return (
    <Tabs value={index} onChange={(_, value) => navigate(routers[value].link)}>
      {routers.map(router => (
        <Tab label={router.name} key={router.link} />
      ))}
    </Tabs>
  )
}

export default RouterTabs
