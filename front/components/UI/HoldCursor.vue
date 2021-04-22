<template>
  <section class="cursor">
    <svg ref="circle" viewBox="0 0 200 200">
      <path
        d="
          M 100, 100
          m -75, 0
          a 75,75 0 1,0 150,0
          a 75,75 0 1,0 -150,0
          "
      />
    </svg>
     <svg ref="inner" viewBox="0 0 200 200">
       <path
        d="
          M 100, 100
          m -75, 0
          a 75,75 0 1,0 150,0
          a 75,75 0 1,0 -150,0
          "
      />
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
      hold: false
    };
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      window.addEventListener("mouseover", this.followCursor)
      window.addEventListener("mousemove", this.followCursor)
      window.addEventListener("mousedown", this.showCursor)
      window.addEventListener("mouseup", this.hideCursor)
    })
  },
  methods: {
    init() {
      this.circle = this.$refs.circle
      this.inner = this.$refs.inner
      gsap.set(this.circle, { scale: 1 })
    },
    followCursor(e) {
      gsap.to([this.circle, this.inner], {
        x: e.clientX - 100 / 2,
        y: e.clientY - 100 / 2,
        duration: 0,
      })
    },
    showCursor () {
      this.hold = true
      gsap.to(
        this.circle,
        {
        opacity: 1,
        scale: 0.4,
        duration: 2,
        ease: "power3.out",
        onComplete: this.increaseCounter
        }
      )
      gsap.to(
        this.inner,
        {
        opacity: 1,
        duration: 2,
        ease: "power3.out"
        }
      )
    },
    hideCursor () {
      gsap.killTweensOf([this.circle, this.inner])
      this.hold = false
      gsap.to(
        this.circle,
        {
        opacity: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        }
      )
      gsap.to(
        this.inner,
        {
        opacity: 0,
        duration: 1,
        ease: "power3.out"
        }
      )
    },
    terminate() {
      gsap.set(this.circle, { scale: 0 })
    },
    increaseCounter () {
      if (this.hold) {
        if (this.$store.state.desert.counter != 3) {
          this.$store.commit('desert/increaseCounter')
        }
        if (this.$store.state.desert.counter === 3) {
          this.$nuxt.$emit('questionVisible', 2)
          this.hideCursor()
          window.removeEventListener("mousedown", this.showCursor)
          window.removeEventListener("mouseup", this.hideCursor)
          this.terminate()
        }
      }
    }
  },
};
</script>

<style>
svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
  z-index: 1000;
  opacity: 0;
  user-select: none;
  pointer-events: none;
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
svg:last-of-type path {
  transform: scale(0.4);
  stroke-width: 2px;
}
</style>

