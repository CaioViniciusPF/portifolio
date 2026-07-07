"use client";

import { useEffect, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  Mesh,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import { gsap, REDUCED } from "@/lib/gsap";

const FLOW_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FLOW_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform sampler2D uPrev;
  uniform vec2 uMouse;
  uniform vec2 uVel;
  uniform float uAspect;
  varying vec2 vUv;

  void main() {
    vec2 vel = (texture2D(uPrev, vUv).rg - 0.5) * 2.0;
    vel = (texture2D(uPrev, vUv - vel * 0.006).rg - 0.5) * 2.0;
    vel *= 0.958;
    vec2 d = vUv - uMouse;
    d.x *= uAspect;
    float influence = exp(-dot(d, d) / 0.004);
    vel += uVel * influence;
    vel = clamp(vel, vec2(-1.0), vec2(1.0));
    gl_FragColor = vec4(vel * 0.5 + 0.5, 0.0, 1.0);
  }
`;

const FLUID_CHUNK = /* glsl */ `
  uniform sampler2D uFlow;
  uniform float uFluid;

  vec4 applyFluid(vec4 clip) {
    vec2 screenUv = clip.xy / clip.w * 0.5 + 0.5;
    vec2 flow = (texture2D(uFlow, screenUv).rg - 0.5) * 2.0;
    clip.xy += flow * uFluid * clip.w;
    return clip;
  }
`;

const PLANET_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uDpr;
  uniform vec3 uLightDir;
  attribute float aRand;
  varying float vAlpha;
  varying float vMix;
  varying float vLight;
  ${FLUID_CHUNK}

  void main() {
    vec3 n = normalize(position);
    vec3 worldN = normalize(mat3(modelMatrix) * n);
    float diff = dot(worldN, uLightDir);
    float light = smoothstep(-0.18, 0.42, diff);

    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec3 viewN = normalize(normalMatrix * n);
    float rim = pow(1.0 - abs(viewN.z), 2.5);

    vLight = light;
    vMix = aRand;
    vAlpha = mix(0.06, 0.55 + aRand * 0.3, light) + rim * 0.25;

    vec4 clip = projectionMatrix * mv;
    gl_Position = applyFluid(clip);
    gl_PointSize = (1.2 + aRand * 1.4 + light * 0.6) * uDpr * (14.0 / -mv.z);
  }
`;

const RING_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uDpr;
  uniform vec3 uLightDir;
  attribute float aRand;
  attribute float aBand;
  varying float vAlpha;
  varying float vMix;
  varying float vLight;
  ${FLUID_CHUNK}

  void main() {
    vec3 worldUp = normalize(mat3(modelMatrix) * vec3(0.0, 1.0, 0.0));
    float facing = abs(dot(worldUp, uLightDir));
    float light = 0.35 + 0.65 * facing;

    vLight = light;
    vMix = aRand;
    vAlpha = aBand * (0.32 + aRand * 0.3);

    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec4 clip = projectionMatrix * mv;
    gl_Position = applyFluid(clip);
    gl_PointSize = (0.9 + aRand * 1.1) * uDpr * (14.0 / -mv.z);
  }
`;

const STAR_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uDpr;
  attribute float aRand;
  varying float vAlpha;
  varying float vMix;
  varying float vLight;
  ${FLUID_CHUNK}

  void main() {
    float twinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aRand * 1.4) + aRand * 6.2831);
    vLight = 5.0;
    vMix = aRand;
    vAlpha = (0.5 + aRand * 0.3) * twinkle;

    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec4 clip = projectionMatrix * mv;
    gl_Position = applyFluid(clip);
    gl_PointSize = (0.9 + aRand * 1.3) * uDpr;
  }
`;

const POINT_FRAGMENT = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vAlpha;
  varying float vMix;
  varying float vLight;

  void main() {
    float d = length(gl_PointCoord - 0.35);
    float alpha = (1.0 - smoothstep(0.3, 0.5, d)) * vAlpha;
    if (alpha < 0.01) discard;
    vec3 base = mix(uColorB, uColorA, step(0.72, vMix));
    gl_FragColor = vec4(base * (0.45 + 0.55 * vLight), alpha);
  }
`;

const NEBULA_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`;

const NEBULA_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform sampler2D uFlow;
  uniform float uNebulaAspect;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec2(1.7);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 flow = (texture2D(uFlow, vUv).rg - 0.5) * 2.0;
    vec2 uv = vec2(vUv.x * uNebulaAspect, vUv.y);
    vec2 p = uv * 2.1 + vec2(uTime * 0.016, -uTime * 0.009);
    p += flow * 0.6;
    float n = fbm(p);
    float n2 = fbm(p * 1.9 - vec2(uTime * 0.011, uTime * 0.014) + n);
    float gas = smoothstep(0.45, 0.95, n * 0.6 + n2 * 0.55);
    vec3 col = mix(uColorB, uColorA, smoothstep(0.35, 0.95, n2) * 0.45);
    float alpha = gas * 0.11 + length(flow) * 0.07;
    gl_FragColor = vec4(col, alpha);
  }
`;

const GLOW_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.5);
  }
`;

const GLOW_FRAGMENT = /* glsl */ `
  uniform vec3 uColorA;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float alpha = smoothstep(1.0, 0.0, d) * 0.16;
    gl_FragColor = vec4(uColorA, alpha * alpha * 4.0);
  }
`;

function readTokenColor(name: string) {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return new Color(raw || "#888888");
}

function fibonacciSphere(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const jitter = 1 + (Math.random() - 0.5) * 0.015;
    positions[i * 3] = Math.cos(theta) * r * radius * jitter;
    positions[i * 3 + 1] = y * radius * jitter;
    positions[i * 3 + 2] = Math.sin(theta) * r * radius * jitter;
  }
  return positions;
}

function ringDisk(count: number, inner: number, outer: number) {
  const positions = new Float32Array(count * 3);
  const bands = new Float32Array(count);
  const gapStart = inner + (outer - inner) * 0.52;
  const gapEnd = inner + (outer - inner) * 0.62;
  let i = 0;
  while (i < count) {
    const r = inner + Math.sqrt(Math.random()) * (outer - inner);
    if (r > gapStart && r < gapEnd && Math.random() > 0.12) continue;
    const theta = Math.random() * Math.PI * 2;
    positions[i * 3] = Math.cos(theta) * r;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.012;
    positions[i * 3 + 2] = Math.sin(theta) * r;
    const t = (r - inner) / (outer - inner);
    bands[i] = 0.45 + 0.55 * Math.abs(Math.sin(t * 14.0 + Math.sin(t * 5.0)));
    i++;
  }
  return { positions, bands };
}

function randAttr(count: number) {
  const rands = new Float32Array(count);
  for (let i = 0; i < count; i++) rands[i] = Math.random();
  return rands;
}

export default function HeroSpace() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia(REDUCED).matches) return;
    const wrap = wrapRef.current;
    if (!wrap || !wrap.clientWidth || !wrap.clientHeight) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.autoClear = true;

    const isMobile = window.innerWidth < 768;
    const canHover = window.matchMedia("(hover: hover)").matches;

    const scene = new Scene();
    const camera = new PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 10;

    const colorA = readTokenColor("--color-accent");
    const colorB = readTokenColor("--color-primary");

    const flowSize = 256;
    const flowOpts = { depthBuffer: false, stencilBuffer: false };
    let flowA = new WebGLRenderTarget(flowSize, flowSize, flowOpts);
    let flowB = new WebGLRenderTarget(flowSize, flowSize, flowOpts);
    const flowScene = new Scene();
    const flowCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const flowMaterial = new ShaderMaterial({
      vertexShader: FLOW_VERTEX,
      fragmentShader: FLOW_FRAGMENT,
      uniforms: {
        uPrev: { value: flowA.texture },
        uMouse: { value: new Vector2(-10, -10) },
        uVel: { value: new Vector2(0, 0) },
        uAspect: { value: 1 },
      },
    });
    flowScene.add(new Mesh(new PlaneGeometry(2, 2), flowMaterial));

    renderer.setClearColor(0x808080, 1);
    renderer.setRenderTarget(flowA);
    renderer.clear();
    renderer.setRenderTarget(flowB);
    renderer.clear();
    renderer.setRenderTarget(null);
    renderer.setClearColor(0x000000, 0);

    const sharedUniforms = {
      uTime: { value: 0 },
      uDpr: { value: dpr },
      uLightDir: { value: { x: -0.15, y: 0.90, z: 0.5} },
      uColorA: { value: colorA },
      uColorB: { value: colorB },
      uFlow: { value: flowB.texture },
      uFluid: { value: canHover ? 0.02 : 0 },
      uNebulaAspect: { value: 1 },
    };

    const makePointsMaterial = (vertexShader: string) =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader: POINT_FRAGMENT,
        transparent: true,
        depthWrite: false,
        uniforms: sharedUniforms,
      });

    const nebulaGeo = new PlaneGeometry(2, 2);
    const nebulaMaterial = new ShaderMaterial({
      vertexShader: NEBULA_VERTEX,
      fragmentShader: NEBULA_FRAGMENT,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      uniforms: sharedUniforms,
    });
    const nebula = new Mesh(nebulaGeo, nebulaMaterial);
    nebula.renderOrder = -1;
    nebula.frustumCulled = false;
    scene.add(nebula);

    const planetGroup = new Group();
    planetGroup.rotation.z = -0.24;
    planetGroup.rotation.x = 0.38;
    scene.add(planetGroup);

    const R = 1;
    const planetCount = isMobile ? 1800 : 4200;
    const planetGeo = new BufferGeometry();
    planetGeo.setAttribute(
      "position",
      new BufferAttribute(fibonacciSphere(planetCount, R), 3)
    );
    planetGeo.setAttribute("aRand", new BufferAttribute(randAttr(planetCount), 1));
    const planet = new Points(planetGeo, makePointsMaterial(PLANET_VERTEX));
    planetGroup.add(planet);

    const ringCount = isMobile ? 1300 : 2800;
    const ring = ringDisk(ringCount, R * 1.5, R * 2.35);
    const ringGeo = new BufferGeometry();
    ringGeo.setAttribute("position", new BufferAttribute(ring.positions, 3));
    ringGeo.setAttribute("aRand", new BufferAttribute(randAttr(ringCount), 1));
    ringGeo.setAttribute("aBand", new BufferAttribute(ring.bands, 1));
    const ringPoints = new Points(ringGeo, makePointsMaterial(RING_VERTEX));
    planetGroup.add(ringPoints);

    const glowGeo = new PlaneGeometry(R * 5.2, R * 5.2);
    const glowMaterial = new ShaderMaterial({
      vertexShader: GLOW_VERTEX,
      fragmentShader: GLOW_FRAGMENT,
      transparent: true,
      depthWrite: false,
      uniforms: { uColorA: { value: colorA } },
    });
    const glow = new Mesh(glowGeo, glowMaterial);
    glow.position.z = -R * 2.6;
    planetGroup.add(glow);

    const starCount = isMobile ? 320 : 700;
    const starGeo = new BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 30;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      starPositions[i * 3 + 2] = -6 - Math.random() * 10;
    }
    starGeo.setAttribute("position", new BufferAttribute(starPositions, 3));
    starGeo.setAttribute("aRand", new BufferAttribute(randAttr(starCount), 1));
    const stars = new Points(starGeo, makePointsMaterial(STAR_VERTEX));
    scene.add(stars);

    const layout = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      flowMaterial.uniforms.uAspect.value = w / h;
      sharedUniforms.uNebulaAspect.value = w / h;

      const halfFovTan = Math.tan((camera.fov * Math.PI) / 360);
      const worldH = 2 * halfFovTan * camera.position.z;
      const worldW = worldH * camera.aspect;

      const mobile = window.innerWidth < 768;
      const targetDiameter = mobile ? worldW * 1.35 : worldH * 1.2;
      const s = targetDiameter / (R * 2 * 2.35);
      planetGroup.scale.setScalar(s);
      planetGroup.position.x = mobile ? worldW * 0.18 : worldW * 0.28;
      planetGroup.position.y = mobile ? worldH * 0.24 : -worldH * 0.04;
    };
    layout();
    window.addEventListener("resize", layout);

    wrap.appendChild(renderer.domElement);
    gsap.to(wrap, { opacity: 1, duration: 1.4 });

    const mouseUv = new Vector2(-10, -10);
    const mouseVel = new Vector2(0, 0);
    const lastMouse = new Vector2(-10, -10);
    const onPointerMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      if (lastMouse.x > -5) {
        mouseVel.x += (x - lastMouse.x) * 18;
        mouseVel.y += (y - lastMouse.y) * 18;
        mouseVel.clampScalar(-0.8, 0.8);
      }
      lastMouse.set(x, y);
      mouseUv.set(x, y);
    };
    if (canHover) window.addEventListener("pointermove", onPointerMove);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(wrap);

    const retintOnThemeChange = new MutationObserver(() => {
      const a = readTokenColor("--color-accent");
      const b = readTokenColor("--color-primary");
      gsap.to(sharedUniforms.uColorA.value, { r: a.r, g: a.g, b: a.b, duration: 0.7 });
      gsap.to(sharedUniforms.uColorB.value, { r: b.r, g: b.g, b: b.b, duration: 0.7 });
    });
    retintOnThemeChange.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const onContextLost = (e: Event) => {
      e.preventDefault();
      renderer.domElement.style.display = "none";
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);

    const tick = (time: number) => {
      if (!visible || document.hidden) return;

      if (canHover) {
        flowMaterial.uniforms.uPrev.value = flowA.texture;
        flowMaterial.uniforms.uMouse.value.copy(mouseUv);
        flowMaterial.uniforms.uVel.value.copy(mouseVel);
        renderer.setRenderTarget(flowB);
        renderer.render(flowScene, flowCamera);
        renderer.setRenderTarget(null);
        const swap = flowA;
        flowA = flowB;
        flowB = swap;
        sharedUniforms.uFlow.value = flowA.texture;
        mouseVel.multiplyScalar(0.82);
      }

      sharedUniforms.uTime.value = time;
      planet.rotation.y = time * 0.05;
      ringPoints.rotation.y = time * 0.022;
      renderer.render(scene, camera);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      retintOnThemeChange.disconnect();
      window.removeEventListener("resize", layout);
      if (canHover) window.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      nebulaGeo.dispose();
      nebulaMaterial.dispose();
      planetGeo.dispose();
      ringGeo.dispose();
      starGeo.dispose();
      glowGeo.dispose();
      planet.material.dispose();
      ringPoints.material.dispose();
      stars.material.dispose();
      glowMaterial.dispose();
      flowMaterial.dispose();
      flowA.dispose();
      flowB.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={wrapRef} className="w-full h-full opacity-0" />;
}
