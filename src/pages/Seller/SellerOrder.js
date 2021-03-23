import React, { PureComponent } from 'react';
import { Space, Typography, message, Table, Popconfirm } from 'antd';
import global from '@/global.less';
import Footer from '@/components/Footer';
import { queryUser } from '@/services/user';
import { getShoppingOrderQueryByCondition, deleteShoppingOrder } from '@/services/shopping_order';
import { numberDateFormat } from '@/utils/utils';

const { Text } = Typography;

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
    this.getAdminDetail();
  }

  // 获取登录的用户信息
  getAdminDetail = async () => {
    let res = await queryUser(localStorage.getItem('userId'));
    if (res.code === '0000') {
      this.setState(
        {
          car_stores: res.result.car_stores,
        },
        () => {
          if (this.state.car_stores.length !== 0) {
            this.setState({
              store_id: res.result.car_stores[0].id
            }, () => {
              this.getAllOrder()
            })
          }
        },
      );
    } else {
      message.error(res.message);
    }
  };

  // 获取所有订单
  getAllOrder = async () => {
    const { pageSize, currentPage, store_id } = this.state;
    this.setState({
      tableLoading: true,
    });
    let res = await getShoppingOrderQueryByCondition({
      limit: pageSize,
      offset: pageSize * (currentPage - 1),
      sortColumnName: 'create_time',
      sortOrderType: 'desc',
      carStoreMasterId: localStorage.getItem('userId')
    });
    if (res.code === '0000') {
      let records = [];
      for (let item of res.result) {
        let obj = Object.create(null);
        obj.key = item.id;
        obj.createTime = item.create_time;
        obj.order_no = item.order_no;
        obj.user_name = item.suser.user_name
        let array = []
        for (let item of item.shopping_lists) {
          if (item.car.car_store_id === store_id) {
            array.push(item)
          }
        }
        obj.shopping_lists = array
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
        this.getAllOrder();
      },
    );
  };

  // 删除订单
  deleteRecord = async (id) => {
    let res = await deleteShoppingOrder({ shoppingOrderId: id });
    if (res.code === '0000') {
      message.success('删除订单成功');
      this.getAllOrder();
    } else {
      message.error(res.message);
    }
  };

  render() {
    const { records } = this.state;
    const columns = [
      {
        title: '下单时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text) => <span>{numberDateFormat(text, 'yyyy-MM-dd HH:mm')}</span>,
      },
      {
        title: '订单编号',
        dataIndex: 'order_no',
        key: 'order_no',
      },
      {
        title: '下单的产品',
        dataIndex: 'shopping_lists',
        key: 'shopping_lists',
        render: (text, record) => (
          <Space direction='vertical'>
            {text.map((item, index) => {
              return <span key={index}>{item.car.brand_name}/{item.car.model}/{item.car.car_type}/{item.car.color}*{item.car_num}</span>
            })}
          </Space>
        ),
      },
      {
        title: '下单用户',
        dataIndex: 'user_name',
        key: 'user_name',
      },
      /*{
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <Space size="middle">
            {record.is_manager !== true && (
              <Popconfirm
                title="确定删除该订单?"
                onConfirm={this.deleteRecord.bind(this, record.key)}
              >
                <a style={{ color: 'red' }}>删除</a>
              </Popconfirm>
            )}
          </Space>
        ),
      },*/
    ];
    return (
      <div className={global.MyMain}>
        <div className={global.MyContent}>
          <div className={global.MyHeader}>
            <div className={global.MyTitle}>
              <Text style={{ fontSize: 16 }}>我的订单</Text>
            </div>
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
