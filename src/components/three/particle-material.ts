import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

const noiseChunk = /* glsl */ `
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 1.0 / 7.0;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  float curlFx(vec3 p) { return snoise(p + vec3(0.0, 0.0, 0.0)); }
  float curlFy(vec3 p) { return snoise(p + vec3(31.416, -47.853, 12.793)); }
  float curlFz(vec3 p) { return snoise(p + vec3(-233.145, -113.408, -185.31)); }

  vec3 curlNoise(vec3 p) {
    const float e = 0.09;

    float fz_dy = (curlFz(p + vec3(0.0, e, 0.0)) - curlFz(p - vec3(0.0, e, 0.0))) / (2.0 * e);
    float fy_dz = (curlFy(p + vec3(0.0, 0.0, e)) - curlFy(p - vec3(0.0, 0.0, e))) / (2.0 * e);

    float fx_dz = (curlFx(p + vec3(0.0, 0.0, e)) - curlFx(p - vec3(0.0, 0.0, e))) / (2.0 * e);
    float fz_dx = (curlFz(p + vec3(e, 0.0, 0.0)) - curlFz(p - vec3(e, 0.0, 0.0))) / (2.0 * e);

    float fy_dx = (curlFy(p + vec3(e, 0.0, 0.0)) - curlFy(p - vec3(e, 0.0, 0.0))) / (2.0 * e);
    float fx_dy = (curlFx(p + vec3(0.0, e, 0.0)) - curlFx(p - vec3(0.0, e, 0.0))) / (2.0 * e);

    vec3 curl = vec3(fz_dy - fy_dz, fx_dz - fz_dx, fy_dx - fx_dy);
    return curl;
  }
`;

const vertexShader = /* glsl */ `
  ${noiseChunk}

  uniform float uTime;
  uniform float uFlowSpeed;
  uniform float uFlowScale;
  uniform float uDisplaceStrength;
  uniform vec3 uMouse3D;
  uniform float uMouseRadius;
  uniform float uMouseStrength;
  uniform float uPixelRatio;

  attribute float aSize;
  attribute float aTint;

  varying float vTint;
  varying float vAlpha;

  void main() {
    vec3 flowPos = position * uFlowScale + vec3(0.0, 0.0, uTime * uFlowSpeed);
    vec3 curl = curlNoise(flowPos);
    vec3 displaced = position + curl * uDisplaceStrength;

    vec3 toParticle = displaced - uMouse3D;
    float dist = length(toParticle);
    float falloff = 1.0 - smoothstep(0.0, uMouseRadius, dist);
    vec3 repulse = normalize(toParticle + 1e-4) * falloff * uMouseStrength;

    vec3 finalPosition = displaced + repulse;

    vec4 mvPosition = modelViewMatrix * vec4(finalPosition, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    gl_PointSize = aSize * uPixelRatio * (34.0 / -mvPosition.z);

    vTint = aTint;
    vAlpha = clamp(1.0 - (-mvPosition.z) / 26.0, 0.08, 0.55);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorBase;
  uniform vec3 uColorEmber;

  varying float vTint;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float circle = 1.0 - smoothstep(0.05, 0.5, d);
    if (circle <= 0.001) discard;

    float emberMix = smoothstep(0.97, 1.0, vTint);
    vec3 color = mix(uColorBase, uColorEmber, emberMix * 0.85);

    float alpha = circle * vAlpha * mix(0.5, 1.0, emberMix);
    gl_FragColor = vec4(color, alpha);
  }
`;

export const ParticleMaterial = shaderMaterial(
  {
    uTime: 0,
    uFlowSpeed: 0.06,
    uFlowScale: 0.18,
    uDisplaceStrength: 1.4,
    uMouse3D: new THREE.Vector3(9999, 9999, 0),
    uMouseRadius: 1.6,
    uMouseStrength: 0.9,
    uPixelRatio: 1,
    uColorBase: new THREE.Color("#9aa0ac"),
    uColorEmber: new THREE.Color("#ff4d1f"),
  },
  vertexShader,
  fragmentShader,
);
