import type { ParkingInfo } from '../../../interfaces'
import { useEffect, useState } from 'react'
import { Table } from 'antd'
import { getMovements } from '../../Api'
import { useNavigate } from 'react-router-dom'

const Dashboard: React.FC = () => {
  const [data, setData] = useState<ParkingInfo[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    getMovements()
      .then(res => setData(res.data))
  }, [navigate])

  const columns = [
    { title: 'Plate', dataIndex: 'plate', key: 'plate' },
    { title: 'Arrival', dataIndex: 'arrival', key: 'arrival' },
    { title: 'Departure', dataIndex: 'departure', key: 'departure' },
    {
      title: 'Duration (minutes)',
      dataIndex: 'duration_seconds',
      key: 'duration_seconds',
      render: (text: number) => (text ? (text / 60).toFixed(1) : ''),
    },
  ]

  return (
    <Table<ParkingInfo>
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      title={() => 'Vehicle Traffic'}
    />
  )
}

export default Dashboard