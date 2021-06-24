varying vec3 vColor;
varying float vDistanceToCenter;

void main() {
    float circle = distance(gl_PointCoord, vec2(0.5));

    // For spores
    circle *= 2.0;
    circle = 1.0 - circle;

    /*
        // For firflies
        circle = 1.0 - circle;
        circle = pow(circle, 10.0);
    */

    // Final color
    vec3 color = mix(vec3(0.0), vColor, circle);


    gl_FragColor = vec4(color, 1.0);
}