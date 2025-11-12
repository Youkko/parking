import type { ParkingInfo } from '../../../interfaces'
import { useEffect, useState } from 'react'
import {
  Typography,
  Table
} from 'antd'
import {
  purple
} from "@ant-design/colors"
import { getMovements } from '../../Api'
import { useNavigate } from 'react-router-dom'
const { Title } = Typography

const Dashboard: React.FC = () => {
  const [data, setData] = useState<ParkingInfo[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    getMovements()
      .then(res => setData(res.data))
  }, [navigate])

  const formatLocalDateTime = (dateString: string | null) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const pad = (n: number) => n.toString().padStart(2, '0')

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
      `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  }

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds <= 0) return ''

    const days = Math.floor(seconds / (3600 * 24))
    const hours = Math.floor((seconds % (3600 * 24)) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    const pad = (num: number) => num.toString().padStart(2, '0')

    return (days === 0) ?
      `${pad(hours)}:${pad(minutes)}:${pad(secs)}` :
      `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(secs)}`
  };

  const columns = [
    { title: 'Plate', dataIndex: 'plate', key: 'plate' },
    {
      title: 'Arrival',
      dataIndex: 'arrival',
      key: 'arrival',
      render: (text: string) => formatLocalDateTime(text),
    },
    {
      title: 'Departure',
      dataIndex: 'departure',
      key: 'departure',
      render: (text: string | null) => formatLocalDateTime(text),
    },
    {
      title: 'Duration',
      dataIndex: 'duration_seconds',
      key: 'duration_seconds',
      render: (text: number) => formatDuration(text),
    },
  ]

  return (
    <Table<ParkingInfo>
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      title={() => <Title level={2} style={{ color: purple[4] }}>Vehicle Traffic</Title>}
    />
  )
}

export default Dashboard
