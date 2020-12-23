<!--
 * @Description: 用户管理details详情页
 * @Author: Leo
 * @Date: 2020-12-23 14:52:44
 * @LastEditTime: 2020-12-23 18:01:22
 * @LastEditors: Leo
-->
<template>
  <div class="usersConfig-page"
       v-if="configshow">
    <a-card :body-style="{padding: '24px 32px'}"
            :bordered="false"
            :style="`min-height: ${pageMinHeight}px`">
      <a-form-model ref="ruleForm"
                    :model="form"
                    :rules="rules"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol">
        <a-form-model-item required
                           label="用户"
                           prop="name">
          <a-input v-model="form.name"
                   allowClear
                   :maxLength="20" />
        </a-form-model-item>
        <a-form-model-item required
                           label="账号"
                           prop="account">
          <a-input v-model="form.account"
                   auto-complete="new-account"
                   allowClear
                   :maxLength="20" />
        </a-form-model-item>
        <a-form-model-item required
                           label="密码"
                           prop="password">
          <a-input v-model="form.password"
                   type="password"
                   allowClear
                   auto-complete="new-password"
                   :maxLength="20" />
        </a-form-model-item>
        <a-form-model-item required
                           label="手机号"
                           prop="mobile">
          <a-input v-model="form.mobile"
                   allowClear
                   :maxLength="20" />
        </a-form-model-item>
        <a-form-model-item label="状态"
                           prop="state">
          <a-radio-group v-model="form.state">
            <a-radio value="1">启用</a-radio>
            <a-radio value="2">停用</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="备注"
                           prop="remark">
          <a-input v-model="form.remark"
                   :maxLength="500"
                   allowClear
                   :auto-size="{ minRows: 3, maxRows: 5 }"
                   type="textarea" />
        </a-form-model-item>
        <a-form-model-item label="角色"
                           prop="roles">
          <div class="treebox">
            <a-tree v-model="form.roles"
                    checkable
                    :tree-data="treeData" />
          </div>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 10 }">
          <a-button type="primary"
                    class="mr-20"
                    @click="onSubmit">保存
          </a-button>
          <a-button style="margin-left: 10px;"
                    @click="resetForm">取消
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "UsersConfig",
  props: {
    configshow: {
      type: Boolean,
      default: false,
    },
    treeData: {
      type: Array,
      required: true,
      default: new Array(),
    },
  },
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 11, offset: 1 },
      form: {
        name: "",
        account: "",
        mobile: "",
        password: "",
        remark: "",
        roles: [],
        state: "1",
      },
      // 搜索项校验规则
      rules: {
        name: [
          {
            required: true,
            message: "请输入用户",
            trigger: "blur",
          },
          // {
          //   min: 3,
          //   max: 10,
          //   message: "Length should be 3 to 5",
          //   trigger: "blur",
          // },
        ],
        account: [
          {
            required: true,
            message: "请输入账号！",
            trigger: "blur",
          },
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "账号必须输入邮箱！",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码！",
            trigger: "blur",
          },
          {
            min: 6,
            max: 12,
            message: "请输入6-12位密码！",
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号！",
            trigger: "blur",
          },
          {
            pattern: /^1\d{10}$/,
            message: "请输入正确手机号！",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    ...mapState(["pageMinHeight"]),
  },
  created() {},
  methods: {
    // 保存
    onSubmit() {
      console.log(this.form);
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 取消
    resetForm() {
      this.$refs.ruleForm.resetFields();
      this.$emit("closeConfig");
    },
  },
};
</script>

<style lang="less" scoped>
.usersConfig-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  margin-top: 24px;
}
.treebox {
  border: 1px solid #d9d9d9;
  border-radius: 3px;
  padding: 10px 0;
  min-height: 180px;
}
</style>