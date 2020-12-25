/* 动捕用户 */
import {
  DONGBUTREE,
  DONGBUTABLEDATA,
  DONGBUCHANGESTATE,
  DONGBUINITDATA,
  DONGBUADD,
  DONGBUUPDATE,
  DONGBUDELETE,
} from "@/services/api";
import { request, METHOD } from "@/utils/request";

/**
 * table查询
 * @param data {Object}
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getDongbuTableData(data) {
  return request(DONGBUTABLEDATA, METHOD.POST, data);
}

// 获取详情页角色list
export async function dongbuTreeList() {
  return request(DONGBUTREE, METHOD.GET);
}

// 新增
export async function addDongbuUser(data) {
  return request(DONGBUADD, METHOD.POST, data);
}

// 修改
export async function updateDongbuUser(data) {
  return request(DONGBUUPDATE, METHOD.POST, data);
}

// 查看 | 修改返显数据
export async function initDongbuUserDetail(params) {
  return request(DONGBUINITDATA + `/${params}`, METHOD.GET);
}

// 启用 | 停用
export async function changeDongbuUserState(data) {
  return request(DONGBUCHANGESTATE, METHOD.POST, data);
}

// 删除
export async function deleteDongbuUserInfo(data) {
  return request(DONGBUDELETE, METHOD.DELETE, data);
}
