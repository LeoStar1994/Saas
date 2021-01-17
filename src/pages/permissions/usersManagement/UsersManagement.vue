<!--
 * @Description: 权限管理 / 角色管理.
 * @Author: Leo
 * @Date: 2020-12-17 17:39:10
 * @LastEditTime: 2020-12-25 15:30:49
 * @LastEditors: Leo
-->
<template>
  <div class="usersManagement-page">
    <a-card :style="`min-height: ${pageMinHeight}px`"
            v-show="!configshow">
      <!-- search -->
      <div :class="advanced ? 'search' : null">
        <a-form-model ref="ruleForm"
                      :model="form"
                      :rules="rules"
                      :label-col="labelCol"
                      :wrapper-col="wrapperCol">
          <div :class="advanced ? null: 'fold'">
            <a-row>
              <!-- 公司名称 -->
              <a-col :md="8"
                     :sm="24">
                <a-form-model-item label="公司名称"
                                   prop="name">
                  <a-input v-model="form.name"
                           allowClear
                           :maxLength="30"
                           placeholder="请输入公司名称"></a-input>
                </a-form-model-item>
              </a-col>
              <!-- 账号 -->
              <a-col :md="8"
                     :sm="24">
                <a-form-model-item label="账号"
                                   prop="account">
                  <a-input v-model="form.account"
                           allowClear
                           :maxLength="30"
                           placeholder="请输入账号"></a-input>
                </a-form-model-item>
              </a-col>
              <!-- 手机号 -->
              <a-col :md="8"
                     :sm="24">
                <a-form-model-item label="手机号"
                                   prop="mobile">
                  <a-input v-model="form.mobile"
                           allowClear
                           :maxLength="30"
                           placeholder="请输入手机号"></a-input>
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
          <!-- 查询、重置、收起 -->
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary"
                      @click="searchTableData()">查询</a-button>
            <a-button style="margin-left: 8px"
                      @click="reset">重置</a-button>
            <!-- <a @click="toggleAdvanced"
               style="margin-left: 8px">
              {{advanced ? '收起' : '展开'}}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a> -->
          </span>
        </a-form-model>
      </div>
      <div>
        <!-- operator -->
        <div class="operator">
          <a-button @click="openAlarm(0)"
                    class="mr-10"
                    type="primary">新增</a-button>
        </div>
        <!-- table -->
        <standard-table :columns="columns"
                        rowKey="sequenceNumber"
                        :dataSource="dataSource"
                        :loading="tableLoading"
                        :pagination="pagination"
                        @change="handleTableChange">
          <div slot="state"
               slot-scope="{text}">
            <span :class="[text === 0 ? 'text-green': '', text === 1 ? 'text-red': '']">{{statusMapText[text]}}</span>
          </div>
          <div slot="action"
               slot-scope="{record}">
            <a-button class="mr-12"
                      size="small"
                      type="primary"
                      @click="openAlarm(1, record.sequenceNumber)">详情
            </a-button>
            <a-button class="mr-12"
                      size="small"
                      type="primary"
                      @click="openAlarm(2, record.sequenceNumber)">修改</a-button>
            <a-button @click="changeService(record.sequenceNumber, 0)"
                      v-if="record.state === 1"
                      size="small"
                      class="greenButton mr-12">启用</a-button>
            <a-button @click="changeService(record.sequenceNumber, 1)"
                      size="small"
                      v-if="record.state === 0"
                      class="orangeButton mr-12">停用</a-button>
            <a-popconfirm title="是否删除该条数据?"
                          ok-text="确定"
                          cancel-text="取消"
                          @confirm="deleteInfo(record.sequenceNumber)"
                          @cancel="deletecancel">
              <a-button type="danger"
                        size="small">删除</a-button>
            </a-popconfirm>
          </div>
        </standard-table>
      </div>
    </a-card>
    <!-- 详情config -->
    <UsersConfig ref="userConfig"
                 :configshow="configshow"
                 :treeData="treeData"
                 @closeConfig='closeConfig'
                 @syncRoles="getRolesList"
                 @searchTableData='searchTableData'></UsersConfig>
    <!-- loading -->
    <transition name="el-fade-in">
      <loading ref="loading"></loading>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import StandardTable from "@/components/table/StandardTable";
import {
  getUsersTableData,
  rolesTreeList,
  changeUserState,
  deleteUserInfo,
  initUserDetail
} from "@/services/usersManagement";
import UsersConfig from "./UsersConfig";

// table columns data
const columns = [
  // {
  //   title: "序号",
  //   dataIndex: "sequenceNumber"
  // },
  {
    title: "公司名称",
    dataIndex: "name"
  },
  {
    title: "账号",
    dataIndex: "account"
  },
  {
    title: "手机号",
    dataIndex: "mobile"
  },
  {
    title: "创建时间",
    dataIndex: "createTime"
  },
  {
    title: "更新时间",
    dataIndex: "updateTime"
  },
  {
    title: "角色名称",
    dataIndex: "rolesName"
  },
  {
    title: "状态",
    dataIndex: "state",
    scopedSlots: { customRender: "state" }
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" }
  }
];

export default {
  name: "UsersManageMent",
  components: { StandardTable, UsersConfig },
  i18n: require("./i18n"),
  data() {
    return {
      advanced: true,
      tableLoading: false,
      configshow: false, // 新增config 显隐
      treeData: [],
      columns: columns,
      dataSource: [],
      pagination: {
        pageSize: 10,
        pageNo: 1,
        total: 0,
        pageSizeOptions: ["10", "15", "20"],
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条数据`
      },
      labelCol: { span: 5 },
      wrapperCol: { span: 18, offset: 1 },
      form: {
        name: undefined,
        account: undefined,
        mobile: undefined
      },
      // 搜索项校验规则
      rules: {
        name: [],
        account: [],
        mobile: []
      },
      statusMapText: {
        0: "启用",
        1: "停用"
      }
    };
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    // page header desc
    desc() {
      if (this.configshow) {
        return this.$t("configDesc");
      } else {
        return this.$t("description");
      }
    }
  },
  created() {
    this.searchTableData();
  },
  methods: {
    // 获取角色tree list
    getRolesList() {
      this.$refs.loading.openLoading("正在初始化数据，请稍后。。");
      rolesTreeList()
        .then(res => {
          this.$refs.loading.closeLoading();
          const result = res.data;
          if (result.code === 0) {
            this.treeData = result.data.roleModels;
          } else {
            this.$message.error(result.desc);
          }
        })
        .catch(() => {
          this.$refs.loading.closeLoading();
        });
    },

    // 切换搜索框收起展开
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },

    /**
     * @description: 打开详情页
     * @param : status{int} 0: 新增， 1:查看， 2:修改
     * @param : id{int}
     * @return {*}
     * @author: Leo
     */
    async openAlarm(status, id) {
      if (status === 1 || status === 2) {
        await this.userConfigDetail(id);
      }
      this.configshow = true;
      this.$refs.userConfig.setOpenType(status, id);
      this.getRolesList();
    },

    // 查看 | 修改返显数据
    userConfigDetail(id) {
      this.$refs.loading.openLoading("数据查询中，请稍后。。");
      initUserDetail(id).then(res => {
        this.$refs.loading.closeLoading();
        const result = res.data;
        if (result.code === 0) {
          this.$refs.userConfig.form = {
            name: result.data.name,
            account: result.data.account,
            mobile: result.data.mobile,
            password: result.data.password,
            remark: result.data.remark,
            roles: result.data.roles,
            state: result.data.state.toString()
          };
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    // 停用 | 启用
    changeService(sequenceNumber, state) {
      const data = {
        sequenceNumber,
        state
      };
      this.$refs.loading.openLoading("操作进行中，请稍后。。");
      changeUserState(data).then(res => {
        this.$refs.loading.closeLoading();
        const result = res.data;
        if (result.code === 0) {
          this.$message.success(result.desc);
          this.searchTableData();
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    // 删除
    deleteInfo(id) {
      this.$refs.loading.openLoading("操作进行中，请稍后。。");
      deleteUserInfo(id).then(res => {
        this.$refs.loading.closeLoading();
        const result = res.data;
        if (result.code === 0) {
          this.$message.success(result.desc);
          this.searchTableData();
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    deletecancel() {
      this.$message.warning("删除操作已取消");
    },

    // 列表查询
    searchTableData() {
      const data = {
        ...this.form,
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize
      };
      this.tableLoading = true;
      getUsersTableData(data).then(res => {
        const result = res.data;
        if (result.code === 0) {
          this.dataSource = result.data.records;
          this.pagination.total = result.data.total;
        }
        this.tableLoading = false;
      });
    },

    // 分页
    handleTableChange(pagination) {
      let { current, pageSize } = pagination;
      this.pagination.pageSize = pageSize;
      this.pagination.pageNo = current;
      this.searchTableData();
    },

    // 重置分页数据
    resetPagination() {
      this.pagination.pageSize = 10;
      this.pagination.total = 0;
    },

    // 重置
    reset() {
      this.$refs.ruleForm.resetFields();
      // this.dataSource = [];
      this.resetPagination();
      this.configshow = false;
    },

    // 关闭详情config
    closeConfig() {
      this.configshow = false;
    }
  },
  // 监听页面离开事件， 清空页面数据
  beforeRouteLeave(to, from, next) {
    if (to.path !== from.path) {
      if (this.configshow && this.$refs.userConfig.openType === 0) {
        const _this = this;
        this.$confirm({
          title: "跳转其他页面会清空当前页面已填写的数据，是否继续?",
          okText: "确定",
          okType: "primary",
          cancelText: "取消",
          onOk() {
            _this.reset();
            next();
          },
          onCancel() {
            _this.$message.warning("操作已取消");
          }
        });
      } else {
        next();
        this.reset();
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.searchTableData();
    });
  }
};
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}
.fold {
  width: calc(100% - 216px);
  display: inline-block;
}
.operator {
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>