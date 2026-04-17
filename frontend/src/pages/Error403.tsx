import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const Error403: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
      <Result
        status="403"
        title="403 - Access Denied"
        subTitle="Sorry, you don't have authorization to access this page."
        extra={
          <Button type="primary" onClick={() => navigate('/')} style={{ borderRadius: 6, height: 40, fontWeight: 500 }}>
            Back to Home
          </Button>
        }
      />
    </div>
  );
};

export default Error403;
