import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Input, Select, InputNumber, Button, Modal, DatePicker, TimePicker, Form, notification, Tag, Spin, Alert } from 'antd';
import { SearchOutlined, EnvironmentOutlined, TeamOutlined, DesktopOutlined, ScheduleOutlined } from '@ant-design/icons';
import { facilityApi, type Facility } from '../../api/facilityApi';
import { bookingApi } from '../../api/bookingApi';
import { useAuthStore } from '../../store/authStore';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = TimePicker;

const UserFacilityCatalogue: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [capacityFilter, setCapacityFilter] = useState<number | undefined>();

  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'IDLE' | 'AVAILABLE' | 'UNAVAILABLE'>('IDLE');
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [form] = Form.useForm();
  
  const { user } = useAuthStore();

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const res = await facilityApi.getAll();
      setFacilities(res);
    } catch (e) {
      notification.error({ message: 'Failed to fetch facilities' });
    } finally {
      setLoading(false);
    }
  };

  const filteredFacilities = facilities.filter(f => 
    f.name.toLowerCase().includes(searchText.toLowerCase()) &&
    (typeFilter ? f.type === typeFilter : true) &&
    (capacityFilter ? f.capacity >= capacityFilter : true)
  );

  const openBookingModal = (facility: Facility) => {
    setSelectedFacility(facility);
    setBookingModalVisible(true);
    setAvailabilityStatus('IDLE');
    form.resetFields();
  };

  const closeBookingModal = () => {
    setBookingModalVisible(false);
    setSelectedFacility(null);
  };

  const checkAvailability = async () => {
    try {
      const values = await form.validateFields(['date', 'timeRange']);
      const selectedDate = values.date.format('YYYY-MM-DD');
      const start = values.timeRange[0];
      const end = values.timeRange[1];

      setCheckingAvailability(true);
      const bookings = await facilityApi.getAvailability(selectedFacility!.id!, selectedDate);
      
      // Check overlaps locally against the fetched bookings
      let isOverlap = false;
      for (const b of bookings) {
        if (b.status === 'REJECTED') continue;
        const bStart = dayjs(`${selectedDate} ${b.startTime}`);
        const bEnd = dayjs(`${selectedDate} ${b.endTime}`);
        
        // Exact logic as backend
        if (start.isBefore(bEnd) && end.isAfter(bStart)) {
          isOverlap = true;
          break;
        }
      }

      if (isOverlap) {
        setAvailabilityStatus('UNAVAILABLE');
      } else {
        setAvailabilityStatus('AVAILABLE');
      }
    } catch (e) {
      // Form validation failed
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleBooking = async () => {
    try {
      await form.validateFields();
      if (availabilityStatus !== 'AVAILABLE') {
        notification.warning({ message: 'Please check availability first' });
        return;
      }

      setSubmittingBooking(true);
      const values = form.getFieldsValue();
      const payload = {
        facilityId: selectedFacility!.id!,
        userId: user!.username,
        date: values.date.format('YYYY-MM-DD'),
        startTime: values.timeRange[0].format('HH:mm:ss'),
        endTime: values.timeRange[1].format('HH:mm:ss'),
      };

      await bookingApi.create(payload);
      notification.success({ message: 'Booking successful!' });
      closeBookingModal();
    } catch (e: any) {
      notification.error({ message: e.response?.data?.error || 'Failed to create booking' });
      setAvailabilityStatus('UNAVAILABLE');
    } finally {
      setSubmittingBooking(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col><Title level={4} style={{ margin: 0 }}>Facility Catalogue</Title></Col>
      </Row>

      <Card style={{ marginBottom: 24, borderRadius: 12 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Input 
              placeholder="Search by name" 
              prefix={<SearchOutlined />} 
              value={searchText} 
              onChange={e => setSearchText(e.target.value)} 
              allowClear 
            />
          </Col>
          <Col xs={24} sm={8}>
            <Select 
              placeholder="Filter by type" 
              style={{ width: '100%' }} 
              allowClear 
              onChange={val => setTypeFilter(val)}
            >
              <Select.Option value="Lab">Lab</Select.Option>
              <Select.Option value="Hall">Hall</Select.Option>
              <Select.Option value="Room">Room</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <InputNumber 
              placeholder="Min Capacity" 
              onChange={val => setCapacityFilter(val ? Number(val) : undefined)} 
            />
          </Col>
        </Row>
      </Card>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}><Spin size="large" /></div>
      ) : filteredFacilities.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '40px', borderRadius: 12 }}>
           <Typography.Text type="secondary">No results found. Try adjusting your search filters.</Typography.Text>
        </Card>
      ) : (
        <Row gutter={[24, 24]}>
          {filteredFacilities.map(facility => (
            <Col xs={24} sm={12} lg={8} key={facility.id}>
              <Card 
                hoverable 
                style={{ borderRadius: 12, height: '100%', display: 'flex', flexDirection: 'column' }}
                actions={[
                  <Button 
                    type="primary" 
                    icon={<ScheduleOutlined />} 
                    disabled={facility.status !== 'AVAILABLE'}
                    onClick={() => openBookingModal(facility)}
                    style={{ borderRadius: 6, width: '80%' }}
                  >
                    {facility.status === 'AVAILABLE' ? 'Book Now' : 'Unavailable'}
                  </Button>
                ]}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <Title level={5} style={{ margin: 0 }}>{facility.name}</Title>
                  <Tag color={facility.type === 'Lab' ? 'purple' : facility.type === 'Hall' ? 'geekblue' : 'cyan'}>
                    {facility.type}
                  </Tag>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#555' }}>
                  <span><EnvironmentOutlined /> {facility.location}</span>
                  <span><TeamOutlined /> Capacity: {facility.capacity}</span>
                  <span><DesktopOutlined /> Status: <Tag color={facility.status === 'AVAILABLE' ? 'green' : 'red'}>{facility.status.replace('_', ' ')}</Tag></span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title={`Book ${selectedFacility?.name}`}
        open={bookingModalVisible}
        onCancel={closeBookingModal}
        footer={[
          <Button key="cancel" onClick={closeBookingModal}>Cancel</Button>,
          <Button 
             key="book" 
             type="primary" 
             disabled={availabilityStatus !== 'AVAILABLE'} 
             loading={submittingBooking}
             onClick={handleBooking}
          >
            Confirm Booking
          </Button>
        ]}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }} onValuesChange={() => setAvailabilityStatus('IDLE')}>
          <Form.Item name="date" label="Select Date" rules={[{ required: true, message: 'Please select a date' }]}>
            <DatePicker style={{ width: '100%' }} disabledDate={current => current && current < dayjs().startOf('day')} />
          </Form.Item>
          
          <Form.Item name="timeRange" label="Select Time Slot" rules={[{ required: true, message: 'Please select a time range' }]}>
            <RangePicker style={{ width: '100%' }} format="HH:mm" minuteStep={15} />
          </Form.Item>

          <Button 
            type="dashed" 
            block 
            onClick={checkAvailability} 
            loading={checkingAvailability}
            style={{ marginBottom: 16 }}
          >
            Check Availability
          </Button>

          {availabilityStatus === 'AVAILABLE' && (
            <Alert message="Facility is available for this time slot!" type="success" showIcon />
          )}
          {availabilityStatus === 'UNAVAILABLE' && (
            <Alert message="Facility is already booked for this time slot. Please choose another." type="error" showIcon />
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default UserFacilityCatalogue;
