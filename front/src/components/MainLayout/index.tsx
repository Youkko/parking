import React, { useState } from "react"
import { useUser } from '../../contexts/User'
import LeftMenu from '../LeftMenu'
import TopBar from '../TopBar'
import CredentialsPanel from '../CredentialsPanel'
import ContentPanel from '../ContentPanel'
import Dashboard from "../Page/Dashboard"
import {
  login,
  register
} from "../Api"
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
  const { userInfo, setUserInfo } = useUser()
  
  const [modal, contextHolder] = Modal.useModal()
  const [currentPage, setPage] = useState<React.ReactNode>(<Dashboard />)
  const [isLoginMode, setLoginMode] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [resetTrigger, setResetTrigger] = useState(0)
  const showModal = () => setIsModalVisible(true)
  const handleCancel = () => setIsModalVisible(false)

  const handleLogin = async (email: string, password: string) => {
    login({ email, password }).then((user) => {
      if (!user) {
        showMessage("Invalid credentials!", "Login error")
        return;
      }
      localStorage.setItem("userInfo", JSON.stringify(user))
      setUserInfo(user)
    }).catch((err) => {
      if (err.status === 401)
        showMessage(err.response.data.message, "Login error")
      else
        showMessage(err.message, "Login error")
    })
  }

  const handleRegisterUser = (email: string, password: string) => {
    register({ email, password }).then().catch()
    showMessage("Feature to register user coming soon!", "Register")
  }

  const handleLogout = () => {
    localStorage.removeItem("userInfo")
    setUserInfo(null)
  }

  const handleEditUserInfo = () => {
    showMessage("Feature to edit user info coming soon!", "Edit User Info")
  }

  const showMessage = (text: string, title: string) => {
    modal.info({
      title: title,
      content: <Text>{text}</Text>,
      okText: "Close",
    });
  }

  React.useEffect(() => {
    setResetTrigger((prev) => prev++)
    setIsModalVisible(false);
  }, [userInfo]);

  React.useEffect(() => {
    
  }, []);

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
          resetFieldsTrigger={resetTrigger}
        />
      </Layout>
      {contextHolder}
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