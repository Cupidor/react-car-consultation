import React, { PureComponent } from 'react';
import { Space, Typography, message, Modal, Table, Tag, Popconfirm } from 'antd';
import global from '@/global.less';
import Footer from '@/components/Footer';
import { getShoppintListQueryByCondition } from '@/services/shoppint_list';
import { numberDateFormat } from '@/utils/utils';

const { Text, Title } = Typography;
const { confirm } = Modal;

class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      records: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableLoading: false,
    };
  }

  componentDidMount() {
    this.getAllHistory();
  }

  // 获取所有浏览记录
  getAllHistory = async () => {
    const { pageSize, currentPage } = this.state;
    this.setState({
      tableLoading: true,
    });
    let res = await getShoppintListQueryByCondition({
      limit: pageSize,
      offset: pageSize * (currentPage - 1),
      sortColumnName: 'create_time',
      sortOrderType: 'desc',
      SUserId: localStorage.getItem('userId')
    });
    if (res.code === '0000') {
      console.log(res.result)
      let records = [];
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
        records.push(obj);
      }
      this.setState({
        records,
        total: res.total_num,
        tableLoading: false,
      });
    } else {
      message.error(res.message);
    }
  };

  // 分页页面跳转
  onPageChange = (page, pageSize) => {
    this.setState(
      {
        currentPage: page,
      },
      () => {
        this.getAllHistory();
      },
    );
  };

  // 删除用户
  deleteCurrentUser = async (id) => {
    let res = await deleteUser({ sUserId: id });
    if (res.code === '0000') {
      message.success('删除记录成功');
      this.getAllHistory();
    } else {
      message.error(res.message);
    }
  };

  render() {
    const { records } = this.state;
    const columns = [
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text) => <span>{numberDateFormat(text, 'yyyy-MM-dd HH:mm')}</span>,
      },
      {
        title: '用户名',
        dataIndex: 'user_name',
        key: 'user_name',
      },
      {
        title: '真实姓名',
        dataIndex: 'real_name',
        key: 'real_name',
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
              <Text style={{ fontSize: 16 }}>我的购物车</Text>
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
                dataSource={records}
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
