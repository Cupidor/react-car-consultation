import { request } from 'umi';
import api from '@/utils/config';

// 添加车辆
export async function createCar(params: any) {
  return request(`${api.carUrl}create`, {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

// 更新车辆
export async function updateCar(params: any) {
  return request(`${api.carUrl}update`, {
    method: 'PUT',
    requestType: 'form',
    data: params,
  });
}

// 删除车辆
export async function deleteCar(params: any) {
  return request(`${api.carUrl}delete`, {
    method: 'DELETE',
    requestType: 'form',
    data: params,
  });
}

// 条件查询，支持后端分页
export async function getCarsQueryByCondition(params: any) {
  return request(`${api.carUrl}query_by_condition`, {
    method: 'GET',
    requestType: 'form',
    params,
  });
}

// 查询车辆详情
export async function getCarDetail(params: any) {
  return request(`${api.carUrl}query`, {
    method: 'GET',
    requestType: 'form',
    params,
  });
}