precision mediump float;

uniform vec3 blue;
uniform vec3 darkBlue;
uniform vec3 orange;
uniform vec3 violet;

varying vec2 vUv;

void main()
{
    vec3 color = mix(darkBlue, blue, vUv.x + 0.2) + vec3(0.6, 0.0, 0.0) * vUv.x + 0.1;
    gl_FragColor = vec4(color, 1.0);
}