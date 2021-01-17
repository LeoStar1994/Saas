import {
  LOGIN,
  LOGINVERIFYCODE,
  LOGINSMSCODE,
  LOGINBYPHONE,
  ROUTES,
  FOEGETPASSWORDCODE,
  FOEGETPASSWORD,
  RESETPASSWORD,
  USERAUDITPASSWORD
} from "@/services/api";
import { request, METHOD, removeAuthorization } from "@/utils/request";

/**
 * 账户密码登录
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(data) {
  return request(LOGIN, METHOD.POST, data);
}

// 获取图形验证码
export async function verifyCode() {
  return request(LOGINVERIFYCODE, METHOD.POST);
}

// 获取图形验证码
export async function SMSCode(data) {
  return request(LOGINSMSCODE, METHOD.POST, data);
}

/**
 * 手机号登录
 * @param phone 手机号
 * @param verificationCode 手机验证码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function loginByPhone(data) {
  return request(LOGINBYPHONE, METHOD.POST, data);
}

// 忘记密码获取短信验证码
export async function forgetSMSCode(data) {
  return request(FOEGETPASSWORDCODE, METHOD.POST, data);
}

// 忘记密码验证短信验证码
export async function checkForgetSMSCode(data) {
  return request(FOEGETPASSWORD, METHOD.POST, data);
}

// 忘记密码重置密码
export async function resetPassword(data) {
  return request(RESETPASSWORD, METHOD.POST, data);
}

/**
 * 获取路由配置
 */
export async function getRoutesConfig() {
  return request(ROUTES, METHOD.GET);
}

/**
 * 退出登录
 */
export function logout() {
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY);
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY);
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY);
  removeAuthorization();
}

// 用户修改密码
export async function aduitPassword(data) {
  return request(USERAUDITPASSWORD, METHOD.POST, data);
}

export default {
  login,
  logout,
  loginByPhone,
  getRoutesConfig
};
