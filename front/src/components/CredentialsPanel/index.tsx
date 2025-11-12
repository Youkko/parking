import type { CredentialsPanelProps } from '../../interfaces'
import React, { useState } from "react"
import {
  Modal,
  Input,
  Typography,
  Space,
} from "antd"
import {
  UserOutlined,
} from "@ant-design/icons"
const { Text } = Typography

const CredentialsPanel: React.FC<CredentialsPanelProps> = (
  {
    onLogin,
    onRegister,
    onCancel,
    isLoginMode,
    visible,
    resetFieldsTrigger
  }
) => {
  const [modal, contextHolder] = Modal.useModal()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordCfm, setPasswordConfirm] = useState("")

  const getTitle = () => {
    return isLoginMode ? "Login" : "Register"
  }

  const loginOrRegister = () => {
    if (isLoginMode)
    {
      if (email.trim().length === 0 ||
          password.trim().length === 0)
      {
        showMessage("E-mail and password are mandatory.")
        return
      }

      onLogin(email, password)
    }
    else
    {
      if (email.trim().length === 0 ||
          password.trim().length === 0)
      {
        showMessage("E-mail and password are mandatory.")
        return
      }

      if (password !== passwordCfm)
      {
        showMessage("Password confirmation doesn't match the password.")
        return
      }

      onRegister(email, password)
    }
  }

  const showMessage = (text: string) => {
    modal.info({
      title: getTitle(),
      content: <Text>{text}</Text>,
      okText: "Close",
    })
  }

  const handleCancel = () => {
    onCancel()
  }

  React.useEffect(() => {
    if (visible) {
      setEmail("")
      setPassword("")
      setPasswordConfirm("")
    }
  }, [resetFieldsTrigger, visible])

  return (
    <>
      <Modal
        title={getTitle()}
        open={visible}
        onOk={loginOrRegister}
        onCancel={handleCancel}
        okText={getTitle()}
        cancelText="Cancel"
        centered
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input
            prefix={<UserOutlined />}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <Input.Password
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isLoginMode ? (
          <Input.Password
            placeholder="PasswordConfirm"
            value={passwordCfm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />) : (null)}
        </Space>
      </Modal>
      {contextHolder}
    </>
  )
}

export default CredentialsPanel