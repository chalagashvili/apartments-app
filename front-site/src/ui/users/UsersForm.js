import React from 'react';
import { Table } from 'antd';


const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Role',
    dataIndex: 'role',
    sortDirections: ['descend'],
    sorter: (a, b) => a.role - b.role,
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    role: 'admin',
    email: 'schalagashvili@gmail.com',
  },
  {
    key: '2',
    name: 'Jim Green',
    role: 'user',
    email: 'ichal13@freeuni.edu.ge',
  },
  {
    key: '3',
    name: 'Joe Black',
    role: 'realtor',
    email: 'chalagashvili5@gmail.com',
  },
  {
    key: '4',
    name: 'Jim Red',
    role: 'user',
    email: 'irakli12@gmail.com',
  },
];

function onChange(pagination, sorter, extra) {
  console.log('params', pagination, sorter, extra);
}


class Users extends React.PureComponent {
  render() {
    return (
      <div >
        <Table columns={columns} dataSource={data} onChange={onChange} bordered tableLayout="fixed" pagination={{ pageSize: 10 }} />
      </div>
    );
  }
}
export default Users;

