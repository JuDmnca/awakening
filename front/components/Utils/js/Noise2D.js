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

export default noise2D