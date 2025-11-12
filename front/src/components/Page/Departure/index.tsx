import React from "react"
import { useUser } from '../../../contexts/User'
import { depart } from "../../Api"
import {
  Typography,
  Button,
  Input,
  Form,
  message,
} from "antd"
import {
  purple
} from "@ant-design/colors"
const { Title, Text } = Typography

const Departure: React.FC = () => {
  const { userInfo } = useUser()
  const [msg, contextHolder] = message.useMessage()
  const [form] = Form.useForm()

  const registerDeparture = async () => {
    try {
      const values = await form.validateFields()
      const plate = values.plate.trim().toUpperCase()
      if (!plate) {
        msg.error("Please enter a vehicle plate.")
        return
      }
      const response = await depart(plate)
      msg.success(response.data.message)
      form.resetFields()
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        msg.error(error.response.data.message)
      } else if (error.errorFields) {
      } else {
        msg.error("Failed to register arrival.")
      }
    }
  }

  return (
    <>
      {userInfo ? (
        <>
          <Title level={2} style={{ color: purple[4] }}>Register Departure</Title>
          <Form
            layout="inline"
            form={form}
            onFinish={registerDeparture}
          >
            <Form.Item 
              label="Vehicle Plate" 
              name="plate" 
              rules={[{ required: true, message: 'Please input the vehicle plate!' }]}
            >
              <Input
                placeholder="Enter vehicle plate"
                style={{textTransform: "uppercase"}}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Send</Button>
            </Form.Item>
          </Form>
        </>
      ) : (
        <Text strong>You must be authenticated to access this area.</Text>
      )}
      {contextHolder}
    </>
  )
}

export default Departure