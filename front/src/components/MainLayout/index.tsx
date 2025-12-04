import React, { useState } from "react"
import { useUser } from '../../contexts/User'
import LeftMenu from '../LeftMenu'
import TopBar from '../TopBar'
import CredentialsPanel from '../CredentialsPanel'
import ContentPanel from '../ContentPanel'
import Dashboard from "../Page/Dashboard"
import ChatWidget from "../ChatWidget"
import {
  setAuthToken,
  login,
  register,
  chat
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
  ChatResponse
} from "../../interfaces"
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
    showMessage("Feature to edit user info coming soon!", "Edit User Info")
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

/*
  export const login = async (
    loginInfo: LoginInfo
  ): Promise<UserInfo | null> => {
    const response: AxiosResponse<LoginResponse> = await axios.post(
      `${API_URL}/auth/login`,
      loginInfo
    )
    try
    {
      const responseData: LoginResponse = response.data
      const token = responseData.access_token
      const decoded: JwtPayload = jwtDecode(token)
      const user: UserInfo = {
        id: decoded.id,
        email: decoded.email,
        createdAt: decoded.created_at,
        authorization: token,
      }
      return user
    }
    catch
    {
      return null
    }
  }


  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setMessages((msgs) => [...msgs, { sender: "user", content: userMessage }])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage }),
      })
      const data: ChatResponse = await response.json()
      const botMessage = data.assistant || "No response from bot."

      setMessages((msgs) => [...msgs, { sender: "bot", content: botMessage }])
    } catch (error) {
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", content: `Error: Could not reach chatbot service. (${error})` },
      ])
    } finally {
      setLoading(false)
    }
  }
*/

  const showMessage = (text: string, title: string) => {
    modal.info({
      title: title,
      content: <Text>{text}</Text>,
      okText: "Close",
    });
  }

  React.useEffect(() => {
    setResetTrigger((prev) => prev + 1)
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
      </Layout>
      {contextHolder}
    </ConfigProvider>
  )
}

export default MainLayout