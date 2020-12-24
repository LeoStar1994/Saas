//跨域代理前缀
// const API_PROXY_PREFIX='/api'
// const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
const BASE_URL = process.env.VUE_APP_API_BASE_URL;
module.exports = {
  // 登录
  // LOGIN: `${BASE_URL}/login`, // 登录
  // ROUTES: `${BASE_URL}/routes`, // 获取menu菜单

  LOGIN: `${BASE_URL}/login/go`, // 登录
  LOGINVERIFYCODE: `${BASE_URL}/login/verifyCode/image`, // 获取图形验证码
  LOGINSMSCODE: `${BASE_URL}/login/verifyCode/sms`, // 获取手机验证码
  LOGINBYPHONE: `${BASE_URL}/loginByPhone`, // 手机号登录
  ROUTES: `${BASE_URL}/home`, // 获取menu菜单

  // 用户管理
  // USERSTABLEDATA: `${BASE_URL}/query`, // table查询
  USERSTABLEDATA: `${BASE_URL}/BSSuser/query`, // table查询
  USERSROLESTREE: `${BASE_URL}/BSSuser/initAdd`, // 新增初始化，获取角色tree
  USERSADD: `${BASE_URL}/BSSuser/add`, // 新增
  USERSINITDATA: `${BASE_URL}/BSSuser/initMod`, // 修改初始化，返显数据
  USERSUPDATE: `${BASE_URL}/BSSuser/mod`, // 修改数据
  USERSCHANGESTATE: `${BASE_URL}/BSSuser/modState`, // 启用 | 停用
  USERSDELETE: `${BASE_URL}/BSSuser/delete`, // 删除数据

  // 角色管理
  AUTHORTABLEDATA: `${BASE_URL}/getAuthorTableData`,

  // 动捕用户
};
