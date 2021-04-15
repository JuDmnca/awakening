uniform float uSize;
uniform float uTime;
uniform float uZSpeed;

attribute float aScale;
attribute vec3 acceleration;
attribute vec3 velocity;
attribute float randomSpeed;
attribute float noise;

varying vec3 vColor;

float randForNoise(float n){return fract(sin(n) * 43758.5453123);}

float noise1D(float p){
	float fl = floor(p);
    float fc = fract(p);
	return mix(randForNoise(fl), randForNoise(fl + 1.0), fc);
}


float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}   

void main() {
    /*
    * Position
    */
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float distanceToCenter = length(modelPosition.xz);
    // float yOffset = (1.0 / distanceToCenter) * uTime * 0.2;
    // float angle = rand(vec2(gl_VertexID, gl_VertexID)) + 0.5;
    // float speed = rand(vec2(gl_VertexID * 2, gl_VertexID * 2));
    // modelPosition.x = cos(angle) * uTime * speed;
    float deplacement = distanceToCenter * uTime;
    modelPosition.x += noise1D(deplacement * 0.1);
    modelPosition.z += randomSpeed * uTime * noise;
    // modelPosition.y = pow(randomSpeed * uTime * noise * 10.0, 2.0) * uZSpeed + 10.0;
    modelPosition.y += randomSpeed * uTime + uZSpeed;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;


    /*
    * Size
    */
    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / -viewPosition.z);
    vColor = color;
    
    // acceleration.add(vec3(0.0, 0.5, 0.0));
    // velocity.add(acceleration);

    // modelPosition.add(velocity);
}