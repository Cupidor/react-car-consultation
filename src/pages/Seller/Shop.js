import React, { PureComponent } from 'react';
import { Space, Typography, message, Modal, Button, List, Card } from 'antd';
import global from '@/global.less';
import Footer from '@/components/Footer';
import {
  ShopOutlined,
  DeleteOutlined, SettingOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';

import { queryUser } from '@/services/user';
import { createCarStore, updateCarStore } from '@/services/car_store';
import NewCar from '@/pages/Seller/components/NewCar'
import { getCarsQueryByCondition, deleteCar } from '@/services/car';

const { Text, Title } = Typography;
const { confirm } = Modal;
const { Meta } = Card;

class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      car_stores: [],
      store_name: '',
      store_id: 0,
      isOpend: false,
      type: '添加车辆',
      cars: [],
      carInfo: null
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
          if (this.state.car_stores.length === 0) {
            this.createStore()
          } else {
            this.setState({
              store_name: res.result.car_stores[0].store_name,
              store_id: res.result.car_stores[0].id
            }, () => {
              this.getAllCar()
            })
          }
        },
      );
    } else {
      message.error(res.message);
    }
  };

  // 获取店铺车辆
  getAllCar = async () => {
    const { store_id } = this.state
    let res = await getCarsQueryByCondition({
      carStoreId: store_id
    });
    if (res.code === '0000') {
      let cars = []
      for (let item of res.result) {
        let obj = Object.create(null)
        obj.id = item.id
        obj.create_time = item.create_time
        obj.brand_name = item.brand_name
        obj.model = item.model
        obj.car_type = item.car_type
        obj.color = item.color
        cars.push(obj)
      }
      cars.sort((a, b) => b.create_time - a.create_time)
      this.setState({
        cars
      })
    } else {
      message.error(res.message);
    }
  }

  // 创建店铺
  createStore = async () => {
    let res = await createCarStore({
      storeName: `${localStorage.getItem('userName')}的店铺`,
      masterUserId: localStorage.getItem('userId'),
      location: ''
    });
    if (res.code === '0000') {
      this.getAdminDetail()
    } else {
      message.error(res.message);
    }
  };


  // 修改店铺名称
  setStoreName = async (name) => {
    if (name === '') {
      message.warning('店铺名称不可为空')
      return
    }
    const { car_stores } = this.state
    let res = await updateCarStore({
      storeName: name,
      carStoreId: car_stores[0].id
    });
    if (res.code === '0000') {
      this.setState({
        store_name: name
      })
    } else {
      message.error(res.message);
    }
  }

  // 添加车辆
  addCar = () => {
    this.setState({
      type: '添加车辆',
    }, () => {
      this.setNewCarModalStatus(true)
    })
  }

  // 设置弹出框状态
  setNewCarModalStatus = (status) => {
    this.setState({
      isOpend: status
    })
  }

  // 编辑车辆
  updateCar = (item) => {
    this.setState({
      type: '编辑车辆',
      carInfo: item
    }, () => {
      this.setNewCarModalStatus(true)
    })
  }

  // 删除车辆
  deleteCar = async (id) => {
    confirm({
      title: '确定删除该车辆?',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        let res = await deleteCar({
          carId: id,
        });
        if (res.code === '0000') {
          this.getAllCar()
        } else {
          message.error(res.message);
        }
      },
      onCancel() { },
    });

  }

  render() {
    const { store_name, cars } = this.state;
    return (
      <div className={global.MyMain}>
        <div className={global.MyContent}>
          <div className={global.MyHeader} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Space>
              <ShopOutlined style={{ fontSize: 20, color: '#0170BF', marginRight: 5 }} />
              <div className={global.MyTitle}>
                <Text style={{ fontSize: 16 }} editable={{
                  tooltip: '修改店铺名称',
                  onChange: this.setStoreName,
                }}>{store_name}</Text>
              </div>
            </Space>
            <Button type='primary' onClick={this.addCar}>添加车辆</Button>
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
                        <Text
                          onClick={this.updateCar.bind(this, item)}
                        >
                          <SettingOutlined key="setting" style={{ marginRight: 5 }} />
                        编辑
                      </Text>,
                        <Text onClick={this.deleteCar.bind(this, item.id)}>
                          <DeleteOutlined key="more" style={{ marginRight: 5 }} />
                      删除
                       </Text>
                      ]}
                    >
                      <Meta
                        title={item.brand_name}
                        description={`车辆型号：${item.model}，车辆类型：${item.car_type}`}
                      />
                      <Meta description={`车辆颜色：${item.color}`} />
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
        <NewCar
          visible={this.state.isOpend}
          title={this.state.type}
          detail={this.state.carInfo}
          carStoreId={this.state.store_id}
          closeModal={this.setNewCarModalStatus}
          callBack={this.getAllCar}>
        </NewCar>
      </div>
    );
  }
}

export default Index;
