import React, { PureComponent } from 'react';
import { Space, Typography, message, Table, Popconfirm } from 'antd';
import global from '@/global.less';
import Footer from '@/components/Footer';
import { getViewRecordQueryByCondition, deleteViewRecord } from '@/services/view_record';
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
    this.getAllHistory();
  }

  // 获取所有浏览记录
  getAllHistory = async () => {
    const { pageSize, currentPage } = this.state;
    this.setState({
      tableLoading: true,
    });
    let res = await getViewRecordQueryByCondition({
      limit: pageSize,
      offset: pageSize * (currentPage - 1),
      sortColumnName: 'create_time',
      sortOrderType: 'desc',
      userId: localStorage.getItem('userId')
    });
    if (res.code === '0000') {
      let records = [];
      for (let item of res.result) {
        let obj = Object.create(null);
        obj.key = item.id;
        obj.createTime = item.createTime;
        obj.brand_name = item.car.brandName;
        obj.model = item.car.carModel;
        obj.carPrice = item.car.carPrice;
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
        this.getAllHistory();
      },
    );
  };

  // 删除记录
  deleteRecord = async (id) => {
    let res = await deleteViewRecord({ viewRecordId: id });
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
        title: '浏览时间',
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
        title: '车辆价格',
        dataIndex: 'carPrice',
        key: 'carPrice',
      },
      {
        title: '车辆颜色',
        dataIndex: 'color',
        key: 'color',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <Space size="middle">
            {record.is_manager !== true && (
              <Popconfirm
                title="确定删除该记录?"
                onConfirm={this.deleteRecord.bind(this, record.key)}
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
              <Text style={{ fontSize: 16 }}>浏览记录</Text>
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
