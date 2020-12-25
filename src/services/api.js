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
  ROLETABLEDATA: `${BASE_URL}/BSSRole/query`, // table查询
  ROLETREE: `${BASE_URL}/BSSRole/initAdd`, // 新增初始化，获取角色tree
  ROLEADD: `${BASE_URL}/BSSRole/add`, // 新增
  ROLEINITDATA: `${BASE_URL}/BSSRole/initMod`, // 修改初始化，返显数据
  ROLEUPDATE: `${BASE_URL}/BSSRole/mod`, // 修改数据
  ROLECHANGESTATE: `${BASE_URL}/BSSRole/modState`, // 启用 | 停用
  ROLEDELETE: `${BASE_URL}/BSSRole/delete`, // 删除数据

  // 动捕用户
  DONGBUTABLEDATA: `${BASE_URL}/dongbuuser/query`, // table查询
  DONGBUTREE: `${BASE_URL}/dongbuuser/initAdd`, // 新增初始化，获取角色tree
  DONGBUADD: `${BASE_URL}/dongbuuser/add`, // 新增
  DONGBUINITDATA: `${BASE_URL}/dongbuuser/initMod`, // 修改初始化，返显数据
  DONGBUUPDATE: `${BASE_URL}/dongbuuser/mod`, // 修改数据
  DONGBUCHANGESTATE: `${BASE_URL}/dongbuuser/modState`, // 启用 | 停用
  DONGBUDELETE: `${BASE_URL}/dongbuuser/delete`, // 删除数据
};
