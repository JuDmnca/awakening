<template>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 13" :aria-labelledby="iconName" :width="width" :height="height" >
        <title :id="iconName"> {{iconName}} </title>
        <g :fill="iconColor">
            <path id="Tracé_131" data-name="Tracé 131" d="M11,19h2V17H11ZM12,6a4,4,0,0,0-4,4h2a2,2,0,0,1,4,0c0,2-3,1.75-3,5h2c0-2.25,3-2.5,3-5A4,4,0,0,0,12,6Z" transform="translate(-8 -6)" />
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
                default: 8
            },
            height: {
                type: [Number, String],
                default: 13
            },
            iconColor: {
                type: String,
                default: 'white'
            }
        }
    }
</script>
