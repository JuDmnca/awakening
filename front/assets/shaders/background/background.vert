precision highp float;

varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position.xyz, 1.);
}