import React, { useState, useEffect } from 'react';
import { Button, Table, Space, Input, Tag, Typography, Card, message, Popconfirm } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../services/api';

const { Title } = Typography;
const { Search } = Input;

const InstitutionList = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const fetchInstitutions = async (params = {}) => {
    setLoading(true);
    try {
      const { current, pageSize } = pagination;
      const response = await api.get('/admin/institutions', {
        params: {
          page: params.pagination?.current || current,
          limit: params.pagination?.pageSize || pageSize,
          search: params.searchText || searchText,
        },
      });

      setInstitutions(response.data.data);
      setPagination({
        ...params.pagination,
        total: response.data.pagination.total,
        current: response.data.pagination.page,
        pageSize: response.data.pagination.limit,
      });
    } catch (error) {
      console.error('Error fetching institutions:', error);
      message.error('Failed to load institutions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutions({ pagination });
  }, []);

  const handleTableChange = (newPagination, filters, sorter) => {
    fetchInstitutions({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination: newPagination,
      ...filters,
    });
  };

  const handleSearch = (value) => {
    setSearchText(value);
    fetchInstitutions({
      pagination: { ...pagination, current: 1 },
      searchText: value,
    });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/institutions/${id}`);
      message.success('Institution deleted successfully');
      fetchInstitutions({ pagination });
    } catch (error) {
      console.error('Error deleting institution:', error);
      message.error('Failed to delete institution');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.patch(`/admin/institutions/${id}/toggle-status`);
      message.success(`Institution ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchInstitutions({ pagination });
    } catch (error) {
      console.error('Error toggling institution status:', error);
      message.error('Failed to update institution status');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text, record) => (
        <Link to={`/admin/institutions/${record.id}`}>
          {text}
        </Link>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'status',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/institutions/${record.id}`)}
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/institutions/${record.id}/edit`)}
          />
          <Popconfirm
            title="Are you sure you want to delete this institution?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button
            type="link"
            onClick={() => toggleStatus(record.id, record.isActive)}
            danger={record.isActive}
          >
            {record.isActive ? 'Deactivate' : 'Activate'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="institution-list">
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Title level={4}>Institutions</Title>
        <Space>
          <Search
            placeholder="Search institutions..."
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/admin/institutions/new')}
          >
            Add Institution
          </Button>
        </Space>
      </div>
      <Card>
        <Table
          columns={columns}
          rowKey="id"
          dataSource={institutions}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `Total ${total} institutions`,
          }}
          loading={loading}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
};

export default InstitutionList;
