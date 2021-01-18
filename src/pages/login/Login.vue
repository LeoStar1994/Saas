<!--
 * @Description: login登录页面.
 * @Author: Leo
 * @Date: 2020-12-17 17:39:10
 * @LastEditTime: 2021-01-18 12:13:31
 * @LastEditors: Leo
-->

<template>
  <common-layout>
    <!-- logo、title -->
    <div class="top">
      <div class="header">
        <img alt="logo"
             class="logo"
             src="@/assets/img/logo.png" />
        <h1 class="title">SAAS权限管理</h1>
      </div>
    </div>
    <!-- login form -->
    <div class="login"
         @keydown="keydownLogin">
      <a-tabs size="large"
              :tabBarStyle="{textAlign: 'center'}"
              @change="tabChange"
              style="padding: 0 2px;">
        <!-- 账户密码登录 -->
        <a-tab-pane tab="账户密码登录"
                    key="commonLogin">
          <a-alert type="error"
                   v-show="error"
                   :message="error"
                   showIcon
                   style="margin-bottom: 24px;" />
          <a-form @submit="onSubmit"
                  :form="form">
            <a-form-item>
              <!-- 账户名 -->
              <a-input autocomplete="autocomplete"
                       size="default"
                       :maxLength="30"
                       placeholder="请输入您的账号"
                       v-decorator="['account', {rules: [{ required: true, whitespace: true, message: '请输入您的账号'}]}]">
                <!-- validator: handleCheckAccount -->
                <a-icon slot="prefix"
                        type="user" />
              </a-input>
            </a-form-item>
            <!-- 密码 -->
            <a-form-item>
              <a-input size="default"
                       placeholder="请输入密码"
                       :maxLength="30"
                       autocomplete="autocomplete"
                       :type="passwordType"
                       v-decorator="['password', {rules: [{ required: true, message: '请输入密码', whitespace: true}]}]">
                <a-icon slot="prefix"
                        type="lock" />
                <a-tooltip slot="suffix"
                           title="查看密码">
                  <a-icon type="eye"
                          v-if="form.getFieldValue('password')"
                          @click="passwordType = 'text'"
                          style="color: rgba(0,0,0,.45)" />
                </a-tooltip>
              </a-input>
            </a-form-item>
            <!-- 图形验证码 -->
            <a-form-item>
              <div class="d-flex ai-center">
                <a-input size="default"
                         placeholder="请输入验证码"
                         class="flex-1 mr-16"
                         :maxLength="4"
                         v-decorator="['verifyCode', {rules: [{ required: true, message: '请输入验证码', whitespace: true}]}]">
                </a-input>
                <img :src="verifyCodeImgUrl"
                     class="w30p h30 cursor-pointer"
                     @click="fetchVerifyCode"
                     alt="图形验证码">
              </div>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <!-- 手机号登录 -->
        <a-tab-pane tab="手机号登录"
                    key="phoneLogin">
          <a-alert type="error"
                   v-show="errorByPhone"
                   :message="errorByPhone"
                   showIcon
                   style="margin-bottom: 24px;" />
          <a-form @submit="onSubmitByPhone"
                  :form="form1">
            <!-- 手机号 -->
            <a-form-item>
              <a-input size="default"
                       placeholder="请输入手机号"
                       :maxLength="30"
                       v-decorator="['mobile', {rules: [{ required: true, whitespace: true, validator: handleCheckMobile}]}]">
                <a-icon slot="prefix"
                        type="mobile" />
              </a-input>
            </a-form-item>
            <!-- 验证码 -->
            <a-form-item>
              <a-row :gutter="8"
                     style="margin: 0 -4px">
                <a-col :span="14">
                  <a-input size="default"
                           placeholder="请输入验证码"
                           :maxLength="4"
                           v-decorator="['verifyCode', {rules: [{ required: true, message: '请输入验证码', whitespace: true}]}]">
                    <a-icon slot="prefix"
                            type="mail" />
                  </a-input>
                </a-col>
                <a-col :span="10"
                       style="padding-left: 4px">
                  <a-button style="width: 100%"
                            class="captcha-button"
                            type="primary"
                            @click="getVerificationCode"
                            :disabled="!$isRihgtPhone(form1.getFieldValue('mobile')) || fetchingCode"
                            size="default">
                    <span v-if="!fetchingCode"
                          style="font-size: 12px;">获取验证码</span>
                    <span v-else
                          style="font-size: 12px;">{{countDownSceonds}}s后重新发送</span>
                  </a-button>
                </a-col>
              </a-row>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
      <div>
        <a-form-item>
          <a-button :loading="logging"
                    class="login-btn"
                    size="default"
                    @click="loginSubmit"
                    type="primary">
            <span style="font-size: 16px; width: 180px;">登录</span>
            <a-icon type="arrow-right" />
          </a-button>
        </a-form-item>
      </div>

      <!-- 忘记密码 -->
      <div class="forgetPassword">
        密码忘记了？
        <a @click="forgetPassword"
           class="text-white">忘记密码</a>
      </div>
    </div>
    <!-- 忘记密码 -->
    <ForgetPassword ref="forgetPassword"></ForgetPassword>
  </common-layout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout";
import ForgetPassword from "@/pages/forgetPassword";
import {
  verifyCode,
  login,
  SMSCode,
  loginByPhone,
  getRoutesConfig,
} from "@/services/user";
import { setAuthorization } from "@/utils/request";
import { loadRoutes } from "@/utils/routerUtil";
import { mapMutations } from "vuex";

const userInfo = {
  name: "lucky",
  avatar: "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",
  address: "@CITY",
  position: {
    CN: "前端工程师 | 蚂蚁金服-计算服务事业群-VUE平台",
    HK: "前端工程師 | 螞蟻金服-計算服務事業群-VUE平台",
    US:
      "Front-end engineer | Ant Financial - Computing services business group - VUE platform",
  },
};
const timeList = [
  {
    CN: "早上好",
    HK: "早晨啊",
    US: "Good morning",
  },
  {
    CN: "上午好",
    HK: "上午好",
    US: "Good morning",
  },
  {
    CN: "中午好",
    HK: "中午好",
    US: "Good afternoon",
  },
  {
    CN: "下午好",
    HK: "下午好",
    US: "Good afternoon",
  },
  {
    CN: "晚上好",
    HK: "晚上好",
    US: "Good evening",
  },
];

export default {
  name: "Login",
  components: { CommonLayout, ForgetPassword },
  data() {
    return {
      logging: false,
      passwordType: "password",
      error: "",
      errorByPhone: "",
      form: this.$form.createForm(this),
      form1: this.$form.createForm(this),
      currentTabKey: "commonLogin",
      fetchingCode: false,
      countDownSceonds: 60,
      timer: null,
      verifyCodeImgUrl: null,
      verifyCodeToken: null,
    };
  },
  created() {
    this.fetchVerifyCode();
  },
  methods: {
    ...mapMutations("account", ["setUser", "setPermissions", "setRoles"]),
    // 根据当前时间转换中文提示语
    timeFix() {
      const time = new Date();
      const hour = time.getHours();
      return hour < 9
        ? timeList[0]
        : hour <= 11
        ? timeList[1]
        : hour <= 13
        ? timeList[2]
        : hour <= 20
        ? timeList[3]
        : timeList[4];
    },

    // tab切换登录方式
    tabChange(activeKey) {
      this.currentTabKey = activeKey;
      if (activeKey === "commonLogin") {
        this.form.resetFields();
        this.error = "";
        this.passwordType = "password";
      } else {
        this.form1.resetFields();
        this.errorByPhone = "";
      }
    },

    // 账号必须为邮箱登录
    handleCheckAccount(rule, value, callback) {
      const emailExp = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      if (this.$isEmpty(value)) {
        callback("请输入您的账号");
      } else if (!emailExp.test(value)) {
        callback("账号必须输入邮箱！");
      }
      callback();
    },

    // 手机号校验
    handleCheckMobile(rule, value, callback) {
      if (this.$isEmpty(value)) {
        callback("请输入您的手机号");
      } else if (!this.$isRihgtPhone(value)) {
        callback("手机号格式不正确！");
      }
      callback();
    },

    // 获取图形验证码
    fetchVerifyCode() {
      verifyCode().then((res) => {
        const result = res.data;
        if (result.code === 0) {
          this.verifyCodeImgUrl = `data:image/png;base64,${result.data.vPngBase64}`;
          this.verifyCodeToken = result.data.vToken;
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    // 回车登录
    keydownLogin(e) {
      let theEvent = window.event || e;
      let key = theEvent.keyCode;
      if (key === 13) {
        this.loginSubmit(e);
      }
    },

    // 点击登录按钮
    loginSubmit(e) {
      if (this.currentTabKey === "commonLogin") {
        this.onSubmit(e);
      } else {
        this.onSubmitByPhone(e);
      }
    },

    // 账户密码点击登录
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err) => {
        if (!err) {
          this.logging = true;
          const allValues = this.form.getFieldsValue();
          const data = {
            ...allValues,
            verifyCodeToken: this.verifyCodeToken,
          };
          login(data).then(this.afterLogin);
        }
      });
    },

    // 登录后相关设置
    afterLogin(res) {
      this.logging = false;
      const loginRes = {
        ...res.data,
        expireAt: new Date(new Date(new Date().getTime() + 30 * 60 * 1000)),
        user: { ...userInfo },
        message: this.timeFix().CN + "，欢迎回来",
      };
      if (loginRes.code == 0) {
        // const { user, permissions, roles } = loginRes.data;
        // this.setPermissions();
        // this.setRoles();
        // 设置token认证信息
        setAuthorization({
          token: loginRes.data,
          expireAt: new Date(loginRes.expireAt),
        });
        // 获取路由配置
        getRoutesConfig().then((result) => {
          if (result.data.code === 0) {
            // 过滤menu数组
            const mapRoutesArr = result.data.data.menuTree
              ? result.data.data.menuTree.map((item) => {
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
                })
              : [];
            const welcome = {
              router: "welcome",
              name: "欢迎页面",
            };
            const auditPassword = {
              router: "auditPassword",
              name: "修改密码",
            };
            const routesConfig = [
              {
                router: "root",
                children: [welcome, auditPassword, ...mapRoutesArr],
              },
            ];
            loginRes.user.name = result.data.data.account;
            this.setUser(loginRes.user); // 设置user信息
            loadRoutes(routesConfig);
            this.$router.push("/welcome"); // 成功登录页跳转用户管理页
            this.$message.success(loginRes.message, 3);
          } else {
            this.$message.error(result.data.desc);
          }
        });
      } else {
        if (this.currentTabKey === "commonLogin") {
          this.error = loginRes.desc;
          console.log(this.error);
        } else {
          this.errorByPhone = loginRes.desc;
        }
      }
    },

    // 手机号登录
    onSubmitByPhone(e) {
      e.preventDefault();
      this.form1.validateFields((err) => {
        if (!err) {
          this.logging = true;
          const allValues = this.form1.getFieldsValue();
          loginByPhone(allValues).then(this.afterLogin);
        }
      });
    },

    // 获取手机验证码
    getVerificationCode() {
      this.fetchingCode = true;
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        if (this.countDownSceonds > 0) {
          this.countDownSceonds--;
        } else {
          this.fetchingCode = false;
          this.countDownSceonds = 60;
        }
      }, 1000);
      const mobile = this.form1.getFieldValue("mobile");
      // ajax
      SMSCode({ mobile }).then((res) => {
        const result = res.data;
        if (result.code === 0) {
          this.$message.success("短信验证码已发送，请注意查收");
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    // 忘记密码
    forgetPassword() {
      this.$refs.forgetPassword.visible = true;
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../less/_variables.less";
.common-layout {
  .top {
    text-align: center;
    .header {
      position: fixed;
      top: 58 * @1hx;
      left: 68 * @1wx;
      a {
        text-decoration: none;
      }
      .logo {
        width: 310px;
        height: 52px;
        cursor: pointer;
        vertical-align: top;
      }
      .title {
        font-size: 40px;
        color: white;
        font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica,
          sans-serif;
        font-weight: 400;
        position: fixed;
        top: 230 * @1hx;
        left: 50%;
        transform: translateX(-50%);
        @media screen and (min-width: 1440px) and(max-width: 1600px) {
          font-size: 44px;
        }
        @media screen and (min-width: 1680px) {
          font-size: 48px;
        }
      }
    }
  }
  .login {
    position: fixed;
    top: 364 * @1hx;
    left: 50%;
    transform: translateX(-50%);
    width: 340px;
    min-height: 252px;
    padding: 20px 24px 0;
    background-color: #fff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);
    border-radius: 5px;
    @media screen and (max-width: 576px) {
      width: 95%;
    }
    @media screen and (max-width: 320px) {
      .captcha-button {
        font-size: 14px;
      }
    }
    h2 {
      text-align: center;
      font-size: 24px;
      font-weight: 500;
    }
    .login-btn {
      position: absolute;
      width: 270px;
      bottom: -48px;
      left: 10px;
      height: 46px;
      background: #0077ff;
      box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.1);
      border-radius: 100px;
    }
    .forgetPassword {
      position: absolute;
      bottom: -50px;
      transform: translateX(50%);
      text-align: center;
      height: 17px;
      line-height: 17px;
      font-size: 13px;
      color: white;
      a:hover {
        color: #1890ff !important;
      }
    }
  }
}
</style>
