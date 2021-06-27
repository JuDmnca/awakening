<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.6 13.4" :aria-labelledby="iconName" :width="width" :height="height">
    <title :id="iconName"> {{ iconName }} </title>
    <g :fill="iconColor">
      <path id="Tracé_124" data-name="Tracé 124" d="M9,16.2,4.8,12,3.4,13.4,9,19,21,7,19.6,5.6Z" transform="translate(-3.4 -5.6)" />
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
      default: 17.6
    },
    height: {
      type: [Number, String],
      default: 13.4
    },
    iconColor: {
      type: String,
      default: 'white'
    }
  }
}
</script>
