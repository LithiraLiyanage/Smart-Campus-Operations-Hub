import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Skeleton, Statistic } from 'antd';
import { AppstoreOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { resourceApi } from '../../api/resourceApi';

const { Title } = Typography;

const UserDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, available: 0, distinctTypes: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Small fake delay for Skeleton effect presentation
        await new Promise(r => setTimeout(r, 800));
        const resources = await resourceApi.getAll();
        
        const types = new Set(resources.map(r => r.type));
        const available = resources.filter(r => r.status === 'AVAILABLE').length;

        setStats({
          total: resources.length,
          available: available,
          distinctTypes: types.size,
        });
      } catch (e) {
        console.error("Failed to fetch stats", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ fontWeight: 600 }}>Overview</Title>
        <p style={{ color: '#6b7280' }}>Welcome to the User operations overview.</p>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: 24 }}>
            <Skeleton loading={loading} active paragraph={{ rows: 1 }}>
              <Statistic 
                title={<span style={{ color: '#6b7280', fontSize: 14 }}>Total Facilities</span>}
                value={stats.total} 
                prefix={<AppstoreOutlined style={{ color: '#4f46e5', marginRight: 8 }} />} 
                valueStyle={{ color: '#111827', fontWeight: 600, fontSize: 32 }}
              />
            </Skeleton>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: 24 }}>
            <Skeleton loading={loading} active paragraph={{ rows: 1 }}>
              <Statistic 
                title={<span style={{ color: '#6b7280', fontSize: 14 }}>Available Right Now</span>}
                value={stats.available} 
                prefix={<CheckCircleOutlined style={{ color: '#10b981', marginRight: 8 }} />} 
                valueStyle={{ color: '#111827', fontWeight: 600, fontSize: 32 }}
              />
            </Skeleton>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: 24 }}>
            <Skeleton loading={loading} active paragraph={{ rows: 1 }}>
              <Statistic 
                title={<span style={{ color: '#6b7280', fontSize: 14 }}>Facility Types</span>}
                value={stats.distinctTypes} 
                prefix={<InfoCircleOutlined style={{ color: '#f59e0b', marginRight: 8 }} />} 
                valueStyle={{ color: '#111827', fontWeight: 600, fontSize: 32 }}
              />
            </Skeleton>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserDashboard;
