const config = {};
const version = 'test';
if (version === 'prod') {
  config.host = 'http://127.0.0.1:8011';
} else if (version === 'test') {
  config.host = 'http://wcxweb.51vip.biz';
}
// 系统登录接口
config.loginUrl = config.host + '/login/';
// 用户资源
config.userUrl = config.host + '/s_user/';
// 车辆店铺
config.carStoreUrl = config.host + '/car_store/';
// 车辆管理
config.carUrl = config.host + '/car/';
// 购物车
config.shoppintListUrl = config.host + '/shoppint_list/';
// 浏览记录
config.viewRecordUrl = config.host + '/view_record/';
export default config;
