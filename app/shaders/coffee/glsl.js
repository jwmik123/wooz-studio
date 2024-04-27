export const fragment = `
uniform float uTime;
uniform sampler2D uPerlinTexture;

varying vec2 vUv;

void main(){

    vec2 smokeUv = vUv;
    smokeUv.x *= 0.5;
    smokeUv.y *= 0.3;
    smokeUv.y -= uTime * 0.02;

    // Smoke
    float smoke = texture(uPerlinTexture, smokeUv).r;

    // Remap
    smoke = smoothstep(0.4, 1., smoke);

    // Edges
    smoke *= smoothstep(0., .1, vUv.x);
    smoke *= smoothstep(1., .9, vUv.x);
    smoke *= smoothstep(0., .1, vUv.y);
    smoke *= smoothstep(1., .4, vUv.y);

    gl_FragColor = vec4(.7,.4,.2,smoke);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
`;

export const vertex = `
uniform float uTime;
uniform sampler2D uPerlinTexture;
uniform vec2 uMouse;

varying vec2 vUv;

// Rotating on 2D plane
vec2 rotate2D(vec2 value, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    mat2 m = mat2(c, s, -s, c);
    return m * value;
}

void main() {

    vec3 newPosition = position;

    // Rotation
    float perlinTwist = texture(
        uPerlinTexture,
        vec2(.5, uv.y * .2 - uTime * .005)
    ).r;
    float angle = perlinTwist * 10.;
    newPosition.xz = rotate2D(newPosition.xz, angle);

    // wind
    vec2 windOffset = vec2(
        texture(uPerlinTexture, vec2(.25, uTime * 0.01)).r -.5,
        texture(uPerlinTexture, vec2(.75, uTime * 0.01)).r -.5
    );

    windOffset *= pow(uv.y, 1.) * 2.;
    newPosition.xz += windOffset;


    // Final Position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    // Varyings
    vUv = uv;
}
`;
