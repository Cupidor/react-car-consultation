import React, { PureComponent } from 'react';
import { Space, Typography, message, Modal, Table, InputNumber, Button } from 'antd';
import global from '@/global.less';
import Footer from '@/components/Footer';
import { getShoppintListQueryByCondition, updateShoppintList, deleteShoppintList } from '@/services/shoppint_list';
import { createShoppingOrder } from '@/services/shopping_order';

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
      selectedRowKeys: []
    };
  }

  componentDidMount() {
    this.getAllGoods();
  }

  // 获取购物车所有产品
  getAllGoods = async () => {
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
      let records = [];
      for (let item of res.result) {
        let obj = Object.create(null);
        obj.key = item.id;
        obj.createTime = item.create_time;
        obj.id = item.id;
        obj.car_num = item.car_num;
        obj.brand_name = item.car.brand_name;
        obj.model = item.car.model;
        obj.car_type = item.car.car_type;
        obj.color = item.car.color;
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
        this.getAllGoods();
      },
    );
  };

  // 数量改变
  onNumChange = (record, num) => {
    if (num !== 0) {
      this.updateShoppingCart(record.id, num)
    } else {
      this.deleteShoppingCart(record.id)
    }
  }

  // 从购物车去除
  deleteShoppingCart = async (id, num) => {
    let res = await deleteShoppintList({ shoppingListId: id });
    if (res.code === '0000') {
      message.success('从购物车移除车辆成功')
      this.getAllGoods();
    } else {
      message.error(res.message);
    }
  }

  // 更新购物车
  updateShoppingCart = async (id, num) => {
    let res = await updateShoppintList({ shoppingListId: id, carNum: num });
    if (res.code === '0000') {
      this.getAllGoods();
    } else {
      message.error(res.message);
    }
  }

  // 生成订单
  addOrder = async () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      message.warning('请勾选要生成订单的产品')
    }
    let res = await createShoppingOrder({ shoppingListIdArr: JSON.stringify(selectedRowKeys), sUserId: localStorage.getItem('userId') });
    if (res.code === '0000') {
      message.success('生成订单成功')
      this.getAllGoods();
    } else {
      message.error(res.message);
    }
  }

  render() {
    const { records, selectedRowKeys } = this.state;
    const columns = [
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text) => <span>{numberDateFormat(text, 'yyyy-MM-dd HH:mm')}</span>,
      },
      {
        title: '品牌名称',
        dataIndex: 'brand_name',
        key: 'brand_name',
      },
      {
        title: '车辆型号',
        dataIndex: 'model',
        key: 'model',
      },
      {
        title: '车辆类型',
        dataIndex: 'car_type',
        key: 'car_type',
      },
      {
        title: '车辆颜色',
        dataIndex: 'color',
        key: 'color',
      },
      {
        title: '数量',
        key: 'car_num',
        render: (text, record) => (
          <InputNumber min={0} value={record.car_num} onChange={this.onNumChange.bind(this, record)} />
        ),
      },
    ];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,
        })
      }
    };
    return (
      <div className={global.MyMain}>
        <div className={global.MyContent}>
          <div className={global.MyHeader} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className={global.MyTitle}>
              <Text style={{ fontSize: 16 }}>我的购物车</Text>
            </div>
            <Space>
              <Button type='primary' onClick={this.addOrder}>生成订单</Button>
            </Space>
          </div>
          <div className={global.MyBody}>
            <div className={global.MyBodyRight}>
              <Table
                rowSelection={{
                  type: 'checkbox',
                  selectedRowKeys: selectedRowKeys,
                  ...rowSelection,
                }}
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
