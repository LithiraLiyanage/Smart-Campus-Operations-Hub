import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4f46e5', // Indigo 600 - premium look
          borderRadius: 8,
          fontFamily: "'Inter', sans-serif",
          colorBgContainer: '#ffffff',
          colorText: '#1f2937', 
        },
        components: {
          Card: {
            boxShadowSecondary: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
