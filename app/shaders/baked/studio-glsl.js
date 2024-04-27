export const fragment = `
    uniform sampler2D uBakedDayTexture;
    varying vec2 vUv;
    // #pragma glslify: blend = require(glsl-blend/add)
    #pragma glslify: blend = require(glsl-blend/lighten)
    // #pragma glslify: blend = require(glsl-blend/normal)
    // #pragma glslify: blend = require(glsl-blend/screen)

    void main()
    {
        vec3 bakedDayColor = texture2D(uBakedDayTexture, vUv).rgb;
        gl_FragColor = vec4(bakedDayColor, 1.0);
    }
    `;

export const vertex = `
    varying vec2 vUv;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;

    vUv = uv;
}
    `;
