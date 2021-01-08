<template>
  <div class="step1-page">
    <a-form @submit="onSubmitCode"
            style="max-width: 400px; margin: 40px auto"
            :form="form">
      <!-- 手机号 -->
      <a-form-item>
        <a-input size="default"
                 placeholder="请输入手机号"
                 :maxLength="13"
                 v-decorator="['mobile', {rules: [{ required: true, validator: handleCheckMobile, whitespace: true}]}]">
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
                      :disabled="!$isRihgtPhone(form.getFieldValue('mobile')) || fetchingCode"
                      size="default">
              <span v-if="!fetchingCode"
                    style="font-size: 12px;">获取验证码</span>
              <span v-else
                    style="font-size: 12px;">{{countDownSceonds}}s后重新发送</span>
            </a-button>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item>
        <a-button size="default"
                  @click="onSubmitCode"
                  type="primary">
          下一步
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { forgetSMSCode, checkForgetSMSCode } from "@/services/user";
export default {
  name: "Step1",
  data() {
    return {
      form: this.$form.createForm(this),
      fetchingCode: false,
      countDownSceonds: 60,
      timer: null,
    };
  },
  methods: {
    // 手机号校验
    handleCheckMobile(rule, value, callback) {
      if (this.$isEmpty(value)) {
        callback("请输入您的手机号");
      } else if (!this.$isRihgtPhone(value)) {
        callback("手机号格式不正确！");
      }
      callback();
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
      const mobile = this.form.getFieldValue("mobile");
      // ajax
      forgetSMSCode({ mobile }).then((res) => {
        console.log(result);
        const result = res.data;
        if (result.code === 0) {
          this.$message.success("短信验证码已发送，请注意查收");
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    onSubmitCode(e) {
      e.preventDefault();
      this.form.validateFields((err) => {
        if (!err) {
          const allValues = this.form.getFieldsValue();
          checkForgetSMSCode(allValues).then((res) => {
            const result = res.data;
            if (result.code === 0) {
              this.$emit("nextStep", allValues.mobile);
            } else {
              this.$message.error(result.data.desc);
            }
          });
        }
      });
    },
  },
};
</script>

