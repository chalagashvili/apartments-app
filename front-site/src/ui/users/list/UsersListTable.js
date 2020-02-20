import React from 'react';
import PropTypes from 'prop-types';
import { Table, Tag, Divider, Icon, Button, Pagination, Spin } from 'antd';

const { Column } = Table;

const tagColors = {
  realtor: 'volcano',
  client: 'geekblue',
  admin: 'green',
};


class UsersListTable extends React.Component {
  componentDidMount() {
    const { onDidMount } = this.props;
    onDidMount();
  }

  render() {
    const {
      users, pagination: { totalItems, page }, pageSizeOptions, onPageChange, onPaginationChange,
      onEdit, onDelete, onCheck, groupLoading, loading,
    } = this.props;
    const handleCheck = record => onCheck(record._id, record.email, record.role);
    return (
      <Spin spinning={loading}>
        <div >
          <Table
            dataSource={users}
            bordered
            rowKey="_id"
            tableLayout="fixed"
            pagination={false}
          >
            <Column
              title="ID"
              dataIndex="_id"
              render={(text, record) => (
                <span>
                  <a
                    role="button"
                    tabIndex={-1}
                    onClick={() => handleCheck(record)}
                    onKeyDown={() => handleCheck(record)}
                  >
                    {record._id}
                  </a>
                </span>
                    )}
            />
            <Column
              title="Email"
              dataIndex="email"
              render={(text, record) => (
                <span>
                  <a
                    role="button"
                    tabIndex={-2}
                    onClick={() => handleCheck(record)}
                    onKeyDown={() => handleCheck(record)}
                  >
                    {record.email}
                  </a>
                </span>
          )}
            />
            <Column title="Name" dataIndex="name" />
            <Column
              title="Role"
              dataIndex="role"
              render={
            role => <Tag color={tagColors[role]}>{role.toUpperCase()}</Tag>
          }
            />
            <Column
              title="Actions"
              render={(text, record) =>
              (
                <span>
                  <Button type="primary" onClick={() => onEdit(record._id)} >
                    <Icon type="edit" />
                  </Button>
                  <Divider type="vertical" />
                  <Button
                    type="danger"
                    loading={groupLoading[record._id]}
                    onClick={() => onDelete(record._id)}
                  >
                    <Icon type="delete" />
                  </Button>
                </span>)}
            />
          </Table>
          <div className="apartment__pagination" >
            <Pagination
              current={page}
              defaultCurrent={1}
              total={totalItems}
              showSizeChanger
              onChange={onPageChange}
              pageSizeOptions={pageSizeOptions}
              onShowSizeChange={onPaginationChange}
            />
          </div>
        </div>
      </Spin>
    );
  }
}

UsersListTable.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({})),
  onDidMount: PropTypes.func.isRequired,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.string),
  onPageChange: PropTypes.func.isRequired,
  onPaginationChange: PropTypes.func.isRequired,
  pagination: PropTypes.shape({
    totalItems: PropTypes.number,
    page: PropTypes.number,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCheck: PropTypes.func.isRequired,
  groupLoading: PropTypes.shape({}),
  loading: PropTypes.bool,
};

UsersListTable.defaultProps = {
  users: [],
  pageSizeOptions: ['1', '5', '10', '20'],
  groupLoading: {},
  loading: false,
};

export default UsersListTable;

