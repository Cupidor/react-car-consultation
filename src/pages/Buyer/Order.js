import React, { PureComponent } from 'react';
import { Space, Typography, message, Table, Popconfirm } from 'antd';
import global from '@/global.less';
import Footer from '@/components/Footer';
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
    this.getAllOrder();
  }

  // 获取所有订单
  getAllOrder = async () => {
    const { pageSize, currentPage } = this.state;
    this.setState({
      tableLoading: true,
    });
    let res = await getShoppingOrderQueryByCondition({
      limit: pageSize,
      offset: pageSize * (currentPage - 1),
      sortColumnName: 'create_time',
      sortOrderType: 'desc',
      SUserId: localStorage.getItem('userId')
    });
    if (res.code === '0000') {
      let records = [];
      for (let item of res.result) {
        let obj = Object.create(null);
        obj.key = item.id;
        obj.createTime = item.create_time;
        obj.order_no = item.order_no;
        obj.shopping_lists = item.shopping_lists
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
      message.success('取消订单成功');
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
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <Space size="middle">
            {record.is_manager !== true && (
              <Popconfirm
                title="确定取消该订单?"
                onConfirm={this.deleteRecord.bind(this, record.key)}
              >
                <a style={{ color: 'red' }}>取消订单</a>
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
