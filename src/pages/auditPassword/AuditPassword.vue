<!--
 * @Description: 修改密码弹框
 * @Author: Leo
 * @Date: 2021-01-05 17:03:57
 * @LastEditTime: 2021-01-06 13:40:02
 * @LastEditors: Leo
-->
<template>
  <div class="auditPassword-page">
    <a-card :body-style="{padding: '24px 32px'}"
            :bordered="false"
            :style="`min-height: ${pageMinHeight}px`">
      <a-form-model ref="ruleForm"
                    :model="form"
                    :rules="rules"
                    style="max-width: 600px; margin: 40px auto"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol">
        <!-- 旧密码 -->
        <a-form-model-item label="旧密码"
                           prop="oldPassword">
          <a-input v-model="form.oldPassword"
                   :type="passwordType"
                   :maxLength="30">
            <a-icon slot="prefix"
                    type="lock" />
            <a-tooltip slot="suffix"
                       title="查看密码">
              <a-icon type="eye"
                      v-if="form.oldPassword"
                      @click="passwordType = 'text'"
                      style="color: rgba(0,0,0,.45)" />
            </a-tooltip>
          </a-input>
        </a-form-model-item>
        <!-- 新密码 -->
        <a-form-model-item label="新密码"
                           prop="newPassword">
          <a-input v-model="form.newPassword"
                   :type="passwordType1"
                   :maxLength="30">
            <a-icon slot="prefix"
                    type="lock" />
            <a-tooltip slot="suffix"
                       title="查看密码">
              <a-icon type="eye"
                      v-if="form.newPassword"
                      @click="passwordType1 = 'text'"
                      style="color: rgba(0,0,0,.45)" />
            </a-tooltip>
          </a-input>
        </a-form-model-item>
        <!-- 确认新密码 -->
        <a-form-model-item label="确认新密码"
                           prop="newPasswordAgain">
          <a-input v-model="form.newPasswordAgain"
                   :type="passwordType2"
                   :maxLength="30">
            <a-icon slot="prefix"
                    type="lock" />
            <a-tooltip slot="suffix"
                       title="查看密码">
              <a-icon type="eye"
                      v-if="form.newPasswordAgain"
                      @click="passwordType2 = 'text'"
                      style="color: rgba(0,0,0,.45)" />
            </a-tooltip>
          </a-input>
        </a-form-model-item>

        <div class="text-center">
          <a-button type="primary"
                    class="mr-20"
                    @click="auditNewPassword">确定
          </a-button>
          <a-button style="margin-left: 10px;"
                    @click="cancalAudit">取消
          </a-button>
        </div>

      </a-form-model>
    </a-card>

    <!-- loading -->
    <transition name="el-fade-in">
      <loading ref="loading"></loading>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { aduitPassword } from "@/services/user";
export default {
  name: "AuditPassword",
  computed: {
    ...mapState("setting", ["pageMinHeight"])
  },
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 11, offset: 1 },
      form: {
        oldPassword: undefined,
        newPassword: undefined,
        newPasswordAgain: undefined
      },
      rules: {
        oldPassword: [
          {
            required: true,
            message: "请输入旧密码！",
            trigger: "blur"
          },
          {
            min: 6,
            max: 30,
            message: "请输入6-30位密码！",
            trigger: "blur"
          }
        ],
        newPassword: [
          {
            required: true,
            min: 6,
            max: 30,
            trigger: "blur",
            validator: this.checkOldToNew
          }
        ],
        newPasswordAgain: [
          {
            required: true,
            min: 6,
            max: 30,
            trigger: "blur",
            validator: this.checkAgainPassword
          }
        ]
      },
      passwordType: "password",
      passwordType1: "password",
      passwordType2: "password"
    };
  },
  methods: {
    // 新密码不能与老密码一致
    checkOldToNew(rule, value, callback) {
      const oldPassword = this.form.oldPassword;
      if (this.$isEmpty(value)) {
        callback("请您输入新密码！");
      } else if (value.length > 30 || value.length < 6) {
        callback("请输入6-30位密码！");
      } else if (oldPassword === value) {
        callback("新密码与旧密码一致，请重新输入新密码！");
      }
      callback();
    },

    // 校验俩次密码输入是否一致
    checkAgainPassword(rule, value, callback) {
      const newPassword = this.form.newPassword;
      if (this.$isEmpty(value)) {
        callback("请您再次输入新密码！");
      } else if (value.length > 30 || value.length < 6) {
        callback("请输入6-30位密码！");
      } else if (newPassword !== value) {
        callback("俩次输入新密码不一致，请检查！");
      }
      callback();
    },

    // 确定
    auditNewPassword() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const data = { ...this.form };
          this.$refs.loading.openLoading("操作进行中，请稍后。。");
          aduitPassword(data)
            .then(res => {
              this.$refs.loading.closeLoading();
              const result = res.data;
              if (result.code === 0) {
                this.$message.success(result.desc);
                const _this = this;
                this.$confirm({
                  title: "密码已经修改，请重新登陆系统",
                  okText: "确定",
                  okType: "primary",
                  onOk() {
                    _this.$router.push("/login");
                  }
                });
              } else {
                this.$message.error(result.desc);
              }
            })
            .catch(() => {
              this.$refs.loading.closeLoading();
            });
        } else {
          return false;
        }
      });
    },

    resetAllFields() {
      this.$refs.ruleForm.resetFields();
      this.passwordType = "password";
      this.passwordType1 = "password";
      this.passwordType2 = "password";
    },

    cancalAudit() {
      this.resetAllFields();
      this.$router.go(-1);
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.resetAllFields();
    });
  }
};
</script>

