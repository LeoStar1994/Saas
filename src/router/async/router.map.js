// 视图组件
const view = {
  tabs: () => import("@/layouts/tabs"),
  blank: () => import("@/layouts/BlankView"),
  page: () => import("@/layouts/PageView")
};

// 路由组件注册
const routerMap = {
  // registerName: {                               //路由组件注册名称，唯一标识
  //   path: 'path',                               //路由path，可缺省，默认取路由注册名称 registerName 的值
  //   name: '演示页',                             //路由名称
  //   redirect: '/login',                         //路由重定向
  //   component: () => import('@/pages/demo'),    //路由视图
  //   icon: 'permission',                         //路由的菜单icon，会注入到路由元数据meta中
  //   invisible: false,                           //是否隐藏菜单项，true 隐藏，false 不隐藏，会注入到路由元数据meta中。
  //   authority: {                                //路由权限配置，会注入到路由元数据meta中。可缺省，默认为 ‘*’, 即无权限限制
  //     permission: 'form',                       //路由需要的权限
  //     role: 'admin'                             //路由需要的角色。当permission未设置，通过 role 检查权限
  //   },
  //   page: {                                     //路由的页面数据，会注入到路由元数据meta中
  //     title: '演示页',                          //页面标题
  //     breadcrumb: ['首页', '演示页']            //页面面包屑
  //   }
  // }

  login: {
    authority: "*",
    path: "/login",
    component: () => import("@/pages/login")
  },

  // 异常页
  exception: {
    name: "异常页",
    icon: "warning",
    invisible: true,
    component: view.blank
  },
  exp403: {
    authority: "*",
    invisible: true,
    name: "exp403",
    path: "403",
    component: () => import("@/pages/exception/403")
  },
  exp404: {
    name: "exp404",
    invisible: true,
    path: "404",
    component: () => import("@/pages/exception/404")
  },
  exp500: {
    name: "exp500",
    invisible: true,
    path: "500",
    component: () => import("@/pages/exception/500")
  },

  // root
  root: {
    path: "/",
    name: "首页",
    redirect: "/login",
    component: view.tabs
  },

  welcome: {
    path: "/welcome",
    name: "欢迎页",
    invisible: true,
    component: () => import("@/pages/welcome")
  },

  auditPassword: {
    path: "/auditPassword",
    name: "修改密码",
    invisible: true,
    component: () => import("@/pages/auditPassword")
  },

  // 权限管理
  permissions: {
    name: "权限管理",
    icon: "setting",
    component: view.page
  },
  usersManangement: {
    path: "/permissions/usersManangement",
    name: "用户管理",
    component: () => import("@/pages/permissions/usersManagement")
  },
  rolesManagement: {
    path: "/permissions/rolesManagement",
    name: "角色管理",
    component: () => import("@/pages/permissions/rolesManagement")
  },
  dongpuUsers: {
    path: "/permissions/dongpuUsers",
    name: "动捕用户",
    component: () => import("@/pages/permissions/dongbuUsers")
  }
};
export default routerMap;
