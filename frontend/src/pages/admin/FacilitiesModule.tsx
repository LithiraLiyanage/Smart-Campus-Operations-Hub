import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Modal, Form, Select, InputNumber, Popconfirm, Space, Tag, notification, Typography, Card, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { resourceApi, type ResourceItem } from '../../api/resourceApi';

const { Title } = Typography;

interface FacilitiesModuleProps {
  viewOnly?: boolean;
}

const FacilitiesModule: React.FC<FacilitiesModuleProps> = ({ viewOnly = false }) => {
  const [data, setData] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingResource, setEditingResource] = useState<ResourceItem | null>(null);
  const [form] = Form.useForm();
  
  // Real-time validation watch is handled via shouldUpdate in form if needed, unused var removed

  const fetchResources = async () => {
    setLoading(true);
    try {
      // Small fake delay to assure loading spinner shows for premium feel
      await new Promise(r => setTimeout(r, 600));
      const res = await resourceApi.getAll();
      setData(res);
    } catch (e) {
      notification.error({ message: 'Failed to fetch facilities' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const showModal = (record?: ResourceItem) => {
    setEditingResource(record || null);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      if (editingResource?.id) {
        await resourceApi.update(editingResource.id, values);
        notification.success({ message: 'Facility updated successfully' });
      } else {
        await resourceApi.create(values);
        notification.success({ message: 'Facility added successfully' });
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchResources();
    } catch (e) {
      notification.error({ message: 'Operation failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await resourceApi.delete(id);
      notification.success({ message: 'Facility deleted successfully' });
      fetchResources();
    } catch (e) {
      notification.error({ message: 'Failed to delete facility' });
      setLoading(false);
    }
  };

  const isFormValid = () => {
    const errors = form.getFieldsError();
    const hasErrors = errors.some(({ errors }) => errors.length > 0);
    const isTouched = form.isFieldsTouched(true);
    // If editing, data is already populated so consider it touched/valid as base
    return (editingResource || isTouched) && !hasErrors;
  };

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: any[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: ResourceItem, b: ResourceItem) => a.name.localeCompare(b.name),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'Lab', value: 'Lab' },
        { text: 'Hall', value: 'Hall' },
        { text: 'Room', value: 'Room' },
      ],
      onFilter: (value: any, record: ResourceItem) => record.type === value,
      render: (type: string) => {
        let color = type === 'Lab' ? 'purple' : type === 'Hall' ? 'geekblue' : 'cyan';
        return <Tag color={color}>{type}</Tag>;
      }
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
      sorter: (a: ResourceItem, b: ResourceItem) => a.capacity - b.capacity,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'AVAILABLE', value: 'AVAILABLE' },
        { text: 'NOT AVAILABLE', value: 'NOT_AVAILABLE' },
      ],
      onFilter: (value: any, record: ResourceItem) => record.status === value,
      render: (status: string) => (
        <Tag color={status === 'AVAILABLE' ? 'success' : 'error'}>
          {status.replace('_', ' ')}
        </Tag>
      ),
    },
  ];

  if (!viewOnly) {
    columns.push({
      title: 'Action',
      key: 'action',
      dataIndex: 'id',
      render: (id: string, record: ResourceItem) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined style={{ color: '#4f46e5' }}/>} onClick={() => showModal(record)} />
          <Popconfirm
            title="Delete the facility"
            description="Are you sure to delete this facility?"
            onConfirm={() => handleDelete(id)}
            okText="Yes"
            cancelText="No"
            placement="topLeft"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    });
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={4} style={{ margin: 0, fontWeight: 600 }}>Facilities Directory</Title>
        </Col>
        <Col>
          {!viewOnly && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} style={{ borderRadius: 6 }}>
              Add Resource
            </Button>
          )}
        </Col>
      </Row>

      <Card style={{ borderRadius: 12, padding: 0 }} bodyStyle={{ padding: 0 }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0' }}>
          <Input
            placeholder="Search facilities by name..."
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }}/>}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ maxWidth: 320, borderRadius: 6 }}
            allowClear
          />
        </div>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey={(record) => record.id || record.name}
          loading={loading}
          pagination={{ pageSize: 8 }}
          style={{ padding: '0 24px 24px' }}
        />
      </Card>

      <Modal
        title={editingResource ? "Edit Facility" : "Add New Facility"}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleModalSubmit}
        okText={editingResource ? "Save Changes" : "Create"}
        confirmLoading={submitting}
        okButtonProps={{ disabled: !isFormValid(), style: { borderRadius: 6 } }}
        cancelButtonProps={{ style: { borderRadius: 6 } }}
        centered
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="name"
            label="Facility Name"
            rules={[
              { required: true, message: 'Name is required', whitespace: true },
              { min: 3, message: 'Min 3 characters required' },
              { max: 50, message: 'Max 50 characters allowed' }
            ]}
          >
            <Input placeholder="Enter facility name" style={{ borderRadius: 6 }} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Type"
                rules={[{ required: true, message: 'Type is required' }]}
              >
                <Select placeholder="Select type">
                  <Select.Option value="Lab">Lab</Select.Option>
                  <Select.Option value="Hall">Hall</Select.Option>
                  <Select.Option value="Room">Room</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="capacity"
                label="Capacity"
                rules={[
                  { required: true, message: 'Capacity is required' },
                  { type: 'number', min: 1, message: 'Must be > 0' },
                  { type: 'number', max: 1000, message: 'Max 1000' }
                ]}
              >
                <InputNumber placeholder="e.g. 50" style={{ width: '100%', borderRadius: 6 }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="location"
            label="Location"
            rules={[
              { required: true, message: 'Location is required', whitespace: true },
              { min: 3, message: 'Min 3 characters required' }
            ]}
          >
            <Input placeholder="e.g. Block A, Floor 2" style={{ borderRadius: 6 }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Status is required' }]}
          >
            <Select placeholder="Select current status">
              <Select.Option value="AVAILABLE">AVAILABLE</Select.Option>
              <Select.Option value="NOT_AVAILABLE">NOT AVAILABLE</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FacilitiesModule;
