<!--
 * @Description: loading
 * @Author: Leo
 * @Date: 2020-12-24 17:54:52
 * @LastEditTime: 2020-12-24 18:27:04
 * @LastEditors: Leo
-->

<template>
  <transition name="el-fade-in">
    <div class="w100p h100p pos-fixed alarm-loading alarm-box-loading"
         style="z-index: 5000; top: 0; right: 0; bottom: 0; left: 0;"
         v-show="animateLoading">
      <div class="opacity-70p bg-black w100p h100p pos-relative">
        <div class="w400 h100 pos-absolute loading-box-wrap"
             style="left: 50%; top: 50%; transform:translate(-50%); ">
          <div class="text-center">
            <svg class="icon-loading el-icon-refresh"
                 viewBox="0 0 1024 1024"
                 version="1.1"
                 xmlns="http://www.w3.org/2000/svg"
                 width="60"
                 height="60">
              <path d="M172.18332445 878.56469333V948.90666667A48.54556445 48.54556445 0 0 1 75.09333333 948.90666667V754.72554667a48.54556445 48.54556445 0 0 1 48.54556445-48.54442667h194.17998222a48.54556445 48.54556445 0 0 1 0 97.08999111H233.44924445c74.27413333 60.00184889 176.75264 97.08999111 278.55189333 97.08999111A388.36110222 388.36110222 0 0 0 900.36110222 512a48.54556445 48.54556445 0 0 1 97.09112889 0c0 268.11505778-217.33717333 485.45223111-485.45223111 485.45223111-123.74129778 0-247.92064-44.46776889-339.81667555-118.88753778zM790.55189333 220.72888889c-74.27413333-60.00184889-176.75264-97.08999111-278.55189333-97.08999111A388.36110222 388.36110222 0 0 0 123.63889778 512a48.54556445 48.54556445 0 0 1-97.09112889 0C26.54776889 243.88494222 243.88494222 26.54776889 512 26.54776889c123.74129778 0 247.92064 44.46776889 339.81667555 118.88753778V75.09333333A48.54556445 48.54556445 0 0 1 948.90666667 75.09333333v194.18112a48.54556445 48.54556445 0 0 1-48.54556445 48.54442667H706.18112a48.54556445 48.54556445 0 0 1 0-97.08999111h84.37077333z"
                    fill="#fff"></path>
            </svg>
          </div>

          <div class="text-white fz-20 text-center">{{ message }}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "loading",
  data() {
    return {
      animateLoading: false,
      message: "",
    };
  },
  methods: {
    openLoading(text, num) {
      let timeout =
        !this.$isEmpty(num) && typeof num === "number" ? num : 30000;
      this.message = text;
      this.animateLoading = true;
      setTimeout(() => {
        this.closeLoading();
      }, timeout);
    },

    closeLoading() {
      this.message = "";
      this.animateLoading = false;
    },
  },
};
</script>

<style>
.alarm-box-loading .el-icon-refresh {
  animation: animation-refresh 1s linear 0s infinite;
}

@-webkit-keyframes animation-refresh {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes animation-refresh {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
