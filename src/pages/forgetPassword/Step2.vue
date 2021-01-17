<!--
* 第2步
* @param Step2
* ! author: leo
* ? description: 忘记密码第2步修改密码.
* TODO: since: 创建时间  2021-01-06 12:59:15
-->

<template>
  <div class="step2-page">
    <a-form @submit="resetNewPassword"
            style="max-width: 400px; margin: 40px auto"
            :form="form2">
      <!-- 新密码 -->
      <a-form-item>
        <a-input size="default"
                 placeholder="请输入新密码"
                 :maxLength="30"
                 type="password"
                 v-decorator="['newPassord', {rules: [{ required: true, message: '请输入密码', whitespace: true}]}]">
          <a-icon slot="prefix"
                  type="lock" />
        </a-input>
      </a-form-item>
      <!-- 确认新密码 -->
      <a-form-item>
        <a-input size="default"
                 placeholder="请再次输入新密码"
                 :maxLength="30"
                 type="password"
                 v-decorator="['newPassordAgain', {rules: [{ required: true, validator: checkAgainPassword, whitespace: true}]}]">
          <a-icon slot="prefix"
                  type="lock" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button size="default"
                  class="mr-10"
                  @click="prevStep"
                  type="primary">
          上一步
        </a-button>
        <a-button size="default"
                  @click="resetNewPassword"
                  type="primary">
          下一步
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { resetPassword } from "@/services/user";
export default {
  name: "Step2",
  props: {
    mobile: {
      type: String
    }
  },
  data() {
    return {
      loading: false,
      form2: this.$form.createForm(this)
    };
  },
  methods: {
    // 校验俩次密码输入是否一致
    checkAgainPassword(rule, value, callback) {
      const newPassord = this.form2.getFieldValue("newPassord");
      if (this.$isEmpty(value)) {
        callback("请您再次输入新密码");
      } else if (newPassord !== value) {
        callback("俩次输入新密码不一致，请检查！");
      }
      callback();
    },

    // 下一步
    resetNewPassword(e) {
      e.preventDefault();
      this.form2.validateFields(err => {
        if (!err) {
          const allValues = this.form2.getFieldsValue();
          const data = {
            ...allValues,
            mobile: this.mobile
          };
          resetPassword(data).then(res => {
            const result = res.data;
            if (result.code === 0) {
              this.$emit("nextStep");
            } else {
              this.$message.error(result.data.desc);
            }
          });
        }
      });
    },

    // 下一步
    nextStep() {
      let _this = this;
      _this.loading = true;
      setTimeout(function() {
        _this.$emit("nextStep");
      }, 1500);
    },

    // 上一步
    prevStep() {
      this.$emit("prevStep");
    }
  }
};
</script>

<style lang="less" scoped>
.stepFormText {
  margin-bottom: 24px;
  :global {
    .ant-form-item-label,
    .ant-form-item-control {
      line-height: 22px;
    }
  }
}
</style>
