<template>
    <section class="vignettage">
        <div ref="vignettage_1" class="vignettage_1" />
        <div ref="vignettage_2" class="vignettage_2" />
        <div ref="vignettage_3" class="vignettage_3" />
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
            this.$refs.vignettage_1.style.opacity = 0
            this.$refs.vignettage_2.style.opacity = 0
            this.$refs.vignettage_3.style.opacity = 0
            this.$nextTick(() => {
                window.addEventListener("mousedown", this.launchEffect)
                window.addEventListener("mouseup", this.unLaunchEffect)
            })
        },
        methods: {
            launchTransition(vignettageRef, end) {
                gsap.killTweensOf(vignettageRef)
                gsap.to(
                    vignettageRef,
                    {
                        opacity: 1,
                        duration: 2,
                        ease: 'power3.inOut',
                        onComplete: () => {
                            if (end) {
                                this.$emit('onscreen')
                            }
                        }
                    }
                )
            },
            unLaunchTransition(vignettageRef) {
                gsap.killTweensOf(vignettageRef)
                gsap.to(
                    vignettageRef,
                    {
                        opacity: 0,
                        duration: 1,
                        ease: 'power3.out'
                    }
                )
            },
            launchEffect() {
                switch (this.$store.state.desert.counter) {
                   case 0:
                        this.launchTransition(this.$refs.vignettage_1.style, false)
                        break;
                    case 1:
                        this.launchTransition(this.$refs.vignettage_2.style, false)
                        break;
                    case 2:
                        this.launchTransition(this.$refs.vignettage_3.style, true)
                        break;
                }
            },
            unLaunchEffect() {
                switch (this.$store.state.desert.counter) {
                   case 0:
                        this.unLaunchTransition(this.$refs.vignettage_1.style)
                        break;
                    case 1:
                        this.unLaunchTransition(this.$refs.vignettage_2.style)
                        break;
                    case 2:
                        this.unLaunchTransition(this.$refs.vignettage_3.style)
                        break;
                }
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

