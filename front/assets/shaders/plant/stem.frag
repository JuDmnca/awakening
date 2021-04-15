uniform sampler2D stemMap;
varying vec2 vUv;

void main() {
  vec4 stemTexture = texture2D( stemMap, vUv );
  gl_FragColor = stemTexture;
}
