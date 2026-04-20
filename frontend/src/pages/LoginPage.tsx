import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Layout, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi, type LoginPayload } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import Axios from 'axios';

const { Title, Text } = Typography;
const { Content } = Layout;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [form] = Form.useForm();
  
  // Watch is handled on submit, unused var removed

  const handleSubmit = async (values: LoginPayload) => {
    setLoading(true);
    setApiError(null);
    try {
      // Fake a 1s delay for better UX if the api is very fast
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const response = await authApi.login(values);
      setAuth({ username: values.username, role: response.role }, response.token);
      
      const from = location.state?.from?.pathname;
      if (from && from !== '/login') {
        navigate(from, { replace: true });
      } else {
        navigate(response.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true });
      }
    } catch (err) {
      if (Axios.isAxiosError(err)) {
        setApiError(err.response?.data?.message || 'Invalid username or password.');
      } else {
        setApiError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    const errors = form.getFieldsError();
    const hasErrors = errors.some(({ errors }) => errors.length > 0);
    const isTouched = form.isFieldsTouched(true);
    return isTouched && !hasErrors;
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <Card
          style={{ width: '100%', maxWidth: 420, borderRadius: 16, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', border: 'none' }}
          bodyStyle={{ padding: '40px 32px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ background: '#4f46e5', width: 48, height: 48, borderRadius: 12, margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LockOutlined style={{ color: '#fff', fontSize: 24 }} />
            </div>
            <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Welcome Back</Title>
            <Text type="secondary">Sign in to access your dashboard</Text>
          </div>

          {apiError && (
            <Alert message={apiError} type="error" showIcon style={{ marginBottom: 24 }} />
          )}

          <Form
            form={form}
            name="login"
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
            requiredMark={false}
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[
                { required: true, message: 'Username is required' },
                { min: 3, message: 'Must be at least 3 characters' },
                {
                  validator: async (_, value) => {
                    if (value && /\s/.test(value)) {
                      return Promise.reject(new Error('Spaces are not allowed'));
                    }
                  },
                },
              ]}
              validateTrigger={['onChange', 'onBlur']}
            >
              <Input 
                prefix={<UserOutlined style={{ color: '#9ca3af' }} />} 
                placeholder="Enter your username" 
                size="large" 
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Password is required' },
                { min: 6, message: 'Must be at least 6 characters' },
                {
                  validator: async (_, value) => {
                    if (value && !/\d/.test(value)) {
                      return Promise.reject(new Error('Password must include at least 1 number'));
                    }
                  },
                },
              ]}
              validateTrigger={['onChange', 'onBlur']}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                placeholder="Enter your password"
                size="large"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                disabled={!isFormValid()}
                style={{ borderRadius: 8, height: 48, fontWeight: 600 }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default LoginPage;
