<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 12" :aria-labelledby="iconName" :width="width" :height="height">
    <title :id="iconName"> {{ iconName }} </title>
    <g :fill="iconColor">
      <rect id="Rectangle_11" data-name="Rectangle 11" width="2" height="8" transform="translate(0 4)" />
      <rect id="Rectangle_12" data-name="Rectangle 12" width="2" height="2" />
    </g>
  </svg>
</template>
<script>
export default {
  props: {
    iconName: {
      type: String,
      default: 'box'
    },
    width: {
      type: [Number, String],
      default: 2
    },
    height: {
      type: [Number, String],
      default: 12
    },
    iconColor: {
      type: String,
      default: 'white'
    }
  }
}
</script>
