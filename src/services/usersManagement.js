/* 用户管理 */
import {
  USERSROLESTREE,
  USERSTABLEDATA,
  USERSCHANGESTATE,
  USERSINITDATA,
  USERSADD,
  USERSUPDATE,
  USERSDELETE,
} from "@/services/api";
import { request, METHOD } from "@/utils/request";

/**
 * table查询
 * @param data {Object}
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getUsersTableData(data) {
  return request(USERSTABLEDATA, METHOD.POST, data);
}

// 获取详情页角色list
export async function rolesTreeList() {
  return request(USERSROLESTREE, METHOD.GET);
}

// 新增
export async function addUser(data) {
  return request(USERSADD, METHOD.POST, data);
}

// 修改
export async function updateUser(data) {
  return request(USERSUPDATE, METHOD.POST, data);
}

// 查看 | 修改返显数据
export async function initUserDetail(params) {
  return request(USERSINITDATA + `/${params}`, METHOD.GET);
}

// 启用 | 停用
export async function changeUserState(data) {
  return request(USERSCHANGESTATE, METHOD.POST, data);
}

// 删除
export async function deleteUserInfo(data) {
  return request(USERSDELETE, METHOD.DELETE, data);
}
