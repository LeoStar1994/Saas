/* 角色管理 */
import {
  ROLETREE,
  ROLETABLEDATA,
  ROLECHANGESTATE,
  ROLEINITDATA,
  ROLEADD,
  ROLEUPDATE,
  ROLEDELETE,
} from "@/services/api";
import { request, METHOD } from "@/utils/request";

/**
 * table查询
 * @param data {Object}
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getRoleTableData(data) {
  return request(ROLETABLEDATA, METHOD.POST, data);
}

// 获取详情页角色list
export async function roleTreeList() {
  return request(ROLETREE, METHOD.GET);
}

// 新增
export async function addRole(data) {
  return request(ROLEADD, METHOD.POST, data);
}

// 修改
export async function updateRole(data) {
  return request(ROLEUPDATE, METHOD.POST, data);
}

// 查看 | 修改返显数据
export async function initRoleDetail(params) {
  return request(ROLEINITDATA + `/${params}`, METHOD.GET);
}

// 启用 | 停用
export async function changeRoleState(data) {
  return request(ROLECHANGESTATE, METHOD.POST, data);
}

// 删除
export async function deleteRoleInfo(data) {
  return request(ROLEDELETE, METHOD.DELETE, data);
}
