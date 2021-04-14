<template>
  <section>
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
      window.addEventListener("mouseover", this.followCursor);
      window.addEventListener("mousemove", this.followCursor);
      window.addEventListener("mousedown", (e) => {
        e.preventDefault();
        this.showCursor();
      });
      window.addEventListener("mouseup", (e) => {
        e.preventDefault();
        this.hideCursor();
      });
    });
  },
  methods: {
    init() {
      this.circle = this.$refs.circle;
      this.inner = this.$refs.inner;
      gsap.set(this.circle, { scale: 1 });
    },
    followCursor(e) {
      gsap.to([this.circle, this.inner], {
        x: e.clientX - 100 / 2,
        y: e.clientY - 100 / 2,
        duration: 0,
      });
    },
    showCursor () {
        if (!this.hold) {
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
            } else {
            gsap.to(
                this.circle,
                {
                opacity: 1,
                scale: 0.4,
                duration: 2,
                ease: "power3.out",
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
        }
    },
    hideCursor () {
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
    increaseCounter () {
        this.$store.commit('desert/increaseCounter')
        console.log(this.$store.state.desert.counter)
        if (this.$store.state.desert.counter === 3) {
        console.log('Interaction done !')
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

