"use client";

import { useEffect, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  OctahedronGeometry,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  TorusGeometry,
  TorusKnotGeometry,
  Vector3,
  WebGLRenderer,
} from "three";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";
import { gsap, REDUCED } from "@/lib/gsap";

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uDpr;
  attribute vec3 aTarget;
  attribute float aRand;
  varying float vAlpha;
  varying float vMix;

  void main() {
    float local = clamp(uProgress * 1.6 - aRand * 0.6, 0.0, 1.0);
    local = local * local * (3.0 - 2.0 * local);
    vec3 pos = mix(position, aTarget, local);
    pos += normalize(pos + vec3(0.0001)) * sin(uTime * 0.5 + aRand * 6.2831) * 0.025;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.4 + aRand * 1.6) * uDpr * (4.0 / -mv.z);
    vAlpha = 0.3 + aRand * 0.3;
    vMix = aRand;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vAlpha;
  varying float vMix;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = (1.0 - smoothstep(0.3, 0.5, d)) * vAlpha;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(mix(uColorA, uColorB, step(0.7, vMix)), alpha);
  }
`;

function readTokenColor(name: string) {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return new Color(raw || "#888888");
}

function samplePoints(source: BufferGeometry, count: number) {
  const mesh = new Mesh(source, new MeshBasicMaterial());
  const sampler = new MeshSurfaceSampler(mesh).build();
  const positions = new Float32Array(count * 3);
  const v = new Vector3();
  for (let i = 0; i < count; i++) {
    sampler.sample(v);
    positions[i * 3] = v.x;
    positions[i * 3 + 1] = v.y;
    positions[i * 3 + 2] = v.z;
  }
  mesh.material.dispose();
  source.dispose();
  return positions;
}

export default function MorphShape() {
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

    const scene = new Scene();
    const camera = new PerspectiveCamera(42, 1, 0.1, 50);
    camera.position.z = 3.3;

    const count = window.innerWidth < 768 ? 900 : 1800;
    const shapes = [
      samplePoints(new IcosahedronGeometry(1.15, 3), count),
      samplePoints(new TorusKnotGeometry(0.72, 0.24, 128, 24), count),
      samplePoints(new TorusGeometry(0.88, 0.32, 20, 80), count),
      samplePoints(new OctahedronGeometry(1.25, 0), count),
    ];
    const rands = new Float32Array(count);
    for (let i = 0; i < count; i++) rands[i] = Math.random();

    const geometry = new BufferGeometry();
    geometry.setAttribute(
      "position",
      new BufferAttribute(shapes[0].slice(), 3)
    );
    geometry.setAttribute("aTarget", new BufferAttribute(shapes[1].slice(), 3));
    geometry.setAttribute("aRand", new BufferAttribute(rands, 1));

    const material = new ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uDpr: { value: dpr },
        uColorA: { value: readTokenColor("--color-accent") },
        uColorB: { value: readTokenColor("--color-primary") },
      },
    });

    const points = new Points(geometry, material);
    points.rotation.x = 0.35;
    scene.add(points);

    let shapeIndex = 1;
    let morphTween: gsap.core.Tween | null = null;
    let delayed: gsap.core.Tween | null = null;

    const doMorph = () => {
      morphTween = gsap.to(material.uniforms.uProgress, {
        value: 1,
        duration: 2.4,
        ease: "power2.inOut",
        onComplete: () => {
          const pos = geometry.getAttribute("position") as BufferAttribute;
          const tgt = geometry.getAttribute("aTarget") as BufferAttribute;
          (pos.array as Float32Array).set(tgt.array as Float32Array);
          pos.needsUpdate = true;
          shapeIndex = (shapeIndex + 1) % shapes.length;
          (tgt.array as Float32Array).set(shapes[shapeIndex]);
          tgt.needsUpdate = true;
          material.uniforms.uProgress.value = 0;
          schedule();
        },
      });
    };
    const schedule = () => {
      delayed = gsap.delayedCall(5, doMorph);
    };
    schedule();

    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    wrap.appendChild(renderer.domElement);
    gsap.to(wrap, { opacity: 1, duration: 1.2 });

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(wrap);

    const retintOnThemeChange = new MutationObserver(() => {
      const a = readTokenColor("--color-accent");
      const b = readTokenColor("--color-primary");
      gsap.to(material.uniforms.uColorA.value, {
        r: a.r,
        g: a.g,
        b: a.b,
        duration: 0.7,
      });
      gsap.to(material.uniforms.uColorB.value, {
        r: b.r,
        g: b.g,
        b: b.b,
        duration: 0.7,
      });
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
      material.uniforms.uTime.value = time;
      points.rotation.y = time * 0.12;
      points.rotation.x = 0.35 + Math.sin(time * 0.07) * 0.12;
      renderer.render(scene, camera);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      morphTween?.kill();
      delayed?.kill();
      io.disconnect();
      retintOnThemeChange.disconnect();
      window.removeEventListener("resize", resize);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={wrapRef} className="w-full h-full opacity-0" />;
}
