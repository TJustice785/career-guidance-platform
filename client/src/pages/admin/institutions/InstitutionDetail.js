import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Button,
  Tag,
  Space,
  Typography,
  Divider,
  Tabs,
  Badge,
  message,
  Empty,
  Spin,
} from 'antd';
import {
  EditOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import api from '../../../../services/api';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const InstitutionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [institution, setInstitution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    fetchInstitution();
  }, [id]);

  const fetchInstitution = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/institutions/${id}`);
      setInstitution(response.data.data);
    } catch (error) {
      console.error('Error fetching institution:', error);
      message.error('Failed to load institution details');
      navigate('/admin/institutions');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      await api.patch(`/admin/institutions/${id}/toggle-status`);
      message.success(
        `Institution ${institution.isActive ? 'deactivated' : 'activated'} successfully`
      );
      fetchInstitution(); // Refresh data
    } catch (error) {
      console.error('Error toggling status:', error);
      message.error('Failed to update institution status');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/institutions/${id}`);
      message.success('Institution deleted successfully');
      navigate('/admin/institutions');
    } catch (error) {
      console.error('Error deleting institution:', error);
      message.error('Failed to delete institution');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!institution) {
    return (
      <Empty
        description="Institution not found"
        style={{ marginTop: 48 }}
      >
        <Button type="primary" onClick={() => navigate('/admin/institutions')}>
          Back to Institutions
        </Button>
      </Empty>
    );
  }

  return (
    <div className="institution-detail">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          
          <Space>
            <Button
              type={institution.isActive ? 'default' : 'primary'}
              icon={institution.isActive ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
              onClick={handleToggleStatus}
              danger={institution.isActive}
            >
              {institution.isActive ? 'Deactivate' : 'Activate'}
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/institutions/${id}/edit`)}
            >
              Edit
            </Button>
          </Space>
        </div>

        <Card
          title={
            <Space align="center">
              <Title level={3} style={{ margin: 0 }}>
                {institution.name}
              </Title>
              <Tag color={institution.isActive ? 'green' : 'red'}>
                {institution.isActive ? 'Active' : 'Inactive'}
              </Tag>
            </Space>
          }
          extra={
            <Space>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => navigate(`/admin/institutions/${id}/edit`)}
              >
                Edit
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this institution?')) {
                    handleDelete();
                  }
                }}
              >
                Delete
              </Button>
            </Space>
          }
        >
          <Tabs
            defaultActiveKey="details"
            activeKey={activeTab}
            onChange={setActiveTab}
          >
            <TabPane tab="Details" key="details">
              <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
                {institution.logoUrl && (
                  <div style={{ width: 200, flexShrink: 0 }}>
                    <img
                      src={institution.logoUrl}
                      alt={`${institution.name} logo`}
                      style={{ width: '100%', borderRadius: 8, border: '1px solid #f0f0f0' }}
                    />
                  </div>
                )}
                
                <div style={{ flex: 1 }}>
                  <Title level={4} style={{ marginTop: 0 }}>Overview</Title>
                  <Paragraph>{institution.description || 'No description provided.'}</Paragraph>
                  
                  <Space size={[16, 24]} wrap>
                
                  </Space>
                </div>
              </div>
              
              <Divider orientation="left">Contact Information</Divider>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                <Descriptions bordered size="small" column={1}>
                  <Descriptions.Item label="Email">
                    {institution.email ? (
                      <a href={`mailto:${institution.email}`}>
                        <MailOutlined /> {institution.email}
                      </a>
                    ) : (
                      <Text type="secondary">Not provided</Text>
                    )}
                  </Descriptions.Item>
                  
                  <Descriptions.Item label="Phone">
                    {institution.phone ? (
                      <a href={`tel:${institution.phone}`}>
                        <PhoneOutlined /> {institution.phone}
                      </a>
                    ) : (
                      <Text type="secondary">Not provided</Text>
                    )}
                  </Descriptions.Item>
                  
                  <Descriptions.Item label="Website">
                    {institution.website ? (
                      <a href={institution.website} target="_blank" rel="noopener noreferrer">
                        <GlobalOutlined /> {institution.website}
                      </a>
                    ) : (
                      <Text type="secondary">Not provided</Text>
                    )}
                  </Descriptions.Item>
                  
                  <Descriptions.Item label="Address">
                    {institution.address ? (
                      <span>
                        <EnvironmentOutlined /> {institution.address}
                      </span>
                    ) : (
                      <Text type="secondary">Not provided</Text>
                    )}
                  </Descriptions.Item>
                </Descriptions>
              </div>
              
              <Divider orientation="left">Additional Information</Divider>
              
              <Descriptions bordered size="small" column={1}>
                <Descriptions.Item label="Status">
                  <Badge
                    status={institution.isActive ? 'success' : 'error'}
                    text={institution.isActive ? 'Active' : 'Inactive'}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Created At">
                  {new Date(institution.createdAt).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Last Updated">
                  {new Date(institution.updatedAt).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>
            </Tab>
            
            <TabPane tab="Users" key="users">
              <Empty
                description={
                  <span>
                    No users found for this institution.
                  </span>
                }
              >
                <Button type="primary" onClick={() => {}}>
                  Invite User
                </Button>
              </Empty>
            </Tab>
            
            <TabPane tab="Activity" key="activity">
              <Empty
                description="No recent activity"
              />
            </Tab>
          </Tabs>
        </Card>
      </Space>
    </div>
  );
};

export default InstitutionDetail;
