import type { ContentPanelProps } from '../../interfaces'
import {
  greyDark,
  grey,
} from "@ant-design/colors";
import {
  Layout,
  Typography,
} from "antd";
const { Content } = Layout;
const { Text } = Typography;

const ContentPanel: React.FC<ContentPanelProps> = ({ children }) => {
  return (
    <Content style={{ margin: 24, background: greyDark[0], padding: 24 }}>
      <Text style={{ color: grey[0] }}>
        { children }
      </Text>
    </Content>
  )
}

export default ContentPanel