<template>
  <div class='dl-backtool'>
    <div class="cursor" @click="$emit('goback')">
      <i class="el-icon-arrow-left"></i>
      返回
    </div>
    <slot name="middle"></slot>
    <slot>
      <span></span>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'dl-backtool',
  data() {
    return {

    }
  },
  created() {

  },
  methods: {

  }
}
</script>

<style lang='less' scoped>
.dl-backtool {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 20px;
  border-bottom: 1px solid #777;
  .cursor {
    cursor: pointer;
  }
}
</style>
