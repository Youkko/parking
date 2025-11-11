import React from 'react'
import { App } from 'antd'
import { UserProvider } from './contexts/User'
import MainLayout from './components/MainLayout'
const BindersApp: React.FC = () => {
  return (
    <App>
      <UserProvider>
        <MainLayout />
      </UserProvider>
    </App>
  )
}
export default BindersApp