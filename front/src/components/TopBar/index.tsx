import type { TopBarProps } from '../../interfaces'
import { useUser } from '../../contexts/User'
import {
  Layout,
  Button,
  Typography,
} from "antd";
import {
  purple,
  blue
} from "@ant-design/colors";
import {
  UserAddOutlined,
  LoginOutlined,
  LogoutOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const TopBar: React.FC<TopBarProps> = (
  {
    handleLogout,
    handleEditUserInfo,
    showModal,
    setLoginMode
  }
) => {
  const { userInfo } = useUser()
  const showRegisterDialog = () => {
    setLoginMode(false)
    showModal()
  }
  
  const showLoginDialog = () => {
    setLoginMode(true)
    showModal()
  }

  const showEditUserInfo = () => {
    handleEditUserInfo()
  }


  const logOut = () => {
    handleLogout()
  }

  return (
    <Header
      style={{
        padding: "0 24px",
        background: "#141414",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 15,
      }}
    >
      <Content style={{ padding: 24 }}>
        <Title style={{ color: blue[4] }}>Binder's Parking</Title>
      </Content>
      {!userInfo ? (
        <>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={showRegisterDialog}
            style={{ backgroundColor: purple[6], borderColor: purple[6] }}
          >
            Register
          </Button>
          <Button
            type="primary"
            icon={<LoginOutlined />}
            onClick={showLoginDialog}
            style={{ backgroundColor: purple[6], borderColor: purple[6] }}
          >
            Login
          </Button>
        </>
      ) : (
        <>
          <Text style={{ color: "#fff" }}>{userInfo.email}</Text>
          <Button
            icon={<EditOutlined />}
            onClick={showEditUserInfo}
            type="default"
          >
            Edit Info
          </Button>
          <Button
            icon={<LogoutOutlined />}
            onClick={logOut}
            danger
            type="default"
          >
            Logoff
          </Button>
        </>
      )}
    </Header>
  )
}

export default TopBar