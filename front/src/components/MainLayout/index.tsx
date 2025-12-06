import React, { useState } from "react"
import { useUser } from '../../contexts/User'
import LeftMenu from '../LeftMenu'
import TopBar from '../TopBar'
import CredentialsPanel from '../CredentialsPanel'
import ContentPanel from '../ContentPanel'
import Dashboard from "../Page/Dashboard"
import ChatWidget from "../ChatWidget"
import InfoEditorPanel from "../EditInfoPanel"
import {
  setAuthToken,
  login,
  register,
  chat,
  getUserData,
  setUserData,
} from "../Api"
import {
  Layout,
  Modal,
  Typography,
  ConfigProvider,
  theme,
} from "antd";
import { purple } from "@ant-design/colors";
import type {
  ChatMessage,
  ChatResponse,
  UserInfoWithVehicles,
} from "../../interfaces"
const { Text } = Typography;

const MainLayout: React.FC = () => {
  const { userInfo, setUserInfo } = useUser()
  const [modal, contextHolder] = Modal.useModal()
  const [currentPage, setPage] = useState<React.ReactNode>(<Dashboard />)
  const [userEditInfo, setUserEditInfo] = useState<UserInfoWithVehicles | null>(null)
  const [isLoginMode, setLoginMode] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isEditorVisible, setIsEditorVisible] = useState(false)
  const [resetTrigger, setResetTrigger] = useState(0)
  const [resetEditorTrigger, setResetEditorTrigger] = useState(0)
  const showModal = () => setIsModalVisible(true)
  const showEditorModal = () => setIsEditorVisible(true)
  const handleCancel = () => setIsModalVisible(false)
  const handleEditCancel = () => setIsEditorVisible(false)

  const handleLogin = async (email: string, password: string) => {
    login({ email, password }).then((user) => {
      if (!user) {
        showMessage("Invalid credentials!", "Login error")
        return;
      }
      localStorage.setItem("userInfo", JSON.stringify(user))
      setUserInfo(user)
      setAuthToken(user.authorization)
    }).catch((err) => {
      if (err.status === 401)
        showMessage(err.response.data.message, "Login error")
      else
        showMessage(err.message, "Login error")
    })
  }

  const handleRegisterUser = (email: string, password: string) => {
    register({ email, password }).then((result) => {
      showMessage(result.data.message, "Registration")
      setIsModalVisible(false)
    }).catch((err) => {
      if (err.status === 409)
        showMessage(err.response.data.message, "Registration error")
      else
        showMessage(err.message, "Registration error")
    })
  }

  const handleLogout = () => {
    setAuthToken(null)
    localStorage.removeItem("userInfo")
    setUserInfo(null)
  }

  const handleEditUserInfo = () => {
    showEditorModal()
  }

  const handleSaveUserInfo = (
    name: string | null,
    email: string,
    password: string,
    newPassword: string | null) => {
    
    setUserData({ name, email, password, newPassword }).then((response) => {
      showMessage(response.data.message, "User Info Update")
      if (userEditInfo)
      {
        if (name) userEditInfo.name = name
        if (email) userEditInfo.email = email
        setUserEditInfo(userEditInfo)
      }
      setIsEditorVisible(false)
    }).catch((err) => {
      if (err.status === 409)
        showMessage(err.response.data.message, "User Info Update Error")
      else
        showMessage(err.message, "User Info Update Error")
    })
  }

  const handleDelete = () => {
    showMessage("Feature to delete user account coming soon!", "Delete User Account")
  }

  const handleChat = async (
    chatMessage: ChatMessage
  ): Promise<void | ChatResponse> => {
    return chat(chatMessage.prompt).then((response) => {
      return { assistant: response.data.assistant, raw_response: response.data.raw_response }
    }).catch((err) => {
      console.error("Chat error:", err)
    })
  }

  const showMessage = (text: string, title: string) => {
    modal.info({
      title: title,
      content: <Text>{text}</Text>,
      okText: "Close",
    });
  }

  React.useEffect(() => {
    setResetTrigger((prev) => prev + 1)
    setResetEditorTrigger((prev) => prev + 1)
    setIsModalVisible(false);
    setIsEditorVisible(false);
    if (!userEditInfo)
    {
      setTimeout(() => {
        getUserData().then((response) => {
          console.log(response.data)
          setUserEditInfo(response.data)
        }).catch((err) => {
          console.info("Trying to get user data - ", err.message)
        })        
      }, 500)
    }
  }, [userInfo, setUserEditInfo, userEditInfo]);

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
          userEditInfo={userEditInfo}
          setUserEditInfo={setUserEditInfo}
        />
        <Layout>
          <LeftMenu
            pageSetter={setPage}
          />
          <ContentPanel>
            {currentPage}
          </ContentPanel>
          <ChatWidget
            onSend={handleChat}
          />
        </Layout>
        <CredentialsPanel
          onLogin={handleLogin}
          onRegister={handleRegisterUser}
          onCancel={handleCancel}
          isLoginMode={isLoginMode}
          visible={isModalVisible}
          resetFieldsTrigger={resetTrigger}
        />
        <InfoEditorPanel
          onSave={handleSaveUserInfo}
          onCancel={handleEditCancel}
          onDelete={handleDelete}
          setUserEditInfo={setUserEditInfo}
          userEditInfo={userEditInfo}
          visible={isEditorVisible}
          resetFieldsTrigger={resetEditorTrigger}
        />
        <ChatWidget
          onSend={handleChat}
        />
      </Layout>
      {contextHolder}
    </ConfigProvider>
  )
}

export default MainLayout