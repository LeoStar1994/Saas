import { USERSROLESTREE, USERSTABLEDATA } from "@/services/api";
import { request, METHOD } from "@/utils/request";

/**
 * table查询
 * @param data {Object}
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getUsersTableData(data) {
  return request(USERSTABLEDATA, METHOD.GET, data);
}

// 获取详情页角色list
export async function rolesTreeList() {
  return request(USERSROLESTREE, METHOD.GET);
}

// // 获取关联用户list
// export async function accountList() {
//   return request(ACCOUNT, METHOD.GET);
// }

// // 版本控制table查询
// export async function getAuthorTableData() {
//   return request(AUTHORTABLEDATA, METHOD.GET);
// }
