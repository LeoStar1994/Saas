<!--
 * @Description: 用户管理details详情页
 * @Author: Leo
 * @Date: 2020-12-23 14:52:44
 * @LastEditTime: 2020-12-25 15:31:47
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
        <a-form-model-item label="公司名称"
                           prop="name">
          <a-input v-model="form.name"
                   allowClear
                   :disabled="openType === 1"
                   placeholder="请输入公司名称"
                   :maxLength="30" />
        </a-form-model-item>
        <a-form-model-item label="账号"
                           prop="account">
          <a-input v-model="form.account"
                   auto-complete="new-account"
                   allowClear
                   placeholder="请输入账号"
                   :disabled="openType === 1"
                   :maxLength="30" />
        </a-form-model-item>
        <a-form-model-item label="密码"
                           prop="password">
          <a-input v-model="form.password"
                   :type="passwordType"
                   :disabled="openType === 1 || openType === 2"
                   placeholder="请输入密码"
                   auto-complete="new-password"
                   :maxLength="30">
            <a-tooltip slot="suffix"
                       title="查看密码">
              <a-icon type="eye"
                      v-if="form.password"
                      @click="passwordType = 'text'"
                      style="color: rgba(0,0,0,.45)" />
            </a-tooltip>
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="手机号"
                           prop="mobile">
          <a-input v-model="form.mobile"
                   allowClear
                   placeholder="请输入手机号"
                   :disabled="openType === 1"
                   :maxLength="30" />
        </a-form-model-item>
        <a-form-model-item label="状态"
                           prop="state">
          <a-radio-group v-model="form.state"
                         :disabled="openType === 1">
            <a-radio value="0">启用</a-radio>
            <a-radio value="1">停用</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="备注"
                           prop="remark">
          <a-input v-model="form.remark"
                   :maxLength="200"
                   :disabled="openType === 1"
                   placeholder="请输入备注"
                   allowClear
                   :auto-size="{ minRows: 3, maxRows: 5 }"
                   type="textarea" />
        </a-form-model-item>
        <a-form-model-item label="角色"
                           prop="roles">
          <div class="treebox">
            <a-tree v-model="form.roles"
                    checkable
                    :disabled="openType === 1"
                    :replaceFields='treeDefaultObject'
                    :tree-data="treeData" />
            <a-empty v-if="treeData.length === 0" />
            <a-icon type="sync"
                    title="刷新列表"
                    class="syncRoles"
                    @click="syncRoles" />
          </div>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 10 }">
          <a-button type="primary"
                    class="mr-20"
                    :disabled="openType === 1"
                    @click="onSubmit">保存
          </a-button>
          <a-button style="margin-left: 10px;"
                    @click="resetForm">取消
          </a-button>
        </a-form-model-item>
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
import { addUser, updateUser } from "@/services/usersManagement";

export default {
  name: "UsersConfig",
  props: {
    configshow: {
      type: Boolean,
      default: false
    },
    treeData: {
      type: Array,
      required: true,
      default: new Array()
    }
  },
  data() {
    return {
      openType: null, // 0新增 1查看 2修改
      sequenceNumber: null, // 修改时使用，id
      passwordType: "password",
      labelCol: { span: 5 },
      wrapperCol: { span: 11, offset: 1 },
      treeDefaultObject: {
        title: "name",
        key: "id"
      },
      form: {
        name: "",
        account: "",
        mobile: "",
        password: "",
        remark: "",
        roles: [],
        state: "0"
      },
      // 搜索项校验规则
      rules: {
        name: [
          {
            required: true,
            message: "请输入用户",
            trigger: "blur"
          }
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
            trigger: "blur"
          },
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "账号必须输入邮箱！",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码！",
            trigger: "blur"
          },
          {
            min: 6,
            max: 30,
            message: "请输入6-30位密码！",
            trigger: "blur"
          }
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号！",
            trigger: "blur"
          },
          {
            pattern: /^1\d{10}$/,
            message: "请输入正确手机号！",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState(["pageMinHeight"])
  },
  created() {},
  methods: {
    setOpenType(openType, sequenceNumber) {
      this.openType = openType;
      this.sequenceNumber = sequenceNumber;
      if (openType === 0) {
        this.resetAllFields();
      }
    },

    resetAllFields() {
      this.form = {
        name: "",
        account: "",
        mobile: "",
        password: "",
        remark: "",
        roles: [],
        state: "0"
      };
      this.passwordType = "password";
    },

    // 刷新同步角色
    syncRoles() {
      this.$emit("syncRoles");
    },

    // 保存
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const data = { ...this.form };
          this.$refs.loading.openLoading("操作进行中，请稍后。。");
          if (this.openType === 0) {
            // 新增
            addUser(data).then(res => {
              this.$refs.loading.closeLoading();
              const result = res.data;
              if (result.code === 0) {
                this.$message.success(result.desc);
                this.$emit("closeConfig");
                this.$emit("searchTableData");
              } else {
                this.$message.error(result.desc);
              }
            });
          } else if (this.openType === 2) {
            // 修改
            data.sequenceNumber = this.sequenceNumber;
            updateUser(data).then(res => {
              this.$refs.loading.closeLoading();
              const result = res.data;
              if (result.code === 0) {
                this.$message.success(result.desc);
                this.$emit("closeConfig");
                this.$emit("searchTableData");
              } else {
                this.$message.error(result.desc);
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    // 取消
    resetForm() {
      this.$refs.ruleForm.resetFields();
      this.passwordType = "password";
      this.$emit("closeConfig");
    }
  }
};
</script>

<style lang="less" scoped>
.treebox {
  position: relative;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 20px 0;
  min-height: 200px;
  .syncRoles {
    position: absolute;
    top: 10px;
    right: 12px;
    cursor: pointer;
  }
}
</style>