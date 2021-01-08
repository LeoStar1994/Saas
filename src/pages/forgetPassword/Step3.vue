<template>
  <div style="max-width: 500px; margin: 40px auto 0; text-align: center">
    <result :title="$t('success')"
            :is-success="true" />
  </div>
</template>

<script>
import Result from "@/components/result/Result";
export default {
  name: "Step3",
  i18n: require("./i18n"),
  components: { Result },
};
</script>

