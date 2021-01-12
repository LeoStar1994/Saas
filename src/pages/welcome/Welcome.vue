<!--
 * @Description: 欢迎页面.
 * @Author: Leo
 * @Date: 2020-12-17 17:39:10
 * @LastEditTime: 2021-01-12 10:31:10
 * @LastEditors: Leo
-->
<template>
  <div class="rolesManagement-page">
    <a-card :style="`min-height: ${pageMinHeight}px`">
      <!-- <h1>欢迎使用本系统</h1> -->
      <img src="../../assets/img/welcome.png"
           width="100%"
           alt="欢迎背景图">
    </a-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Welcome",
  i18n: require("./i18n"),
  data() {
    return {};
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
  created() {},
  methods: {},
};
</script>

