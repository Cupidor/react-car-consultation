import { request } from 'umi';
import api from '@/utils/config';

// 添加购物订单
export async function createShoppingOrder(params: any) {
  return request(`${api.shoppingOrderUrl}create`, {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

// 条件查询，支持后端分页
export async function getShoppingOrderQueryByCondition(params: any) {
  return request(`${api.shoppingOrderUrl}query_by_condition`, {
    method: 'GET',
    requestType: 'form',
    params,
  });
}

// 产品添加购物车
export async function updateShoppingOrder(params: any) {
  return request(`${api.shoppingOrderUrl}update`, {
    method: 'PUT',
    requestType: 'form',
    data: params,
  });
}

// 从购物车移除车辆
export async function deleteShoppingOrder(params: any) {
  return request(`${api.shoppingOrderUrl}delete`, {
    method: 'DELETE',
    requestType: 'form',
    data: params,
  });
}