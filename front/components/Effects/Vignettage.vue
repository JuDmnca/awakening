<template>
    <section class="vignettage">
        <div ref="vignettage_1" class="vignettage_1"></div>
        <div ref="vignettage_2" class="vignettage_2"></div>
        <div ref="vignettage_3" class="vignettage_3"></div>
    </section>
</template>

<script>
    import gsap from "gsap"

    export default {
        name: 'vignettage',
        data() {
            return {}
        },
        mounted() {
            this.$nextTick(() => {
                window.addEventListener("mousedown", this.launchEffect)
                window.addEventListener("mouseup", this.unLaunchEffect)
            })
        },
        methods: {
            launchEffect() {
                this.$refs.vignettage_1.style.opacity = 0
                this.$refs.vignettage_2.style.opacity = 0
                this.$refs.vignettage_3.style.opacity = 0
                gsap.to(
                    this.$refs.vignettage_1.style,
                    {
                        opacity: 1,
                        duration: 1,
                        ease: 'power3.in'
                    }
                )
            },
            unLaunchEffect() {
                gsap.killTweensOf(this.$refs.vignettage_1)
                gsap.to(
                    this.$refs.vignettage_1.style,
                    {
                        opacity: 0,
                        duration: 1,
                        ease: 'power3.out'
                    }
                )
            }
        }
    }
</script>

<style>
.vignettage_1, .vignettage_2, .vignettage_3 {
    position: absolute;
    width: 100vw;
    height: 100vh;
}

.vignettage_1 {
    background: radial-gradient(circle, rgba(255,0,255,0) 66.66%, rgba(255,0,255,1) 100%); 
    opacity: 0;
} 

.vignettage_2 {
    background: radial-gradient(circle, rgba(255,0,255,0) 33.33%, rgba(255,0,255,1) 100%);
    opacity: 0;
}

.vignettage_3 {
    background: rgb(255,0,255);
    opacity: 0;
}
</style>

