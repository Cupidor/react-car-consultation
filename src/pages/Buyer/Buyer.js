import React, { PureComponent } from 'react';
import { Space, Typography, message, List, Card, Input } from 'antd';
import global from '@/global.less';
import Footer from '@/components/Footer';
import {
  ArrowRightOutlined
} from '@ant-design/icons';
import { getCarsQueryByCondition } from '@/services/car';
import { history } from 'umi'

const { Text } = Typography;
const { Meta } = Card;
const { Search } = Input;

class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cars: [],
      searchValue: ''
    };
  }

  componentDidMount() {
    this.getAllCar()
  }

  // 获取店铺车辆
  getAllCar = async () => {
    const { searchValue } = this.state
    let res = await getCarsQueryByCondition();
    if (res.code === '0000') {
      let cars = []
      for (let item of res.result) {
        let obj = Object.create(null)
        obj.id = item.id
        obj.create_time = item.createTime
        obj.brand_name = item.brandName
        obj.model = item.carModel
        obj.carPrice = item.carPrice
        obj.color = item.color
        obj.car_store = item.carStore
        if (obj.brand_name.indexOf(searchValue) !== -1
          || obj.model.indexOf(searchValue) !== -1
          || obj.color.indexOf(searchValue) !== -1) {
          cars.push(obj)
        }
      }
      cars.sort((a, b) => b.create_time - a.create_time)
      this.setState({
        cars
      })
    } else {
      message.error(res.message);
    }
  }

  // 搜索
  onSearch = (searchValue) => {
    this.setState({
      searchValue
    }, () => {
      this.getAllCar()
    })
  }

  // 查看车辆详情
  showDetail = (carId) => {
    history.push(`/cardetail/${carId}`)
  }

  render() {
    const { cars } = this.state;
    return (
      <div className={global.MyMain}>
        <div className={global.MyContent}>
          <div className={global.MyHeader} style={{ display: 'flex', justifyContent: 'center' }}>
            <Space>
              <Search
                placeholder="输入想要购买的车辆名称/型号/类型/颜色"
                enterButton="搜索"
                size="large"
                onSearch={this.onSearch}
                style={{ width: 500 }} />
            </Space>
          </div>
          <div className={global.MyBody}>
            <div className={global.MyBodyRight} style={{ padding: 12 }}>
              <List
                grid={{ gutter: 16, column: 5 }}
                dataSource={cars}
                renderItem={item => (
                  <List.Item>
                    <Card
                      cover={
                        <div>
                          {item.color === '红色' && <img
                            alt="example"
                            style={{ width: '100%', padding: 5 }}
                            src="https://upload.chebaba.com/shop/car_type/2020-10-29-22-33-49-5f9ad2cdab28d.jpg"
                          />}
                          {item.color === '蓝色' && <img
                            alt="example"
                            style={{ width: '100%', padding: 5 }}
                            src="https://upload.chebaba.com/shop/car_type/2020-09-30-10-46-12-5f73f174256a5.jpg"
                          />}
                          {item.color === '橙色' && <img
                            alt="example"
                            style={{ width: '100%', padding: 5 }}
                            src="https://upload.chebaba.com/shop/car_type/2020-08-28-22-56-34-5f491b22da059.jpg"
                          />}
                          {item.color === '金色' && <img
                            alt="example"
                            style={{ width: '100%', padding: 5 }}
                            src="https://upload.chebaba.com/shop/car_type/2019-11-06-11-02-17-5dc237b9cd9d3.jpg"
                          />}
                          {item.color === '白色' && <img
                            alt="example"
                            style={{ width: '100%', padding: 5 }}
                            src="https://upload.chebaba.com/shop/car_type/2020-09-24-22-06-02-5f6ca7ca3fda2.jpg"
                          />}
                        </div>
                      }
                      actions={[
                        <Text onClick={this.showDetail.bind(this, item.id)}>
                          <ArrowRightOutlined key="setting" style={{ marginRight: 5 }} />
                        查看详情
                      </Text>
                      ]}
                    >
                      <Meta
                        title={item.brand_name}
                        description={`车辆型号：${item.model}`}
                      />
                      <Meta
                        description={`店铺名称：${item.car_store.storeName}`}
                      />
                    </Card>
                  </List.Item>
                )}
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
