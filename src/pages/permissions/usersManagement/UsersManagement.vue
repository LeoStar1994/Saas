<!--
 * @Description: 权限管理 / 角色管理.
 * @Author: Leo
 * @Date: 2020-12-17 17:39:10
 * @LastEditTime: 2020-12-23 18:00:28
 * @LastEditors: Leo
-->
<template>
  <div class="usersManagement-page">
    <a-card :style="`min-height: ${pageMinHeight}px`">
      <!-- search -->
      <div :class="advanced ? 'search' : null">
        <a-form-model ref="ruleForm"
                      :model="form"
                      :rules="rules"
                      :label-col="labelCol"
                      :wrapper-col="wrapperCol">
          <div :class="advanced ? null: 'fold'">
            <a-row>
              <!-- 用户名 -->
              <a-col :md="8"
                     :sm="24">
                <a-form-model-item label="用户名"
                                   prop="name">
                  <a-input v-model="form.name"
                           allowClear
                           :maxLength="10"
                           placeholder="请输入用户名"></a-input>
                </a-form-model-item>
              </a-col>
              <!-- 账号 -->
              <a-col :md="8"
                     :sm="24">
                <a-form-model-item label="账号"
                                   prop="name">
                  <a-input v-model="form.account"
                           allowClear
                           :maxLength="10"
                           placeholder="请输入账号"></a-input>
                </a-form-model-item>
              </a-col>
              <!-- 手机号 -->
              <a-col :md="8"
                     :sm="24">
                <a-form-model-item label="手机号"
                                   prop="name">
                  <a-input v-model="form.mobile"
                           allowClear
                           :maxLength="10"
                           placeholder="请输入手机号"></a-input>
                </a-form-model-item>
              </a-col>

            </a-row>
          </div>
          <!-- 查询、重置、收起 -->
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary"
                      @click="searchTableData">查询</a-button>
            <a-button style="margin-left: 8px"
                      @click="reset">重置</a-button>
            <a @click="toggleAdvanced"
               style="margin-left: 8px">
              {{advanced ? '收起' : '展开'}}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
          </span>
        </a-form-model>
      </div>
      <div>
        <!-- operator -->
        <div class="operator">
          <a-button @click="openAlarm(0)"
                    class="mr-10"
                    type="primary">新建</a-button>
          <a-button>批量操作</a-button>
        </div>
        <!-- table -->
        <standard-table :columns="columns"
                        :dataSource="dataSource"
                        :loading="tableLoading"
                        :pagination="pagination"
                        rowKey="id"
                        @change="handleTableChange">
          <div slot="status"
               slot-scope="{text}">
            <span :class="[text === 1 ? 'text-red': '', text === 2 ? 'text-orange': '', text === 3 ? 'text-blue': '']">{{statusMapText[text]}}</span>
          </div>
          <div slot="action"
               slot-scope="{text, record}">
            <a class="mr-12"
               @click="openAlarm(1)">详情
            </a>
            <a class="mr-12"
               @click="openAlarm(2)">修改</a>
            <a @click="stopService(record)"
               class="text-orange mr-12">停用</a>
            <a @click="deleteInfo(text)"
               class="text-red">删除</a>
          </div>
        </standard-table>
      </div>
    </a-card>
    <UsersConfig :configshow="configshow"
                 :treeData="treeData"
                 @closeConfig='closeConfig'></UsersConfig>
  </div>
</template>

<script>
import { mapState } from "vuex";
import StandardTable from "@/components/table/StandardTable";
import { getUsersTableData, rolesTreeList } from "@/services/usersManagement";
import UsersConfig from "./UsersConfig";

// table columns data
const columns = [
  {
    title: "序号",
    dataIndex: "sortNum",
  },
  {
    title: "用户",
    dataIndex: "user",
  },
  {
    title: "账号",
    dataIndex: "account",
  },
  {
    title: "手机号",
    dataIndex: "phone",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
  },
  {
    title: "角色名称",
    dataIndex: "roleName",
  },
  {
    title: "状态",
    dataIndex: "status",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
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
        total: 0,
        pageSizeOptions: ["10", "15", "20"],
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条数据`,
      },
      labelCol: { span: 5 },
      wrapperCol: { span: 18, offset: 1 },
      form: {
        name: undefined,
        account: undefined,
        mobile: undefined,
      },
      // 搜索项校验规则
      rules: {
        name: [],
        account: [],
        mobile: [],
      },
      statusMapText: {
        1: "审核中",
        2: "审核失败",
        3: "审核通过",
      },
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
    },
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取角色tree list
    getRolesList() {
      rolesTreeList().then((res) => {
        const result = res.data;
        if (result.code === 0) {
          this.treeData = result.data.roleModels.map((item) => {
            return {
              key: item.id,
              title: item.name,
            };
          });
        }
      });
    },

    // 切换搜索框收起展开
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },

    /**
     * @description: 打开详情页
     * @param : status{int} 0: 新增， 1:查看， 2:修改
     * @return {*}
     * @author: Leo
     */
    openAlarm(status) {
      console.log(status);
      this.configshow = true;
    },

    // 关闭详情alarm
    closeConfig() {
      this.configshow = false;
    },

    // 停用
    stopService() {},

    // 删除
    deleteInfo() {},

    // 列表查询
    searchTableData() {
      const data = { ...this.form };
      this.tableLoading = true;
      getUsersTableData(data).then((res) => {
        const result = res.data;
        if (result.code === 0) {
          this.dataSource = result.data;
          this.pagination.total = result.total;
        }
        this.tableLoading = false;
      });
    },

    handleTableChange(pagination, filters, sorter) {
      console.log(pagination);
      console.log(filters);
      console.log(sorter);
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      // this.pagination = pager;
      // this.fetch({
      //   results: pagination.pageSize,
      //   page: pagination.current,
      //   sortField: sorter.field,
      //   sortOrder: sorter.order,
      //   ...filters
      // });
    },

    // 重置
    reset() {
      this.$refs.ruleForm.resetFields();
      this.dataSource = [];
    },
  },
  // 监听页面离开事件， 清空页面数据
  beforeRouteLeave(to, from, next) {
    if (to.path !== from.path) {
      this.reset();
    }
    next();
  },
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