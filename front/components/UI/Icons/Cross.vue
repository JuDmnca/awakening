<template>
    <svg ref="cross" class="cross" viewBox="0 0 14 14" :aria-labelledby="iconName" :width="width" :height="height" >
        <title :id="iconName"> {{iconName}} </title>
        <g :fill="iconColor">
            <path id="Tracé_126" data-name="Tracé 126" d="M19,6.41,17.59,5,12,10.59,6.41,5,5,6.41,10.59,12,5,17.59,6.41,19,12,13.41,17.59,19,19,17.59,13.41,12Z" transform="translate(-5 -5)" />
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
                default: 14
            },
            height: {
                type: [Number, String],
                default: 14
            },
            iconColor: {
                type: String,
                default: 'white'
            },
            toClose: {
                type: Boolean,
                default: false
            }
        },
        mounted() {
            if(this.toClose) {
                this.$refs.cross.addEventListener('click', () => {
                    this.$store.commit('constellation/toggleVisible')
                })
            }
        },
        updated() {
        }
    }
</script>

<style scoped>
    .cross {
        padding: 20px;
    }

    .cross:hover {
        cursor: pointer;
    }

</style>
