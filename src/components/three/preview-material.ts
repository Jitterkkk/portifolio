import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uVelocity;

  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float wave = sin(uv.x * 6.2831853 + uTime) * uVelocity.y
      + sin(uv.y * 6.2831853 + uTime) * uVelocity.x;

    pos.z += wave * 0.45;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uColorDark;
  uniform vec2 uVelocity;

  varying vec2 vUv;

  vec3 gradientAt(vec2 uv) {
    float d = distance(uv, vec2(0.5));
    float t = smoothstep(0.0, 0.75, d);
    return mix(uColor, uColorDark, t);
  }

  void main() {
    vec2 shift = uVelocity * 0.04;

    float r = gradientAt(vUv + shift).r;
    float g = gradientAt(vUv).g;
    float b = gradientAt(vUv - shift).b;

    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

export const PreviewMaterial = shaderMaterial(
  {
    uTime: 0,
    uVelocity: new THREE.Vector2(0, 0),
    uColor: new THREE.Color("#9aa0ac"),
    uColorDark: new THREE.Color("#131316"),
  },
  vertexShader,
  fragmentShader,
);
