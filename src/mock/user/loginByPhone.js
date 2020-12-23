import Mock from "mockjs";
import "@/mock/extend";

const user = Mock.mock({
  name: "@ADMIN",
  avatar: "@AVATAR",
  address: "@CITY",
  position: "@POSITION",
});

Mock.mock(
  `${process.env.VUE_APP_API_BASE_URL}/loginByPhone`,
  "post",
  ({ body }) => {
    let result = {};
    const { phone, verificationCode } = JSON.parse(body);

    if (phone !== "18270707160" || verificationCode !== "888888") {
      result.code = -1;
      result.message = "手机号或验证码错误（18270707160/888888）";
    } else {
      result.code = 0;
      result.message = Mock.mock("@TIMEFIX").CN + "，欢迎回来";
      result.data = {};
      result.data.user = user;
      result.data.token = "Authorization:" + Math.random();
      result.data.expireAt = new Date(new Date().getTime() + 30 * 60 * 1000);
      result.data.permissions = [
        { id: "queryForm", operation: ["add", "edit"] },
      ];
      result.data.roles = [
        { id: "admin", operation: ["add", "edit", "delete"] },
      ];
    }
    return result;
  }
);
