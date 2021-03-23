import React, { PureComponent } from 'react';
import { Form, Input, message, Modal, Select } from 'antd';
import { createCar, updateCar } from '@/services/car';
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const formUserRef = React.createRef();

class NewCar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      userId: null,
      title: '',
      carStoreId: null,
      carId: null
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this.setState({
          title: this.props.title,
          carStoreId: this.props.carStoreId
        });
        formUserRef.current.setFieldsValue({
          brandName: '',
          carModel: '',
          carType: '',
          color: '',
        });
        if (this.props.title === '编辑车辆') {
          if (this.props.detail !== null) {
            let json = this.props.detail
            this.setState(
              {
                carId: json.id,
              },
              () => {
                formUserRef.current.setFieldsValue({
                  brandName: json.brand_name,
                  carModel: json.model,
                  carType: json.car_type,
                  color: json.color,
                });
              },
            );
          }
        }
      }
    }
  }

  // 确定
  handleOk = () => {
    formUserRef.current.validateFields().then((values) => {
      this.onFinish(values);
    });
  };

  // 取消
  handleCancel = () => {
    this.props.closeModal(false);
  };

  // 表单提交
  onFinish = async (values) => {
    const { title, carStoreId, carId } = this.state;
    this.setState({
      confirmLoading: true,
    });
    let res = null;
    if (title === '添加车辆') {
      values.carStoreId = carStoreId;
      res = await createCar({ ...values });
    } else {
      values.carId = carId;
      res = await updateCar({ ...values });
    }
    if (res.code === '0000') {
      message.success(`${title}成功`);
      this.props.callBack();
      this.props.closeModal(false);
    } else {
      if (res.message) {
        message.error(res.message);
      }
    }
    this.setState({
      confirmLoading: false,
    });
  };

  render() {
    const { confirmLoading, title } = this.state;
    return (
      <Modal
        title={title}
        confirmLoading={confirmLoading}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form {...layout} name="basic" ref={formUserRef} >
          <Form.Item
            label="品牌名称"
            name="brandName"
            rules={[{ required: true, message: '请输入品牌名称!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="车辆型号"
            name="carModel"
            rules={[{ required: true, message: '请输入车辆型号!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="carType"
            label="车辆类型"
            rules={[{ required: true, message: '请选择车辆类型!' }]}
          >
            <Select placeholder="请选择">
              <Select.Option key={0} value={'轿车'}>
                轿车
              </Select.Option>
              <Select.Option key={1} value={'SUV'}>
                SUV
              </Select.Option>
              <Select.Option key={2} value={'新能源车'}>
                新能源车
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="color"
            label="车辆颜色"
            rules={[{ required: true, message: '请选择车辆颜色!' }]}
          >
            <Select placeholder="请选择">
              <Select.Option key={0} value={'红色'}>
                红色
              </Select.Option>
              <Select.Option key={1} value={'蓝色'}>
                蓝色
              </Select.Option>
              <Select.Option key={2} value={'橙色'}>
                橙色
              </Select.Option>
              <Select.Option key={3} value={'白色'}>
                白色
              </Select.Option>
              <Select.Option key={4} value={'金色'}>
                金色
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default NewCar;
