uniform sampler2D uBakedShirtsTexture;

varying vec2 vUv;

// #pragma glslify: blend = require(glsl-blend/add)
#pragma glslify: blend = require(glsl-blend/lighten)
// #pragma glslify: blend = require(glsl-blend/normal)
// #pragma glslify: blend = require(glsl-blend/screen)

void main()
{
    vec3 bakedDayColor = texture2D(uBakedShirtsTexture, vUv).rgb;
    gl_FragColor = vec4(bakedDayColor, 1.0);
}