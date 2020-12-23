import Mock from "mockjs";

/* const mapRoutesArr = arr.map((item) => {
  return {
    router: item.registerName,
    name: item.name,
    children: item.children.map((item1) => {
      return {
        router: item1.registerName,
        name: item1.name,
      };
    }),
  };
}); */

Mock.mock(`${process.env.VUE_APP_API_BASE_URL}/routes`, "get", () => {
  let result = {};
  result.code = 0;
  result.data = {
    account: "leo",
    menuTree: [
      {
        router: "root",
        children: [
          {
            router: "permissions",
            children: [
              // {
              //   router: 'basicForm',  //匹配 router.map.js 中注册名 registerName = basicForm 的路由
              //   name: '验权表单',      //重写 basicForm 路由的 name 属性
              //   icon: 'file-excel',  //重写 basicForm 路由的 icon 属性
              //   authority: 'form'    //重写 basicForm 路由的 authority 属性
              //   path: 'path',        //重写path，可缺省，默认取路由注册名称 registerName 的值
              //   redirect: '/login',  //重写路由重定向
              //   invisible: false,    //重写是否隐藏菜单项，true 隐藏，false 不隐藏，会注入到路由元数据meta中。
              //   page: {               //重写路由的页面数据，会注入到路由元数据meta中
              //    title: '演示页',      //重写页面标题
              //    breadcrumb: ['首页', '演示页']     //重写页面面包屑
              //   }
              // }
              // "usersManangement",
              "usersManangement",
              "rolesManagement",
              "dongpuUsers",
            ],
          },
          {
            router: "exception",
            children: ["exp404", "exp403", "exp500"],
          },
        ],
      },
    ],
  };
  return result;
});
