import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/*
  Hero scene
  ─ a liquid "core": noise-displaced sphere with fresnel rim, specular and iridescence
  ─ two tilted particle orbits + floating dust for parallax depth
  ─ a point-cloud terrain as the ground plane
  Cursor: core turns toward it and bulges where you point; click sends a pulse.
  Scroll: camera dollies and the core drifts up and away.
  Colours come from the CSS tokens so light/dark mode both work.
*/

// Ashima 3D simplex noise (MIT)
const NOISE = /* glsl */ `
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.0-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
`;

/* ─────────── core ─────────── */
const coreVertex = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;
  uniform float uHover;
  uniform float uPulse;
  uniform vec3  uMouseDir;
  varying vec3  vNormal;
  varying vec3  vViewDir;
  varying float vNoise;
  ${NOISE}

  float disp(vec3 p) {
    float n  = snoise(p * 0.78 + vec3(uTime * 0.12, uTime * 0.08, 0.0));
    float n2 = snoise(p * 1.9 - vec3(0.0, uTime * 0.18, uTime * 0.13));
    float bulge = pow(max(dot(p, uMouseDir), 0.0), 6.0) * uHover * 0.32;
    float pulse = sin(dot(p, uMouseDir) * 7.0 - uTime * 10.0) * uPulse * 0.06;
    return (n * 0.13 + n2 * 0.03) * (1.0 + uPulse * 1.2) + bulge + pulse;
  }
  vec3 displaced(vec3 p) { return p * (1.0 + disp(p) * uIntro); }

  void main() {
    vec3 p = normalize(position);
    vec3 t = normalize(cross(p, abs(p.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
    vec3 b = normalize(cross(p, t));
    float e = 0.012;
    vec3 P  = displaced(p);
    vec3 P1 = displaced(normalize(p + t * e));
    vec3 P2 = displaced(normalize(p + b * e));
    vec3 n = normalize(cross(P1 - P, P2 - P));
    if (dot(n, p) < 0.0) n = -n;

    vNoise = disp(p);
    vec4 world = modelMatrix * vec4(P, 1.0);
    vNormal = normalize(mat3(modelMatrix) * n);
    vViewDir = normalize(cameraPosition - world.xyz);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const coreFragment = /* glsl */ `
  uniform vec3 uDeep;
  uniform vec3 uAccent;
  uniform vec3 uLight;
  uniform float uIntro;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying float vNoise;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewDir);
    vec3 L = normalize(vec3(-0.55, 0.85, 0.65));
    vec3 L2 = normalize(vec3(0.8, -0.3, 0.4));

    float diff = max(dot(N, L), 0.0);
    float back = max(dot(N, L2), 0.0) * 0.35;
    float fres = pow(1.0 - max(dot(N, V), 0.0), 2.4);
    vec3  H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), 140.0);
    float sheen = pow(max(dot(N, H), 0.0), 12.0) * 0.18;

    // body: deep obsidian, vermilion pooling in the valleys
    float valley = smoothstep(0.05, -0.2, vNoise);
    vec3 base = mix(uDeep, uAccent, valley * 0.55);

    // fake studio environment: bright sky, dark floor, one soft-box
    vec3 R = reflect(-V, N);
    float sky = smoothstep(-0.15, 0.6, R.y);
    vec3 env = mix(uDeep * 0.5, uLight, sky);
    float softbox = smoothstep(0.94, 0.995, dot(R, normalize(vec3(-0.45, 0.75, 0.5))));
    float strip = smoothstep(0.965, 0.998, dot(R, normalize(vec3(0.9, 0.15, 0.4))));

    // thin-film iridescence on the rim
    vec3 irid = 0.5 + 0.5 * cos(6.28318 * (fres * 0.85 + vNoise * 0.8 + vec3(0.0, 0.33, 0.67)));

    vec3 col = base * (0.2 + 0.5 * diff);
    col = mix(col, env, 0.06 + 0.3 * fres);
    col += uAccent * back * 0.8;
    col += uAccent * pow(fres, 2.2) * 0.85;                       // vermilion rim light
    col += mix(uAccent, irid, 0.6) * pow(fres, 1.3) * 0.45;      // iridescent film
    col += uLight * (softbox * 0.55 + strip * 0.4 + spec * 0.7 + sheen * 0.35);

    gl_FragColor = vec4(col, uIntro);
  }
`;

/* ─────────── points (orbits, dust, terrain share one fragment) ─────────── */
const pointsFragment = /* glsl */ `
  uniform vec3 uInk;
  uniform vec3 uAccent;
  uniform float uOpacity;
  varying float vHot;
  varying float vFade;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float soft = smoothstep(0.5, 0.1, r);
    gl_FragColor = vec4(mix(uInk, uAccent, vHot), soft * vFade * uOpacity);
  }
`;

const orbitVertex = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;
  uniform float uPixelRatio;
  uniform float uSize;
  attribute float aSeed;
  varying float vHot;
  varying float vFade;
  void main() {
    vec3 p = position;
    // each particle drifts a little off its orbit
    p.y += sin(uTime * 0.8 + aSeed * 40.0) * 0.04;
    p *= mix(0.4, 1.0, uIntro);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float tw = 0.65 + 0.35 * sin(uTime * 2.0 + aSeed * 90.0);
    gl_PointSize = uSize * uPixelRatio * tw * (10.0 / -mv.z);
    vHot = step(0.86, aSeed);
    vFade = uIntro * smoothstep(-22.0, -6.0, mv.z);
  }
`;

const terrainVertex = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;
  uniform vec2  uMouse;
  uniform float uMouseStrength;
  uniform float uPixelRatio;
  uniform float uSize;
  varying float vHot;
  varying float vFade;
  void main() {
    vec3 p = position;
    float h = sin(p.x * 0.28 + uTime * 0.55) * 0.55
            + sin(p.z * 0.42 + uTime * 0.38) * 0.45
            + sin((p.x + p.z) * 0.16 + uTime * 0.25) * 0.9;
    float d = distance(p.xz, uMouse);
    float ripple = exp(-d * d * 0.022) * uMouseStrength;
    h += ripple * (1.1 + 0.3 * sin(d * 0.9 - uTime * 3.0));
    float rowDelay = clamp((p.z + 18.0) / 30.0, 0.0, 1.0) * 0.5;
    float intro = smoothstep(rowDelay, rowDelay + 0.5, uIntro);
    p.y = h * intro;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (14.0 / -mv.z);
    vHot = smoothstep(0.9, 2.2, h + ripple);
    float depthFade = smoothstep(-34.0, -6.0, mv.z) * (1.0 - smoothstep(-13.0, -6.0, mv.z));
    vFade = depthFade * (1.0 - smoothstep(22.0, 32.0, abs(p.x))) * intro * (0.45 + 0.55 * vHot);
  }
`;

function readColor(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  try {
    return new THREE.Color(v || fallback);
  } catch (e) {
    return new THREE.Color(fallback);
  }
}

const easeOutBack = (t) => {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const clamp01 = (v) => Math.min(1, Math.max(0, v));

function ring(count, radius, spread, thickness) {
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    // bias towards the centre line of the band
    const r = radius + (Math.random() + Math.random() - 1) * spread;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = (Math.random() - 0.5) * thickness;
    pos[i * 3 + 2] = Math.sin(a) * r;
    seed[i] = Math.random();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  return g;
}

function dust(count, w, h, d) {
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * w;
    pos[i * 3 + 1] = (Math.random() - 0.5) * h;
    pos[i * 3 + 2] = (Math.random() - 0.5) * d;
    seed[i] = Math.random() * 0.8; // never "hot"
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  return g;
}

export default function HeroScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const small = window.innerWidth < 760;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch (e) {
      return undefined; // no WebGL — the hero still works without the scene
    }
    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    const camBase = new THREE.Vector3(0, 5.2, 13);
    const lookAt = new THREE.Vector3(0, 0.4, -4);

    const isDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
    const colors = {
      uInk: { value: readColor("--ink", "#16130f") },
      uAccent: { value: readColor("--accent", "#e8461e") },
    };
    const shared = {
      uTime: { value: 0 },
      uIntro: { value: reduceMotion ? 1 : 0 },
      uPixelRatio: { value: dpr },
    };

    /* core */
    const coreUniforms = {
      ...shared,
      uAccent: colors.uAccent,
      uDeep: { value: new THREE.Color(isDark() ? "#2a1712" : "#1c1411") },
      uLight: { value: new THREE.Color("#fff4e8") },
      uHover: { value: 0 },
      uPulse: { value: 0 },
      uMouseDir: { value: new THREE.Vector3(0, 0, 1) },
    };
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1, small ? 48 : 96),
      new THREE.ShaderMaterial({
        vertexShader: coreVertex,
        fragmentShader: coreFragment,
        uniforms: coreUniforms,
        transparent: true,
      })
    );

    /* orbits */
    const orbitMat = (size, opacity) =>
      new THREE.ShaderMaterial({
        vertexShader: orbitVertex,
        fragmentShader: pointsFragment,
        uniforms: { ...shared, ...colors, uSize: { value: size }, uOpacity: { value: opacity } },
        transparent: true,
        depthWrite: false,
      });
    const orbitA = new THREE.Points(ring(small ? 900 : 1800, 1.75, 0.2, 0.06), orbitMat(2.6, 0.85));
    orbitA.rotation.set(1.15, 0, 0.35);
    const orbitB = new THREE.Points(ring(small ? 500 : 1000, 2.3, 0.08, 0.03), orbitMat(2.0, 0.6));
    orbitB.rotation.set(-0.9, 0, -0.55);

    // the "rig" positions the whole object on screen; "spin" carries cursor rotation
    const rig = new THREE.Group();
    const spin = new THREE.Group();
    spin.add(core, orbitA, orbitB);
    rig.add(spin);
    scene.add(rig);

    /* dust — sits in front of and behind the core for parallax */
    const dustPoints = new THREE.Points(dust(small ? 160 : 320, 26, 12, 14), orbitMat(2.2, 0.45));
    dustPoints.position.set(0, 3, 1);
    scene.add(dustPoints);

    /* terrain */
    const cols = small ? 90 : 170;
    const rows = small ? 60 : 100;
    const tPos = new Float32Array(cols * rows * 3);
    let k = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        tPos[k++] = (c / (cols - 1) - 0.5) * 64;
        tPos[k++] = 0;
        tPos[k++] = (r / (rows - 1)) * -36 + 8;
      }
    }
    const tGeo = new THREE.BufferGeometry();
    tGeo.setAttribute("position", new THREE.BufferAttribute(tPos, 3));
    const terrainUniforms = {
      ...shared,
      ...colors,
      uMouse: { value: new THREE.Vector2(999, 999) },
      uMouseStrength: { value: 0 },
      uSize: { value: small ? 3.0 : 3.3 },
      uOpacity: { value: isDark() ? 0.75 : 0.6 },
    };
    const terrain = new THREE.Points(
      tGeo,
      new THREE.ShaderMaterial({
        vertexShader: terrainVertex,
        fragmentShader: pointsFragment,
        uniforms: terrainUniforms,
        transparent: true,
        depthWrite: false,
      })
    );
    terrain.position.y = -0.6;
    scene.add(terrain);

    /* layout: place + size the core from a target spot in CSS pixels */
    const NAV_H = 68;
    const CORE_DIST = 9;
    const layout = { scale: 1, restY: 0 };
    const placeCore = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.position.copy(camBase);
      camera.lookAt(lookAt);
      camera.updateMatrixWorld();
      const stacked = w < 760 || w / h < 1;
      let px, py, radiusPx;
      if (stacked) {
        // phones / portrait: its own slot above the copy (see .hero__inner padding)
        const slot = Math.min(w * 0.5, 260);
        px = w * 0.5;
        py = NAV_H + slot * 0.5 + 8;
        radiusPx = slot * 0.34;
      } else {
        // desktop: the open space to the right of "that ship."
        px = w * 0.76;
        py = h * 0.53;
        radiusPx = Math.min(h * 0.16, w * 0.105);
      }
      const target = new THREE.Vector3((px / w) * 2 - 1, -((py / h) * 2 - 1), 0.5);
      const dir = target.unproject(camera).sub(camera.position).normalize();
      rig.position.copy(camera.position).addScaledVector(dir, CORE_DIST);
      const worldPerPx = (2 * CORE_DIST * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) / h;
      layout.scale = radiusPx * worldPerPx;
      layout.restY = rig.position.y; // scroll drift is applied relative to this
    };

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = w / h < 1 ? 52 : 38;
      camera.updateProjectionMatrix();
      placeCore();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    /* pointer */
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.6);
    const ndc = new THREE.Vector2(0, 0);
    const hit = new THREE.Vector3();
    const targetMouse = new THREE.Vector2(999, 999);
    const corePx = new THREE.Vector3();
    const tmpQ = new THREE.Quaternion();
    let pointerActive = false;
    let hoverTarget = 0;
    const smooth = { x: 0, y: 0 };

    const onPointerMove = (e) => {
      const rect = mount.getBoundingClientRect();
      ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      pointerActive = e.clientY < rect.bottom;
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.ray.intersectPlane(plane, hit)) targetMouse.set(hit.x, hit.z);
      // how close is the cursor to the core on screen?
      corePx.setFromMatrixPosition(rig.matrixWorld).project(camera);
      const dx = (ndc.x - corePx.x) * camera.aspect;
      const dy = ndc.y - corePx.y;
      hoverTarget = clamp01(1 - Math.hypot(dx, dy) / 0.9);
    };
    const onPointerLeave = () => {
      pointerActive = false;
      hoverTarget = 0;
    };
    const onPointerDown = (e) => {
      if (e.target.closest("a, button")) return;
      coreUniforms.uPulse.value = 1;
    };
    if (!coarse && !reduceMotion) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onPointerLeave);
      mount.parentElement.addEventListener("pointerdown", onPointerDown);
    }

    /* theme changes */
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => {
      colors.uInk.value = readColor("--ink", "#16130f");
      colors.uAccent.value = readColor("--accent", "#e8461e");
      coreUniforms.uDeep.value.set(isDark() ? "#2a1712" : "#1c1411");
      terrainUniforms.uOpacity.value = isDark() ? 0.75 : 0.6;
      if (reduceMotion) renderFrame(0);
    };
    mq.addEventListener ? mq.addEventListener("change", onScheme) : mq.addListener(onScheme);

    /* loop */
    const clock = new THREE.Clock();
    let raf = 0;
    let visible = true;
    let elapsed = 0;
    let introT = reduceMotion ? 1 : 0;
    const baseSpin = new THREE.Euler();

    function renderFrame(dt) {
      elapsed += dt;
      shared.uTime.value = elapsed;
      const scroll = clamp01(window.scrollY / window.innerHeight);

      if (!reduceMotion) {
        introT = Math.min(1, introT + dt * 0.55);
        shared.uIntro.value = introT;
        smooth.x += (ndc.x - smooth.x) * 0.05;
        smooth.y += (ndc.y - smooth.y) * 0.05;
        coreUniforms.uHover.value += (hoverTarget - coreUniforms.uHover.value) * 0.08;
        coreUniforms.uPulse.value *= 0.95;
        terrainUniforms.uMouse.value.lerp(targetMouse, 0.08);
        const ms = terrainUniforms.uMouseStrength.value;
        terrainUniforms.uMouseStrength.value = ms + ((pointerActive ? 1 : 0) - ms) * 0.05;
      }

      // core: idle spin + turn toward the cursor + scroll drift
      baseSpin.y += dt * (0.12 + scroll * 0.8);
      spin.rotation.set(baseSpin.x + smooth.y * -0.45, baseSpin.y + smooth.x * 0.6, 0);
      orbitA.rotation.y += dt * 0.25;
      orbitB.rotation.y -= dt * 0.16;
      const s = layout.scale * easeOutBack(introT) * (1 - scroll * 0.25);
      rig.scale.setScalar(Math.max(s, 0.0001));
      rig.position.y += ((layout.restY + scroll * 2.2 + Math.sin(elapsed * 0.6) * 0.08) - rig.position.y) * 0.1;

      // cursor direction in the core's local space (for the bulge)
      spin.getWorldQuaternion(tmpQ).invert();
      coreUniforms.uMouseDir.value.set(smooth.x * 1.2, smooth.y * 1.2, 0.8).normalize().applyQuaternion(tmpQ);

      dustPoints.rotation.y = elapsed * 0.02 + smooth.x * 0.08;

      camera.position.set(
        camBase.x + smooth.x * 1.1,
        camBase.y + smooth.y * 0.6 + scroll * 2.8,
        camBase.z - scroll * 3.5
      );
      camera.lookAt(lookAt);
      renderer.render(scene, camera);
    }

    const loop = () => {
      raf = requestAnimationFrame(loop);
      renderFrame(Math.min(clock.getDelta(), 0.05));
    };
    const start = () => {
      if (raf || reduceMotion || !visible || document.hidden) return;
      clock.getDelta();
      loop();
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      visible ? start() : stop();
    });
    io.observe(mount);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    renderFrame(reduceMotion ? 0 : 0.0001);
    mount.classList.add("is-ready");
    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      if (mount.parentElement) mount.parentElement.removeEventListener("pointerdown", onPointerDown);
      mq.removeEventListener ? mq.removeEventListener("change", onScheme) : mq.removeListener(onScheme);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) o.material.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="hero__scene" aria-hidden="true" />;
}
