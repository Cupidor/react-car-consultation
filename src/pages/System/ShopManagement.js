import React, { PureComponent } from 'react';
import { Space, Typography, message, Modal, Table, Tag, Popconfirm } from 'antd';
import global from '@/global.less';
import Footer from '@/components/Footer';
import { queryUserByCondition, deleteUser } from '@/services/user';
import { numberDateFormat } from '@/utils/utils';

const { Text, Title } = Typography;
const { confirm } = Modal;

class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      searchValue: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      isNewUserVisible: false,
      userType: '',
      tableLoading: false,
    };
    this.info = null;
    this.userInfo = null;
  }

  componentDidMount() {
    this.getAllUsers();
  }

  // 获取所有用户
  getAllUsers = async () => {
    const { pageSize, searchValue, currentPage } = this.state;
    this.setState({
      tableLoading: true,
    });
    let res = await queryUserByCondition(
      pageSize,
      pageSize * (currentPage - 1),
      'create_time',
      'desc',
      '商家'
    );
    if (res.code === '0000') {
      let users = [];
      for (let item of res.result) {
        let obj = Object.create(null);
        obj.key = item.id;
        obj.createTime = item.create_time;
        obj.real_name = item.real_name;
        obj.user_name = item.user_name;
        obj.latest_update_time = item.latest_update_time;
        obj.password = item.password;
        obj.telephone = item.telephone;
        obj.user_type = item.user_type;
        obj.car_stores = item.car_stores
        users.push(obj);
      }
      this.setState({
        users,
        total: res.total_num,
        tableLoading: false,
      });
    } else {
      message.error(res.message);
    }
  };

  // 查询用户
  onSearch = (value) =>
    this.setState({ searchValue: value, currentPage: 1 }, () => {
      this.getAllUsers();
    });

  // 分页页面跳转
  onPageChange = (page, pageSize) => {
    this.setState(
      {
        currentPage: page,
      },
      () => {
        this.getAllUsers();
      },
    );
  };

  // 删除用户
  deleteCurrentUser = async (id) => {
    let res = await deleteUser({ sUserId: id });
    if (res.code === '0000') {
      message.success('删除商家成功');
      this.getAllUsers();
    } else {
      message.error(res.message);
    }
  };

  render() {
    const { users } = this.state;
    const columns = [
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text) => <span>{numberDateFormat(text, 'yyyy-MM-dd HH:mm')}</span>,
      },
      {
        title: '商家名称',
        dataIndex: 'user_name',
        key: 'user_name',
      },
      {
        title: '真实姓名',
        dataIndex: 'real_name',
        key: 'real_name',
      },
      {
        title: '店铺名称',
        dataIndex: 'car_stores',
        key: 'car_stores',
        render: (text) => <span>{text.length === 0 ? '' : text[0].store_name}</span>,
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <Space size="middle">
            {/*<a style={{ color: 'green' }} onClick={this.editCurrentUser.bind(this, record)}>
              编辑
        </a>*/}
            {record.is_manager !== true && (
              <Popconfirm
                title="确定删除该用户?"
                onConfirm={this.deleteCurrentUser.bind(this, record.key)}
              >
                <a style={{ color: 'red' }}>删除</a>
              </Popconfirm>
            )}
          </Space>
        ),
      },
    ];
    return (
      <div className={global.MyMain}>
        <div className={global.MyContent}>
          <div className={global.MyHeader}>
            <div className={global.MyTitle}>
              <Text style={{ fontSize: 16 }}>商家管理</Text>
            </div>
            <Space>
              {/*<Search placeholder="请输入用户名或姓名" onSearch={this.onSearch} enterButton />*/}
            </Space>
          </div>
          <div className={global.MyBody}>
            <div className={global.MyBodyRight}>
              <Table
                loading={this.state.tableLoading}
                columns={columns}
                dataSource={users}
                pagination={{
                  hideOnSinglePage: true,
                  showQuickJumper: true,
                  showSizeChanger: false,
                  current: this.state.currentPage,
                  pageSize: this.state.pageSize,
                  total: this.state.total,
                  onChange: (page, pageSize) => this.onPageChange(page, pageSize),
                }}
              />
            </div>
          </div>
        </div>
        <div className={global.MyFooter}>
          <Footer />
        </div>
      </div>
    );
  }
}

export default Index;
