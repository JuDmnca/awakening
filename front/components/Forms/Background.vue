<template>
  <div class="background">
    <span class="circle1"></span>
    <span class="circle2"></span>
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
  border-radius: 500px;
}
.circle1 {
  width: 90vh;
  height: 90vh;
  background: radial-gradient(#FCB5B8, #FFB4F5);
  animation: 20s ease-in-out circle1 infinite alternate;
}
@keyframes circle1 {
  0% { transform: translate(30vw, 50vh); }
  25% { transform: translate(78vw, 5vh); }
  50% { transform: translate(20vw, 20vh); }
  75% { transform: translate(50vw, 0vh); }
  100%   { transform: translate(0vw, 90vh); }
}
.circle2 {
  width: 50vh;
  height: 50vh;
  background: radial-gradient(#FFB4F5, #FCB5B8);
  animation: 12s ease-in-out circle2 infinite alternate;
}
@keyframes circle2 {
  0% { transform: translate(0vw, 10vh); }
  25% { transform: translate(48vw, 42vh); }
  50% { transform: translate(64vw, 50vh); }
  75% { transform: translate(30vw, 0vh); }
  100%   { transform: translate(0vw, 90vh); }
}
</style>