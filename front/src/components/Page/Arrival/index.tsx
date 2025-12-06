import React from "react"
import { arrive } from "../../Api"
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
const { Title } = Typography

const Arrival: React.FC = () => {
  const [msg, contextHolder] = message.useMessage()
  const [form] = Form.useForm()

  const registerArrival = async () => {
    try {
      const values = await form.validateFields()
      const plate = values.plate.trim().toUpperCase()
      if (!plate) {
        msg.error("Please enter a vehicle plate.")
        return
      }
      const response = await arrive(plate)
      msg.success(response.data.message)
      form.resetFields()
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        msg.error(error.response.data.message)
      } else {
        msg.error("Failed to register arrival.")
      }
    }
  }

  return (
    <>
      <Title level={2} style={{ color: purple[4] }}>Register Arrival</Title>
      <Form
        layout="inline"
        form={form}
        onFinish={registerArrival}
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
      {contextHolder}
    </>
  )
}

export default Arrival