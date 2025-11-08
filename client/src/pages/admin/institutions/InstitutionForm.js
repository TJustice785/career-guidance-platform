import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Space,
  Upload,
  message,
  Switch,
  Row,
  Col,
  Spin,
  Select,
} from 'antd';
import { SaveOutlined, ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import api from '../../../../services/api';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const InstitutionForm = ({ isEdit = false }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  useEffect(() => {
    if (isEdit && id) {
      fetchInstitution();
    }
  }, [id, isEdit]);

  const fetchInstitution = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/institutions/${id}`);
      const institution = response.data.data;
      
      form.setFieldsValue({
        ...institution,
        isActive: institution.isActive !== false, // default to true if undefined
      });
      
      if (institution.logoUrl) {
        setLogoPreview(institution.logoUrl);
      }
    } catch (error) {
      console.error('Error fetching institution:', error);
      message.error('Failed to load institution data');
      navigate('/admin/institutions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      
      // Append all form values
      Object.keys(values).forEach(key => {
        if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });
      
      // Append logo file if it's a new file
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      if (isEdit) {
        await api.put(`/admin/institutions/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        message.success('Institution updated successfully');
      } else {
        await api.post('/admin/institutions', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        message.success('Institution created successfully');
      }
      
      navigate('/admin/institutions');
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error(`Failed to ${isEdit ? 'update' : 'create'} institution: ${error.response?.data?.message || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogoChange = (info) => {
    if (info.file) {
      const isImage = info.file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return Upload.LIST_IGNORE;
      }
      
      const isLt2M = info.file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
        return Upload.LIST_IGNORE;
      }
      
      setLogoFile(info.file);
      setLogoPreview(URL.createObjectURL(info.file));
    }
    return false; // Prevent default upload behavior
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
    }
    return isImage && isLt2M;
  };

  return (
    <div className="institution-form">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ marginBottom: 16 }}
        >
          Back to List
        </Button>
        
        <Title level={3}>
          {isEdit ? 'Edit Institution' : 'Add New Institution'}
        </Title>
        
        <Card loading={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              isActive: true,
            }}
          >
            <Row gutter={24}>
              <Col xs={24} md={16}>
                <Form.Item
                  name="name"
                  label="Institution Name"
                  rules={[
                    { required: true, message: 'Please enter institution name' },
                    { min: 3, message: 'Name must be at least 3 characters' },
                    { max: 100, message: 'Name cannot exceed 100 characters' },
                  ]}
                >
                  <Input placeholder="Enter institution name" />
                </Form.Item>
                
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: 'Please enter email' },
                        { type: 'email', message: 'Please enter a valid email' },
                      ]}
                    >
                      <Input placeholder="Enter email address" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="phone"
                      label="Phone Number"
                      rules={[
                        { pattern: /^[0-9+\-\s()]*$/, message: 'Please enter a valid phone number' },
                      ]}
                    >
                      <Input placeholder="Enter phone number" />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Form.Item
                  name="website"
                  label="Website"
                  rules={[
                    { type: 'url', message: 'Please enter a valid URL' },
                  ]}
                >
                  <Input placeholder="https://institution.co.ls" />
                </Form.Item>
                
                <Form.Item
                  name="address"
                  label="Address"
                >
                  <TextArea rows={3} placeholder="Enter full address" />
                </Form.Item>
                
                <Form.Item
                  name="description"
                  label="Description"
                >
                  <TextArea rows={4} placeholder="Enter institution description" />
                </Form.Item>
                
                <Form.Item
                  name="isActive"
                  label="Status"
                  valuePropName="checked"
                >
                  <Switch
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                    defaultChecked
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={8}>
                <Form.Item
                  label="Institution Logo"
                  extra="Upload a square logo (max 2MB)"
                >
                  <Upload
                    name="logo"
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleLogoChange}
                  >
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Institution Logo"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Upload Logo</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
                
                <div style={{ marginTop: 24 }}>
                  <Text type="secondary">
                    <strong>Note:</strong> All fields marked with an asterisk (*) are required.
                  </Text>
                </div>
              </Col>
            </Row>
            
            <div style={{ marginTop: 24, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => navigate('/admin/institutions')}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  icon={<SaveOutlined />}
                >
                  {isEdit ? 'Update Institution' : 'Create Institution'}
                </Button>
              </Space>
            </div>
          </Form>
        </Card>
      </Space>
    </div>
  );
};

export default InstitutionForm;
