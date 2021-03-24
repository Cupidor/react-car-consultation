import React, { PureComponent } from 'react';
import { Space, Typography, message, Comment, Button, List, Avatar, Input, Image, InputNumber, Form } from 'antd';
import global from '@/global.less';
import Footer from '@/components/Footer';
import {
  ShoppingOutlined
} from '@ant-design/icons';

import { createShoppintList } from '@/services/shoppint_list';
import { createViewRecord } from '@/services/view_record';
import { getCarDetail } from '@/services/car';
import { getCarCommentQueryByCondition, createCarComment } from '@/services/car_comment'
import { numberDateFormat } from '@/utils/utils';

const { Text, Title } = Typography;
const { TextArea } = Input;

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} 条评论`}
    itemLayout="horizontal"
    renderItem={props => <Comment {...props} />}
  />
);


const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        评论
      </Button>
    </Form.Item>
  </>
);

class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      carId: null,
      brand_name: '',
      model: '',
      car_type: '',
      color: '',
      store_name: '',
      carNum: 1,
      submitting: false,
      commentValue: '',
      comments: []
    };
  }

  componentDidMount() {
    if (this.props.match.params !== null)
      this.setState({
        carId: this.props.match.params.carId
      }, () => {
        this.getCarDetail()
        this.getCarComments()
        this.addToHistory()
      })
  }

  // 加入浏览记录
  addToHistory = async () => {
    const { carId } = this.state
    await createViewRecord({
      carId: carId,
      sUserId: localStorage.getItem('userId')
    });
  }

  // 加入购物车
  addToCart = async () => {
    const { carId, carNum } = this.state
    let res = await createShoppintList({
      carId: carId,
      carNum: carNum,
      sUserId: localStorage.getItem('userId')
    });
    if (res.code === '0000') {
      message.success('加入购物车成功')
    } else {
      message.error(res.message);
    }
  }

  // 获取车辆详情
  getCarDetail = async () => {
    const { carId } = this.state
    let res = await getCarDetail({
      carId: carId
    });
    if (res.code === '0000') {
      let json = res.result
      this.setState({
        brand_name: json.brand_name,
        model: json.model,
        car_type: json.car_type,
        color: json.color,
        store_name: json.car_store.store_name,
      })
    } else {
      message.error(res.message);
    }
  }

  // 获取车辆评论
  getCarComments = async () => {
    const { carId } = this.state
    let res = await getCarCommentQueryByCondition({
      carId: carId
    });
    if (res.code === '0000') {
      let json = res.result
      let comments = []
      for (let item of json) {
        let obj = Object.create(null)
        obj.author = item.suser ? item.suser.user_name : ''
        obj.avatar = <Avatar
          size='large'
        >{obj.author.substr(0, 1).toUpperCase()}</Avatar>
        obj.content = item.comment
        obj.create_time = item.create_time
        obj.datetime = numberDateFormat(item.create_time)
        comments.push(obj)
      }
      comments.sort((a, b) => b.create_time - a.create_time)
      this.setState({
        comments
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

  // 车辆数量
  onCarNumChange = (carNum) => {
    this.setState({
      carNum
    })
  }

  handleChange = e => {
    this.setState({
      commentValue: e.target.value,
    });
  };

  // 提交评论
  handleSubmit = async () => {
    const { commentValue, carId } = this.state
    if (!commentValue || commentValue.trim() === '') {
      return;
    }
    this.setState({
      submitting: true,
    });
    let res = await createCarComment({
      carId: carId,
      comment: commentValue,
    });
    if (res.code === '0000') {
      message.success('评论成功')
      this.setState({
        submitting: false,
        commentValue: ''
      }, () => {
        this.getCarComments()
      });
    } else {
      message.error(res.message);
    }
  };


  render() {
    const { color, brand_name, model, car_type, store_name, carNum, submitting, commentValue, comments } = this.state
    return (
      <div className={global.MyMain}>
        <div className={global.MyContent}>
          <div className={global.MyHeader}>
            <div className={global.MyTitle}>
              <Button onClick={() => history.back()}>返回</Button>
              <Text style={{ fontSize: 16, marginLeft: 10 }}>车辆详情</Text>
            </div>
          </div>
          <div className={global.MyBody}>
            <div className={global.MyBodyRight} style={{ padding: 12 }}>
              <div size={12} style={{ width: '100%', display: 'flex' }}>
                <div style={{ width: '50%' }}>
                  {color === '红色' && <Image
                    alt="example"
                    style={{ width: '100%', padding: 5 }}
                    src="https://upload.chebaba.com/shop/car_type/2020-10-29-22-33-49-5f9ad2cdab28d.jpg"
                  />}
                  {color === '蓝色' && <Image
                    alt="example"
                    style={{ width: '100%', padding: 5 }}
                    src="https://upload.chebaba.com/shop/car_type/2020-09-30-10-46-12-5f73f174256a5.jpg"
                  />}
                  {color === '橙色' && <img
                    alt="example"
                    style={{ width: '100%', padding: 5 }}
                    src="https://upload.chebaba.com/shop/car_type/2020-08-28-22-56-34-5f491b22da059.jpg"
                  />}
                  {color === '金色' && <img
                    alt="example"
                    style={{ width: '100%', padding: 5 }}
                    src="https://upload.chebaba.com/shop/car_type/2019-11-06-11-02-17-5dc237b9cd9d3.jpg"
                  />}
                  {color === '白色' && <img
                    alt="example"
                    style={{ width: '100%', padding: 5 }}
                    src="https://upload.chebaba.com/shop/car_type/2020-09-24-22-06-02-5f6ca7ca3fda2.jpg"
                  />}
                </div>
                <div style={{ width: '50%', padding: 20 }}>
                  <Space direction='vertical'>
                    <Title>{brand_name}</Title>
                    <Title level={3}>车辆型号：{model}</Title>
                    <Title level={3}>车辆类型：{car_type}</Title>
                    <Title level={3}>车辆颜色：{color}</Title>
                    <Title level={4}>店铺名称：{store_name}</Title>
                    <Space style={{ marginTop: 60 }}>
                      <InputNumber size="large" min={1} value={carNum} onChange={this.onCarNumChange} />
                      <Button
                        block
                        type="primary"
                        size='large'
                        icon={<ShoppingOutlined />}
                        onClick={this.addToCart}
                      >加入购物车</Button>
                    </Space>
                  </Space>
                </div>
              </div>
              <Comment
                avatar={
                  <Avatar
                    size='large'
                  >{localStorage.getItem('userName').substr(0, 1).toUpperCase()}</Avatar>
                }
                content={
                  <Editor
                    onChange={this.handleChange}
                    onSubmit={this.handleSubmit}
                    submitting={submitting}
                    value={commentValue}
                  />
                }
              />
              {comments.length > 0 && <CommentList comments={comments} />}
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
