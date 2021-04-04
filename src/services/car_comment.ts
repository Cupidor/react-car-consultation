import { request } from 'umi';
import api from '@/utils/config';

// 添加车辆点评
export async function createCarComment(params: any) {
  return request(`${api.carCommentrUrl}create_car_comment`, {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

// 条件查询，支持后端分页
export async function getCarCommentQueryByCondition(params: any) {
  return request(`${api.carCommentrUrl}query_by_condition`, {
    method: 'GET',
    requestType: 'form',
    params,
  });
}

// 更新车辆点评
export async function updateCarComment(params: any) {
  return request(`${api.carCommentrUrl}update_car_comment`, {
    method: 'PUT',
    requestType: 'form',
    data: params,
  });
}

// 删除车辆点评
export async function deleteCarComment(params: any) {
  return request(`${api.carCommentrUrl}delete_car_comment`, {
    method: 'DELETE',
    requestType: 'form',
    data: params,
  });
}