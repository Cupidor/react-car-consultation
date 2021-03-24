import { request } from 'umi';
import api from '@/utils/config';

// 添加车辆点评
export async function createCarComment(params: any) {
  return request(`${api.carCommentrUrl}create`, {
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
  return request(`${api.carCommentrUrl}update`, {
    method: 'PUT',
    requestType: 'form',
    data: params,
  });
}

// 删除车辆点评
export async function deleteCarComment(params: any) {
  return request(`${api.carCommentrUrl}delete`, {
    method: 'DELETE',
    requestType: 'form',
    data: params,
  });
}