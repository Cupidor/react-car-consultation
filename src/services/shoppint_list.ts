import { request } from 'umi';
import api from '@/utils/config';

// 产品添加购物车
export async function createShoppintList(params: any) {
  return request(`${api.shoppintListUrl}create_shopping_list`, {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

// 条件查询，支持后端分页
export async function getShoppintListQueryByCondition(params: any) {
  return request(`${api.shoppintListUrl}query_by_condition`, {
    method: 'GET',
    requestType: 'form',
    params,
  });
}

// 产品添加购物车
export async function updateShoppintList(params: any) {
  return request(`${api.shoppintListUrl}update_shopping_list`, {
    method: 'PUT',
    requestType: 'form',
    data: params,
  });
}

// 从购物车移除车辆
export async function deleteShoppintList(params: any) {
  return request(`${api.shoppintListUrl}delete_shopping_list`, {
    method: 'DELETE',
    requestType: 'form',
    data: params,
  });
}