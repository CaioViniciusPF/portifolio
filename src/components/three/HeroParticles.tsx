"use client";

import { useEffect, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  OrthographicCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";
import { gsap, REDUCED } from "@/lib/gsap";

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uRadius;
  uniform float uDpr;
  attribute float aRand;
  varying float vAlpha;
  varying float vMix;

  void main() {
    vec3 pos = position;

    pos.xy += vec2(
      sin(uTime * 0.35 + position.y * 0.011 + aRand * 6.2831),
      cos(uTime * 0.28 + position.x * 0.013 + aRand * 6.2831)
    ) * 14.0;

    vec2 dir = pos.xy - uMouse;
    float dist = length(dir);
    float force = 1.0 - smoothstep(0.0, uRadius, dist);
    pos.xy += (dist > 0.001 ? normalize(dir) : vec2(0.0)) * force * 42.0;

    vAlpha = 0.35 + aRand * 0.25 + force * 0.45;
    vMix = aRand;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (2.0 + aRand * 2.0 + force * 2.5) * uDpr;
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

export default function HeroParticles() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia(REDUCED).matches) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

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
    const camera = new OrthographicCamera(0, 0, 0, 0, -100, 100);
    camera.position.z = 10;

    const material = new ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: { x: 99999, y: 99999 } },
        uRadius: { value: 130 },
        uDpr: { value: dpr },
        uColorA: { value: readTokenColor("--color-accent") },
        uColorB: { value: readTokenColor("--color-primary") },
      },
    });

    let geometry: BufferGeometry | null = null;
    let points: Points | null = null;

    const buildGrid = (w: number, h: number) => {
      if (points) {
        scene.remove(points);
        geometry?.dispose();
      }
      const target = window.innerWidth < 768 ? 1200 : 3000;
      const spacing = Math.sqrt((w * h) / target);
      const cols = Math.ceil(w / spacing);
      const rows = Math.ceil(h / spacing);
      const count = cols * rows;
      const positions = new Float32Array(count * 3);
      const rands = new Float32Array(count);

      let i = 0;
      for (let cx = 0; cx < cols; cx++) {
        for (let cy = 0; cy < rows; cy++) {
          const jx = (Math.random() - 0.5) * spacing * 0.6;
          const jy = (Math.random() - 0.5) * spacing * 0.6;
          positions[i * 3] = cx * spacing - w / 2 + jx;
          positions[i * 3 + 1] = cy * spacing - h / 2 + jy;
          positions[i * 3 + 2] = 0;
          rands[i] = Math.random();
          i++;
        }
      }

      geometry = new BufferGeometry();
      geometry.setAttribute("position", new BufferAttribute(positions, 3));
      geometry.setAttribute("aRand", new BufferAttribute(rands, 1));
      points = new Points(geometry, material);
      scene.add(points);
    };

    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.left = -w / 2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = -h / 2;
      camera.updateProjectionMatrix();
      buildGrid(w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    wrap.appendChild(renderer.domElement);
    gsap.to(wrap, { opacity: 1, duration: 1 });

    const mouseTarget = { x: 99999, y: 99999 };
    const canHover = window.matchMedia("(hover: hover)").matches;
    const onPointerMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      mouseTarget.x = e.clientX - rect.left - rect.width / 2;
      mouseTarget.y = -(e.clientY - rect.top - rect.height / 2);
    };
    const onPointerLeave = () => {
      mouseTarget.x = 99999;
      mouseTarget.y = 99999;
    };
    if (canHover) {
      window.addEventListener("pointermove", onPointerMove);
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
    }

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
      const m = material.uniforms.uMouse.value;
      m.x += (mouseTarget.x - m.x) * 0.08;
      m.y += (mouseTarget.y - m.y) * 0.08;
      renderer.render(scene, camera);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      retintOnThemeChange.disconnect();
      window.removeEventListener("resize", resize);
      if (canHover) {
        window.removeEventListener("pointermove", onPointerMove);
        document.documentElement.removeEventListener(
          "pointerleave",
          onPointerLeave
        );
      }
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      geometry?.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={wrapRef} className="absolute inset-0 opacity-0" />;
}
