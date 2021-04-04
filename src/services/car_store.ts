import { request } from 'umi';
import api from '@/utils/config';

// 添加车辆4s店铺
export async function createCarStore(params: any) {
  return request(`${api.carStoreUrl}create_car_store`, {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

// 更新车辆4s店铺
export async function updateCarStore(params: any) {
  return request(`${api.carStoreUrl}update_car_store`, {
    method: 'PUT',
    requestType: 'form',
    data: params,
  });
}
