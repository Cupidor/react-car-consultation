import { request } from 'umi';
import api from '@/utils/config';

// 添加浏览记录
export async function createViewRecord(params: any) {
  return request(`${api.viewRecordUrl}create`, {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

// 条件查询，支持后端分页
export async function getViewRecordQueryByCondition(params: any) {
  return request(`${api.viewRecordUrl}query_by_condition`, {
    method: 'GET',
    requestType: 'form',
    params,
  });
}