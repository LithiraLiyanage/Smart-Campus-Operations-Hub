import React, { useState } from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, theme } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  AppstoreOutlined 
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const { Header, Sider, Content } = Layout;

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    if (user?.role === 'ADMIN') {
      return [
        {
          key: '/admin',
          icon: <DashboardOutlined />,
          label: 'Admin Hub',
        },
        {
          key: '/admin/facilities',
          icon: <AppstoreOutlined />,
          label: 'Facilities',
        },
      ];
    }
    return [
      {
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: 'User Dashboard',
      },
      {
        key: '/dashboard/facilities',
        icon: <AppstoreOutlined />,
        label: 'View Facilities',
      },
    ];
  };

  const dropdownItems = [
    {
      key: '1',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} breakpoint="lg" onBreakpoint={(broken) => {
        if(broken) setCollapsed(true);
      }}>
        <div style={{ height: 32, margin: 16, background: 'rgba(79, 70, 229, 0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', fontWeight: 'bold' }}>
          {collapsed ? 'SC' : 'Smart Campus'}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={getMenuItems()}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
             <span style={{ fontWeight: 500, color: '#4b5563' }}>Welcome, {user?.username}</span>
             <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
                <Avatar style={{ backgroundColor: '#4f46e5', cursor: 'pointer' }} icon={<UserOutlined />} />
             </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            overflow: 'auto'
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
