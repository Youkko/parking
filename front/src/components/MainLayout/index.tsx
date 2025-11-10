import React, { useState } from "react"
import LeftMenu from '../LeftMenu'
import TopBar from '../TopBar'
import CredentialsPanel from '../CredentialsPanel'
import ContentPanel from '../ContentPanel'
import Dashboard from "../Page/Dashboard"
import {
  Layout,
  Modal,
  Typography,
  ConfigProvider,
  theme,
} from "antd";
import { purple } from "@ant-design/colors";
const { Text } = Typography;

const MainLayout: React.FC = () => {
  const [currentPage, setPage] = useState<React.ReactNode>(<Dashboard />)
  const [isLoginMode, setLoginMode] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState(null)

  const showModal = () => setIsModalVisible(true)
  const handleCancel = () => setIsModalVisible(false)

  const handleLogin = (email: string, password: string) => {
    Modal.info({
      title: "Login",
      content: <Text>Feature to login coming soon! {email}, {password}</Text>,
      okText: "Close",
    })
  }

  const handleRegisterUser = (email: string, password: string) => {
    Modal.info({
      title: "Register",
      content: <Text>Feature to register user coming soon! {email}, {password}</Text>,
      okText: "Close",
    })
  }

  const handleLogout = () => setLoggedInUser(null);

  const handleEditUserInfo = () => {
    Modal.info({
      title: "Edit User Info",
      content: <Text>Feature to edit user info coming soon!</Text>,
      okText: "Close",
    })
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: purple[6]
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <TopBar
          handleLogout={handleLogout}
          handleEditUserInfo={handleEditUserInfo}
          showModal={showModal}
          setLoginMode={setLoginMode}
          loggedInUser={loggedInUser}
        />
        <Layout>
          <LeftMenu
            pageSetter={setPage}
          />
          <ContentPanel>
            {currentPage}
          </ContentPanel>
        </Layout>
        <CredentialsPanel
          onLogin={handleLogin}
          onRegister={handleRegisterUser}
          onCancel={handleCancel}
          isLoginMode={isLoginMode}
          visible={isModalVisible}
        />
      </Layout>
    </ConfigProvider>
  )
}

export default MainLayout



/*import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Arrive from './pages/arrive';
import Depart from './pages/depart';
import '@ant-design/v5-patch-for-react-19';

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/arrive" element={<PrivateRoute><Arrive /></PrivateRoute>} />
        <Route path="/depart" element={<PrivateRoute><Depart /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
*/