import type {
  InfoEditorProps,
  Vehicle
} from '../../interfaces'
import type { ColumnsType } from "antd/es/table";
import React, { useState } from "react"
import {
  getUserData,
  addUserVehicle,
  removeUserVehicle,
} from "../Api"
import {
  Modal,
  Button,
  Table,
  Input,
  Checkbox,
  Typography,
  Space,
  Divider
} from "antd"
import {
  UserOutlined,
  MailOutlined,
  DeleteOutlined,
  NumberOutlined
} from "@ant-design/icons"
const { Text } = Typography

const InfoEditorPanel: React.FC<InfoEditorProps> = (
  {
    onSave,
    onCancel,
    onDelete,
    setUserEditInfo,
    userEditInfo,
    visible,
  }
) => {
  const [modal, contextHolder] = Modal.useModal()
  const [name, setName] = useState(userEditInfo && userEditInfo.name || "")
  const [email, setEmail] = useState(userEditInfo && userEditInfo.email || "")
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newPasswordCfm, setNewPasswordCfm] = useState("")

  const [plate, setPlate] = useState("")
  const [isMotorcycle, setIsMotorcycle] = useState(false)
  const [vehicles, setVehicles] = useState(userEditInfo?.vehicles || [])


  const disableAccount = () => {
    onDelete()
  }

  const save = () => {
    if (email.trim().length === 0 ||
        password.trim().length === 0)
    {
      showMessage("E-mail and password are mandatory.")
      return
    }

    if (name.trim().length === 0)
    {
      showMessage("Please enter your name.")
      return
    }
    
    if (newPassword.trim().length > 0 &&
        newPassword !== newPasswordCfm)
    {
      showMessage("New password doesn't match it's confirmation.")
      return
    }

    onSave(name, email, password, newPassword)
  }

  const showMessage = (text: string) => {
    modal.info({
      title: "Information",
      content: <Text>{text}</Text>,
      okText: "Close",
    })
  }

  const handleCancel = () => {
    onCancel()
  }
  
  React.useEffect(() => {
    if (visible) {
      if (!userEditInfo)
      {
        getUserData().then((response) => {
          setUserEditInfo(response.data)
        })
      }
      setVehicles(userEditInfo?.vehicles || [])
      setName(userEditInfo?.name || "")
      setEmail(userEditInfo?.email || "")
      setPassword("")
      setNewPassword("")
      setNewPasswordCfm("")
    }
  }, [setUserEditInfo, userEditInfo, visible])

  const columns: ColumnsType<Vehicle> = [
    { title: 'Plate', dataIndex: 'plate', key: 'plate' },
    {
      title: 'Type',
      dataIndex: 'isMotorcycle',
      key: 'isMotorcycle',
      render: (value: string) => value === "true" ? "Motorcycle" : "Car",
    },
    {
      title: '',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Button
          color="danger"
          variant="solid"
          shape="circle"
          icon={<DeleteOutlined />}
          onClick={() => {
            removeUserVehicle(record.plate)
              .then(() => {
                setVehicles(vehicles.filter(v => v.plate !== record.plate))
              })
              .catch((error) => {
                if (error.response && error.response.data && error.response.data.message) {
                  showMessage(error.response.data.message)
                } else {
                  showMessage("Failed to remove vehicle.")
                }
              })
          }}
        />
      ),
    }
  ]

  return (
    <>
      <Modal
        title="Edit Account Information"
        open={visible}
        onOk={save}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
        centered
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input
            prefix={<UserOutlined />}
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
          />
          <Input
            prefix={<MailOutlined />}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <Input.Password
            placeholder="Current Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input.Password
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input.Password
            placeholder="New Password Confirmation"
            value={newPasswordCfm}
            onChange={(e) => setNewPasswordCfm(e.target.value)}
            />
          <Divider />
          <Table<Vehicle>
            columns={columns}
            dataSource={vehicles}
            rowKey="plate"
            pagination={{ pageSize: 3 }}
            size='small'
          />
          <Space>
            <Input
              prefix={<NumberOutlined />}
              placeholder="Plate Number"
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
            />
            <Checkbox
              checked={isMotorcycle}
              onChange={(e) => setIsMotorcycle(e.target.checked)}
            >
              Motorcycle
            </Checkbox>
            <Button
              color='cyan'
              variant='solid'
              onClick={() => {
                if (plate.trim().length === 0) {
                  showMessage("Please enter a vehicle plate.")
                  return
                }
                const newVehicle: Vehicle = {
                  plate: plate.trim().toUpperCase(),
                  isMotorcycle,
                  isActive: 'true',
                  createdAt: new Date().toISOString()
                }
                addUserVehicle(newVehicle).then(() => {
                  setVehicles([...vehicles, newVehicle])
                  setPlate("")
                  setIsMotorcycle(false)
                  showMessage("Vehicle added successfully.")
                }).catch((error) => {
                  if (error.response && error.response.data && error.response.data.message) {
                    showMessage(error.response.data.message)
                  } else {
                    showMessage("Failed to add vehicle.")
                  }
                })
              }}
            >
              Add vehicle
            </Button>
          </Space>
          <Divider />
          <Button
            color='danger'
            variant='solid'
            onClick={() => {
              Modal.confirm({
                title: 'Disable Account',
                content: 'Are you sure you want to disable your account? This action cannot be undone.',
                onOk: disableAccount,
                footer: (_, { OkBtn, CancelBtn }) => (
                  <>
                    <CancelBtn />
                    <OkBtn />
                  </>
                ),
              });
            }}
          >
            Disable my Account
          </Button>
        </Space>
      </Modal>
      {contextHolder}
    </>
  )
}

export default InfoEditorPanel