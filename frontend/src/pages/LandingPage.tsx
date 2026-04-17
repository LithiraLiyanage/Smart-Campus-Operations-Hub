import React from 'react';
import { Card, Typography, Row, Col, Layout } from 'antd';
import { UserOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCardClick = (role: 'USER' | 'ADMIN') => {
    navigate('/login', { state: { role } });
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: 1000, width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Title level={1} style={{ fontWeight: 800, color: '#1f2937', marginBottom: 16 }}>
              Smart Campus <span style={{ color: '#4f46e5' }}>Operations Hub</span>
            </Title>
            <Paragraph style={{ fontSize: '18px', color: '#6b7280', maxWidth: 600, margin: '0 auto' }}>
              Seamlessly manage your facilities, track resources, and monitor core campus operations all from one unified dashboard.
            </Paragraph>
          </div>

          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} sm={12} md={10}>
              <Card
                hoverable
                onClick={() => handleCardClick('USER')}
                style={{
                  borderRadius: 16,
                  textAlign: 'center',
                  padding: '24px 0',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.borderColor = '#4f46e5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <div style={{ background: '#e0e7ff', width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
                  <UserOutlined style={{ fontSize: 32, color: '#4f46e5' }} />
                </div>
                <Title level={3} style={{ color: '#111827' }}>Login as User</Title>
                <Paragraph style={{ color: '#6b7280', marginBottom: 0 }}>
                  View facilities and explore resources.
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} md={10}>
              <Card
                hoverable
                onClick={() => handleCardClick('ADMIN')}
                style={{
                  borderRadius: 16,
                  textAlign: 'center',
                  padding: '24px 0',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.borderColor = '#4f46e5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <div style={{ background: '#fee2e2', width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
                  <SettingOutlined style={{ fontSize: 32, color: '#ef4444' }} />
                </div>
                <Title level={3} style={{ color: '#111827' }}>Login as Admin</Title>
                <Paragraph style={{ color: '#6b7280', marginBottom: 0 }}>
                  Manage resources and campus facilities.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default LandingPage;
