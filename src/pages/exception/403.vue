<template>
  <exception-page :home-route="homeRoute"
                  :style="`min-height: ${minHeight}`"
                  type="403" />
</template>

<script>
import ExceptionPage from "@/components/exception/ExceptionPage";
import { checkAuthorization } from "@/utils/request";
import { mapState } from "vuex";
export default {
  name: "Exp403",
  components: { ExceptionPage },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    minHeight() {
      return this.pageMinHeight ? this.pageMinHeight + "px" : "100vh";
    },
    homeRoute() {
      return checkAuthorization ? "/welcome" : "/login";
    },
  },
};
</script>

