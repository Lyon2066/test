<template>
  <div>{{msg}}</div>
</template>
<script>
export default {
  data() {
    return {
      msg: "初始值"
    };
  },
  mounted() {
    setTimeout(() => {
      this.msg = "改变值";
    },3000);
  }
};
</script>