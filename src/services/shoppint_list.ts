import { request } from 'umi';
import api from '@/utils/config';

// 产品添加购物车
export async function createShoppintList(params: any) {
  return request(`${api.shoppintListUrl}create`, {
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