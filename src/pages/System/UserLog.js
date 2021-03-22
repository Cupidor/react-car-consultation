import React, { PureComponent } from 'react';
import { Typography, message, Table } from 'antd';
import global from '@/global.less';
import Footer from '@/components/Footer';
import { queryLogByCondition } from '@/services/​scrapyLog​';
import { numberDateFormat } from '@/utils/utils';

const { Text } = Typography;

class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      logs: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableLoading: false,
    };
  }

  componentDidMount() {
    this.getAllLogs();
  }

  // 获取所有日志
  getAllLogs = async () => {
    const { pageSize, currentPage } = this.state;
    this.setState({
      tableLoading: true,
    });
    let res = await queryLogByCondition(
      pageSize,
      pageSize * (currentPage - 1),
      'create_time',
      'desc',
    );
    if (res.code === '0000') {
      let logs = [];
      for (let item of res.result) {
        let obj = Object.create(null);
        obj.key = item.id;
        obj.createTime = item.create_time;
        obj.detail = item.detail;
        logs.push(obj);
      }
      this.setState({
        logs,
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
        this.getAllLogs();
      },
    );
  };

  render() {
    const { logs } = this.state;
    const columns = [
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 300,
        render: (text) => <span>{numberDateFormat(text, 'yyyy-MM-dd HH:mm')}</span>,
      },
      {
        title: '详情',
        dataIndex: 'detail',
        key: 'detail',
      },
    ];
    return (
      <div className={global.MyMain}>
        <div className={global.MyContent}>
          <div className={global.MyHeader}>
            <div className={global.MyTitle}>
              <Text style={{ fontSize: 16 }}>爬虫日志</Text>
            </div>
          </div>
          <div className={global.MyBody}>
            <div className={global.MyBodyRight}>
              <Table
                loading={this.state.tableLoading}
                columns={columns}
                dataSource={logs}
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
