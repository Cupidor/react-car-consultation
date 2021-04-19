import React, { PureComponent } from 'react';
import { Space, Typography, message, Table, Popconfirm, Rate } from 'antd';
import global from '@/global.less';
import Footer from '@/components/Footer';
import { getShoppingOrderQueryByCondition, deleteShoppingOrder, updateShoppingOrder } from '@/services/shopping_order';
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
      creatorId: localStorage.getItem('userId')
    });
    if (res.code === '0000') {
      let records = [];
      for (let item of res.result) {
        let obj = Object.create(null);
        obj.key = item.id;
        obj.createTime = item.createTime;
        obj.order_no = item.orderNo;
        obj.orderState = item.orderState
        obj.comment = item.comment
        obj.shopping_lists = item.shoppingLists
        obj.orderState = item.orderState
        let total = 0
        for (let ele of item.shoppingLists) {
          total += ele.carPrice * ele.num
        }
        obj.total = total
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

  // 评价
  handleChangeRate = async (id, e) => {
    let res = await updateShoppingOrder({ shoppingOrderId: id, comment: e });
    if (res.code === '0000') {
      message.success('订单评价成功');
      this.getAllOrder();
    } else {
      message.error(res.message);
    }
  }


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
              return <span key={index}>{item.car.brandName}/{item.car.carModel}/{item.car.color}*{item.num}</span>
            })}
          </Space>
        ),
      },
      {
        title: '订单总价',
        dataIndex: 'total',
        key: 'total',
        render: (text) => <span>{text} 元</span>
      },
      {
        title: '订单状态',
        dataIndex: 'orderState',
        key: 'orderState',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <Space size="middle">
            {record.orderState === '已确认' ? <Rate onChange={this.handleChangeRate.bind(this, record.key)} value={record.comment === '' ? 0 : record.comment} /> : <Popconfirm
              title="确定取消该订单?"
              onConfirm={this.deleteRecord.bind(this, record.key)}
            >
              <a style={{ color: 'red' }}>取消订单</a>
            </Popconfirm>}
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
