<template>
  <section class="cursor">
    <svg class="circle" ref="circle" viewBox="0 0 200 200">
      <path class="circle__path"
        d="
          M 100, 100
          m -75, 0
          a 75,75 0 1,0 150,0
          a 75,75 0 1,0 -150,0
          "
      />
    </svg>
    <svg class="point" ref="point" width="8" height="8" viewBox="0 0 8 8">
      <circle id="Ellipse_16" data-name="Ellipse 16" cx="4" cy="4" r="4" fill="#fff"/>
    </svg>

  </section>
</template>

<script>
import gsap from "gsap";

export default {
  data() {
    return {
      circle: null,
      inner: null,
      hold: false,
      active: false
    }
  },
  mounted() {
    
    this.init();
    this.$nextTick(() => {
      window.addEventListener("mouseover", this.followCursor)
      window.addEventListener("mousemove", this.followCursor)
      window.addEventListener("mousedown", this.holdCursor)
      window.addEventListener("mouseup", this.unHoldCursor)
    })
    this.$nuxt.$on('activeCursor', () => {
      this.activeCursor()
    })
    this.$nuxt.$on('unactiveCursor', () => {
      this.unActiveCursor()
    })
  },
  methods: {
    init() {
      this.circle = this.$refs.circle
      this.inner = this.$refs.inner
      this.point = this.$refs.point
      gsap.set(this.circle, { scale: 1. })
      gsap.set(this.circle, { fillOpacity: 0 })
    },
    followCursor(e) {
      gsap.to([this.circle, this.inner, this.point], {
        x: e.clientX - 50 / 2,
        y: e.clientY - 50 / 2,
        duration: 0,
      })
    },
    holdCursor () {
      this.hold = true
      gsap.to(
        this.circle,
        {
        scale: 0.4,
        strokeOpacity: 0,
        fillOpacity: 0.4,
        duration: this.$store.state.durationHold,
        ease: "power3.out",
        onComplete: this.increaseCounter
        }
      )
    },
    unHoldCursor () {
      gsap.killTweensOf([this.circle, this.inner])
      this.hold = false
      gsap.to(
        this.circle,
        {
        scale: this.active? 0.6 : 1,
        strokeOpacity: 1,
        fillOpacity: 0,
        duration: 1,
        ease: "power3.out",
        }
      )
    },
    activeCursor () {
      this.active = true
      gsap.to(
        this.circle,
        {
        scale: 0.6,
        // - 0.2 because we have the impression that the hold ends at the right time
        duration: this.$store.state.durationHold - 1,
        ease: "power.out"
        }
      )
    },
    unActiveCursor () {
      gsap.killTweensOf([this.circle, this.inner])
      this.active = false
      gsap.to(
        this.circle,
        {
        scale: 1,
        duration: 1,
        ease: "power3.out",
        }
      )
    },
    increaseCounter () {
      if (this.hold) {
        if (this.$store.state.desert.counter != 3) {
          this.$store.commit('desert/increaseCounter')
        }
        if (this.$store.state.desert.counter === 3) {
          this.$nuxt.$emit('questionVisible', 2)
          // this.hideCursor()
          window.removeEventListener("mousedown", this.showCursor)
          // window.removeEventListener("mouseup", this.hideCursor)
          this.terminate()
        }
      }
    }
  },
};
</script>

<style scoped>
svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 50px;
  z-index: 1000;
  opacity: 1;
  user-select: none;
  pointer-events: none;
}

.circle {
  opacity: 1;
  stroke-width: 2px;
}

.circle__path {
  fill:#fff;
  /* fill-opacity:0; */
}

.point {
  transform: scale(0.15)
}

path {
  fill: transparent;
  stroke: white;
  transform-origin: center;
  width: 100px;
  height: 100px;
  user-select: none;
  pointer-events: none;
}
</style>

