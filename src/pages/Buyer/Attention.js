import React, { PureComponent } from 'react';
import { Space, Typography, message, Table, List, Divider } from 'antd';
import global from '@/global.less';
import Footer from '@/components/Footer';
import { history } from 'umi'
import { queryUser } from '@/services/user';
import { numberDateFormat } from '@/utils/utils';

const { Text } = Typography;

class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      focusCarStores: [],
      focusCars: [],
    };
  }

  componentDidMount() {
    this.getAdminDetail();
  }

  // 获取登录的用户信息
  getAdminDetail = async () => {
    let res = await queryUser(localStorage.getItem('userId'));
    if (res.code === '0000') {
      let focusCarStores = [],
        focusCars = []
      for (let item of res.result.focusCarStores) {
        if (item.carStore !== null) {
          focusCarStores.push(item.carStore.storeName)
        }
      }
      focusCarStores = [...new Set(focusCarStores)]
      for (let item of res.result.focusCars) {
        let obj = Object.create(null)
        obj.carId = item.carId
        obj.brandName = item.car.brandName
        focusCars.push(obj)
      }
      let obj = {};
      focusCars = focusCars.reduce(function (item, next) {
        obj[next.key] ? '' : obj[next.key] = true && item.push(next);
        return item;
      }, []);
      this.setState(
        {
          focusCarStores,
          focusCars
        },
      );
    } else {
      message.error(res.message);
    }
  };

  render() {
    const { focusCarStores, focusCars } = this.state;
    return (
      <div className={global.MyMain}>
        <div className={global.MyContent}>
          <div className={global.MyHeader}>
            <div className={global.MyTitle}>
              <Text style={{ fontSize: 16 }}>我的关注</Text>
            </div>
          </div>
          <div className={global.MyBody}>
            <Space direction='vertical' style={{ width: '100%' }} size='small'>
              <Divider orientation="left">关注的店铺</Divider>
              <List
                style={{ padding: 20 }}
                dataSource={focusCarStores}
                renderItem={item => (
                  <List.Item>
                    {item}
                  </List.Item>
                )}
              />
              <Divider orientation="left">关注的车辆</Divider>
              <List
                style={{ padding: 20 }}
                dataSource={focusCars}
                renderItem={item => (
                  <List.Item>
                    <a onClick={() => history.push(`/cardetail/${item.carId}`)}> {item.brandName}</a>
                  </List.Item>
                )}
              />
            </Space>
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
