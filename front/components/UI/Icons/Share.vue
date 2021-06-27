<template>
  <svg
    :aria-labelledby="iconName"
    :width="width"
    :height="height"
    viewBox="0 0 24 24"
  >
    <path id="Tracé_146" data-name="Tracé 146" d="M0,0H24V24H0Z" fill="none" />
    <path id="Tracé_147" data-name="Tracé 147" d="M18,16.08a2.912,2.912,0,0,0-1.96.77L8.91,12.7A3.274,3.274,0,0,0,9,12a3.274,3.274,0,0,0-.09-.7l7.05-4.11A2.993,2.993,0,1,0,15,5a3.274,3.274,0,0,0,.09.7L8.04,9.81a3,3,0,1,0,0,4.38l7.12,4.16a2.821,2.821,0,0,0-.08.65A2.92,2.92,0,1,0,18,16.08ZM18,4a1,1,0,1,1-1,1A1,1,0,0,1,18,4ZM6,13a1,1,0,1,1,1-1A1,1,0,0,1,6,13Zm12,7.02a1,1,0,1,1,1-1A1,1,0,0,1,18,20.02Z" fill="#fff" />
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
      default: 14
    },
    height: {
      type: [Number, String],
      default: 14
    },
    iconColor: {
      type: String,
      default: 'white'
    }
  }
}
</script>
