<template>
  <div class="background">
    <span class="circle1"></span>
    <span class="circle2"></span>
    <span class="underlay"></span>
  </div>
</template>

<style>
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: #BED9FD;
  filter: blur(100px);
  z-index: 4;
}
.circle1, .circle2 {
  position: absolute;
  display: block;
  background: radial-gradient(circle, rgba(252,181,176,1) 0%, rgba(255,190,246,1) 70%, rgba(194,181,251,1) 100%);
  border-radius: 500px;
}
.circle1 {
  width: 90vh;
  height: 90vh;
  animation: 20s ease-in-out circle1 infinite alternate;
}
@keyframes circle1 {
  0% { transform: translate(30vw, 50vh); }
  25% { transform: translate(78vw, 5vh); }
  50% { transform: translate(20vw, 20vh); }
  75% { transform: translate(50vw, 0vh); }
  100%   { transform: translate(0vw, 70vh); }
}
.circle2 {
  width: 50vh;
  height: 50vh;
  animation: 12s ease-in-out circle2 infinite alternate;
}
@keyframes circle2 {
  0% { transform: translate(0vw, 10vh); }
  25% { transform: translate(48vw, 42vh); }
  50% { transform: translate(25vw, 70vh); }
  75% { transform: translate(0vw, 0vh); }
  100%{ transform: translate(60vw, 20vh); }
}
.underlay {
  width: 150vh;
  height: 150vh;
  position: absolute;
  display: block;
  z-index: -1;
  border-radius: 1000px;
  background: rgba(194,181,251,1);
  animation: 20s ease-in-out underlay infinite alternate;
}
@keyframes underlay {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-50%, -50%); }
  50% { transform: translate(10%, 0%); }
  75% { transform: translate(25%, 20%); }
  100% { transform: translate(-25%, 5%); }
}
</style>