<template>
  <div class='dl-title'>
    <span>{{title}}</span>
    <slot name="middle"></slot>
    <slot>
      <span></span>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'dl-title',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
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
.dl-title {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 20px 0 30px;
  font-size: 14px;
  font-weight: 700;
  &::before {
    position: absolute;
    left: 20px;
    top: 16px;
    content: '';
    width: 2px;
    height: 20px;
    background-color: #e6e6e6;
  }
}
</style>
