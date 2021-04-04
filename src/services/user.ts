import { request } from 'umi';
import api from '@/utils/config';

// 条件搜索用户信息，支持后端分页
export async function queryUserByCondition(
  limit: number,
  offset: number,
  sortColumnName: string,
  sortOrderType: string,
  type: string
) {
  return request(
    `${api.userUrl}query_by_condition?limit=${limit}&offset=${offset}&sortColumnName=${sortColumnName}&sortOrderType=${sortOrderType}&type=${type}`,
  );
}

// 删除用户
export async function deleteUser(params: any) {
  return request(`${api.userUrl}delete_user`, {
    method: 'DELETE',
    requestType: 'form',
    data: params,
  });
}


// 获取取用户信息
export async function queryUser(sUserId: number) {
  return request(`${api.userUrl}query_user?sUserId=${sUserId}`);
}
