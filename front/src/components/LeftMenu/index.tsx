import type { MenuProps } from '../../interfaces'
import { useState } from "react";
import {
  Layout,
  Button,
  Space,
} from "antd";
import {
  DashboardFilled,
  CarFilled,
  CarOutlined,
} from "@ant-design/icons";
import { greyDark  } from "@ant-design/colors";
import Arrival from "../Page/Arrival"
import Departure from "../Page/Departure"
import Dashboard from "../Page/Dashboard"

const { Sider } = Layout;

const LeftMenu: React.FC<MenuProps> = (
  {
    pageSetter
  }
) => {
  const [collapsed, setCollapsed] = useState(false);
  
  const openDashboard = () => {
    pageSetter(<Dashboard />)
  }
  const openArrival = () => {
    pageSetter(<Arrival />)
  }
  const openDeparture = () => {
    pageSetter(<Departure />)
  }

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      style={{
        background: greyDark[1],
        paddingTop: 16,
        textAlign: "center",
      }}
    >
      <Space
        direction="vertical"
        size="middle"
        style={{ width: "100%", padding: "10px 0" }}
      >
        <Button
          type="primary"
          icon={<DashboardFilled />}
          block
          onClick={openDashboard}
        >
          {!collapsed ? (<>Dashboard</>) : (null)}
        </Button>
        <Button
          type="primary"
          icon={<CarFilled />}
          block
          onClick={openArrival}
        >
          {!collapsed ? (<>Register Arrival</>) : (null)}
        </Button>
        <Button
          type="primary"
          icon={<CarOutlined />}
          block
          onClick={openDeparture}
        >
          {!collapsed ? (<>Register Departure</>) : (null)}
        </Button>
      </Space>
    </Sider>
  )
}

export default LeftMenu