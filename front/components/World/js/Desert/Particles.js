import * as THREE from 'three'
import particlesFragmentShader from '../../../../assets/shaders/particles/particles.frag'
import particlesVertexShader from '../../../../assets/shaders/particles/particles.vert'

let store
if (process.browser) {
  window.onNuxtReady(({$store}) => {
    store = $store
  })
}

class Particles {
    constructor(props) {
        this.props = props
        this.particlesGeometry = null
        this.particlesMaterial = null
        this.particles = null
    }

    init(renderer) {

        /*
        * Noise
        */
        // Return the dot product for 2d perlin noise
        function dot2(g, x, y) {
            return g[0]*x + g[1]*y;
        }

        function noise2D (x, y, z) {
            var perm = new Uint8Array(512);
            var p = new Uint8Array(256);

            var grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
                        [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
                        [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];

            // Find unit grid cell containing point
            var X = Math.floor(x) & 255;
            var Y = Math.floor(y) & 255;

            // Get relative xyz coordinates of point within that cell
            x -= Math.floor(x);
            y -= Math.floor(y);

            var fade = function(t) {
                return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
            };

            var lerp = function(a, b, t) {
                return (1.0-t)*a + t*b;
            }

            var u = fade(x),
                v = fade(y);

            // Calculate a set of four hashed gradient indices
            var n00 = perm[X   + perm[Y  ]] % 12;
            var n01 = perm[X   + perm[Y+1]] % 12;
            var n10 = perm[X+1 + perm[Y+1]] % 12;
            var n11 = perm[X+1 + perm[Y+1]] % 12;

            // Calculate noise contributions from each of the four corners
            var gi00 = dot2(grad3[n00], x,   y  );
            var gi01 = dot2(grad3[n01], x,   y-1);
            var gi10 = dot2(grad3[n10], x-1, y  );
            var gi11 = dot2(grad3[n11], x-1, y-1);

            // Interpolate the results along axises
            return lerp(
                lerp(gi00, gi10, u),
                lerp(gi01, gi11, u),
            v);
        }


        /*
        * Particles
        */
        // Geometry
        this.particlesGeometry = new THREE.BufferGeometry()

        let count = 100000
        let positions = new Float32Array(count * 3)
        const scales = new Float32Array(count)
        const colors = new Float32Array(count * 3)
        const randomSpeed = new Float32Array(count)
        const directionNoised = new Float32Array(count)
        let xOff = 0
        let yOff = 0
        for(let i = 0; i < count * 3; i++){

            const i3 = i * 3
            // Position
            positions[i3 + 0] = (Math.random() - 0.5) * 10 * Math.random() - 2
            positions[i3 + 1] = (Math.random() - 0.5) * 50 * Math.random() - 20
            positions[i3 + 2] = (Math.random() - 0.5) * 10 * Math.random()

            // Scale
            scales[i] = Math.random() + 0.2

            // Colors
            colors[i3 + 0] = 1.0
            colors[i3 + 1] = 1.0

            // Random Speed
            randomSpeed[i] = Math.pow(noise2D(xOff, yOff), 2)

            // Noise
            directionNoised[i] = noise2D(xOff, yOff) * 2

            xOff += 0.001
            yOff += 0.001
        }

        this.particlesGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positions, 3)
        )

        this.particlesGeometry.setAttribute(
            'randomSpeed',
            new THREE.BufferAttribute(randomSpeed, 1)
        ) 

        this.particlesGeometry.setAttribute('directionNoised', new THREE.BufferAttribute(directionNoised, 1))
        this.particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
        this.particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        // this.particlesGeometry.attributes.color = new THREE.Vector3(1.0, 1.0, 0.0)
        // Material
        this.particlesMaterial = new THREE.ShaderMaterial({
            depthWrite: true,
            transparent: true,
            alphaTest: 0.001,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
            vertexShader: particlesVertexShader,
            fragmentShader: particlesFragmentShader,
            uniforms: {
                uTime: {value: 0},
                uSize: {value: 25.0 * renderer.getPixelRatio()},
                uZSpeed: {value: 1.0}
            }
        })

        this.particlesMaterial.fragmentShader = particlesFragmentShader

        // Particles mesh
        this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial)

        return this.particles
    }

    render(elapsedTime) {
        this.particlesMaterial.uniforms.uTime.value = elapsedTime
    }
}

export default Particles