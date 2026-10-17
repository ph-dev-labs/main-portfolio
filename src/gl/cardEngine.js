import * as THREE from "three";

/*
  One fixed, full-viewport WebGL canvas (behind the page) draws every case-study
  stage. Each frame we read each stage's DOM rect and render that card's own
  little 3D scene into exactly that rectangle (viewport + scissor), so the
  layout stays 100% CSS while the visuals are real 3D.

  Per card:
  ─ tinted backdrop with grid + cursor spotlight (rounded to match the CSS)
  ─ browser-window plane(s) with the screenshot, soft shadow, floating dust
  ─ tilt from viewport position + cursor, paper-curl + RGB split from scroll
    velocity, lens bulge / ripple / glare under the cursor
*/

const ROUND = /* glsl */ `
  float sdRound(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }
`;

const bgVertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;
const bgFragment = /* glsl */ `
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform vec3 uTint;
  uniform float uRadius;
  uniform float uHover;
  uniform float uAlpha;
  varying vec2 vUv;
  ${ROUND}
  void main() {
    vec2 px = vUv * uRes;
    float d = sdRound(px - uRes * 0.5, uRes * 0.5, uRadius);
    float mask = 1.0 - smoothstep(-1.0, 1.0, d);
    if (mask <= 0.0) discard;

    vec2 aspect = vec2(uRes.x / uRes.y, 1.0);
    float g = length((vUv - uMouse) * aspect);
    vec3 col = mix(uTint + 0.09, uTint, smoothstep(0.0, 1.0, g));

    vec2 cell = abs(fract(px / 32.0 - 0.5) - 0.5) * 32.0;
    float line = 1.0 - smoothstep(0.0, 1.0, min(cell.x, cell.y));
    float gridMask = 1.0 - smoothstep(0.0, 0.8, length((vUv - vec2(0.5, 0.6)) * aspect));
    col += line * 0.055 * gridMask;
    col += (1.0 - smoothstep(0.0, 0.5, g)) * 0.07 * uHover;

    gl_FragColor = vec4(col, mask * uAlpha);
  }
`;

const windowVertex = /* glsl */ `
  uniform float uBend;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHover;
  varying vec2 vUv;
  varying float vLift;
  void main() {
    vUv = uv;
    vec3 p = position;                  // unit plane, scaled by the mesh
    float ny = p.y * 2.0;
    float nx = p.x * 2.0;
    p.z -= uBend * (ny * ny) * 0.32;    // paper curl from scroll velocity
    p.z -= uBend * (nx * nx) * 0.06;
    float d = distance(uv, uMouse);
    p.z += exp(-d * d * 26.0) * uHover * 0.05;
    p.z += sin(d * 34.0 - uTime * 6.0) * exp(-d * d * 14.0) * uHover * 0.008;
    vLift = p.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const windowFragment = /* glsl */ `
  uniform sampler2D uTex;
  uniform vec2 uSize;
  uniform float uRadius;
  uniform float uAlpha;
  uniform float uShift;
  uniform vec2 uMouse;
  uniform float uHover;
  varying vec2 vUv;
  varying float vLift;
  ${ROUND}
  void main() {
    vec2 p = (vUv - 0.5) * uSize;
    float d = sdRound(p, uSize * 0.5, uRadius);
    float aa = fwidth(d) * 1.2;
    float mask = 1.0 - smoothstep(-aa, aa, d);
    if (mask <= 0.0) discard;

    vec2 uv = vUv;
    vec2 toM = uv - uMouse;
    float md = length(toM * vec2(uSize.x / uSize.y, 1.0));
    uv -= toM * exp(-md * md * 30.0) * 0.06 * uHover;        // lens bulge under the cursor

    vec3 col;
    col.r = texture2D(uTex, uv + vec2(0.0, uShift)).r;
    col.g = texture2D(uTex, uv).g;
    col.b = texture2D(uTex, uv - vec2(0.0, uShift)).b;

    float band = 1.0 - smoothstep(0.0, 0.3, abs(dot(uv - uMouse, normalize(vec2(1.0, 0.75)))));
    col += band * 0.07 * uHover;                               // glare sweep
    col += vLift * 0.8;                                        // raised areas catch light
    float edge = smoothstep(-0.012 * uSize.x, 0.0, d);
    col += edge * 0.12;                                        // thin bevel highlight

    gl_FragColor = vec4(col, mask * uAlpha);
  }
`;

const shadowFragment = /* glsl */ `
  uniform vec2 uSize;
  uniform float uAlpha;
  varying vec2 vUv;
  ${ROUND}
  void main() {
    vec2 p = (vUv - 0.5) * uSize;
    float d = sdRound(p, uSize * 0.34, 0.06);
    float a = 1.0 - smoothstep(-uSize.y * 0.04, uSize.y * 0.13, d);
    gl_FragColor = vec4(0.0, 0.0, 0.0, a * a * 0.5 * uAlpha);
  }
`;
const flatVertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

const dustVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSeed;
  varying float vTw;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.6 + aSeed * 30.0) * 0.04;
    p.x += cos(uTime * 0.4 + aSeed * 20.0) * 0.03;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vTw = 0.5 + 0.5 * sin(uTime * 1.8 + aSeed * 60.0);
    gl_PointSize = (2.0 + aSeed * 3.0) * uPixelRatio * (3.7 / -mv.z);
  }
`;
const dustFragment = /* glsl */ `
  uniform float uAlpha;
  varying float vTw;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    gl_FragColor = vec4(1.0, 0.97, 0.92, smoothstep(0.5, 0.0, r) * (0.25 + 0.4 * vTw) * uAlpha);
  }
`;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const CAM_Z = 1 / Math.tan(THREE.MathUtils.degToRad(15)); // fov 30 → y ∈ [-1, 1] at z = 0

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => (img.decode ? img.decode().catch(() => {}) : Promise.resolve()).then(() => resolve(img));
    img.onerror = reject;
    img.src = src;
  });
}

function readTheme() {
  const cs = getComputedStyle(document.documentElement);
  const v = (n, f) => cs.getPropertyValue(n).trim() || f;
  return { card: v("--card", "#fbf8f3"), ink3: v("--ink-3", "#8a8175"), line: v("--line", "rgba(0,0,0,.12)") };
}

// browser chrome + screenshot composited into one texture
async function windowTexture(src, host, theme, maxWidth) {
  const img = await loadImage(src);
  // never larger than the window will be on screen (device px) — keeps uploads cheap
  const W = Math.round(Math.min(1600, Math.max(640, maxWidth)));
  const k = W / 1600;
  const BAR = Math.round(64 * k);
  const VIEW = Math.round(W * (10 / 16));
  const c = document.createElement("canvas");
  c.width = W;
  c.height = VIEW + BAR;
  const g = c.getContext("2d");
  g.fillStyle = theme.card;
  g.fillRect(0, 0, W, BAR);
  ["#ff5f57", "#febc2e", "#28c840"].forEach((col, i) => {
    g.fillStyle = col;
    g.beginPath();
    g.arc((36 + i * 30) * k, BAR / 2, 9 * k, 0, Math.PI * 2);
    g.fill();
  });
  if (host) {
    try {
      await document.fonts.load('500 22px "IBM Plex Mono"');
    } catch (e) {
      /* fall back to system mono */
    }
    g.fillStyle = theme.ink3;
    g.font = `500 ${Math.round(22 * k)}px "IBM Plex Mono", ui-monospace, monospace`;
    g.textBaseline = "middle";
    g.fillText(host, 148 * k, BAR / 2 + 1);
  }
  g.fillStyle = theme.line;
  g.fillRect(0, BAR - Math.max(1, 2 * k), W, Math.max(1, 2 * k));
  // cover, anchored to the top like the CSS (object-position: top)
  const s = Math.max(W / img.width, VIEW / img.height);
  g.drawImage(img, 0, 0, W / s, VIEW / s, 0, BAR, W, VIEW);

  const tex = new THREE.CanvasTexture(c);
  // shown at ~1:1, so skip mipmap generation (the expensive part of the upload)
  tex.generateMipmaps = false;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return { tex, aspect: W / (VIEW + BAR) };
}

export function createEngine() {
  const canvas = document.createElement("canvas");
  canvas.className = "cards-gl";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);

  // no MSAA: edges are anti-aliased in the shaders (SDF), and the canvas is full-viewport
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);
  renderer.autoClear = false;
  const resize = () => renderer.setSize(window.innerWidth, window.innerHeight, false);
  resize();
  window.addEventListener("resize", resize);

  const orthoCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new THREE.PlaneGeometry(2, 2);
  const plane = new THREE.PlaneGeometry(1, 1, 40, 40);
  const flat = new THREE.PlaneGeometry(1, 1);

  const pointer = { x: -1e5, y: -1e5 };
  const onPointer = (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  const cards = new Set();

  // build card textures one at a time, only once a card is near the viewport
  const pending = [];
  let building = false;
  const idle = () =>
    new Promise((r) => (window.requestIdleCallback ? window.requestIdleCallback(r, { timeout: 300 }) : setTimeout(r, 16)));
  const pump = async () => {
    if (building) return;
    building = true;
    while (pending.length) {
      const card = pending.shift();
      if (!cards.has(card)) continue;
      await idle();
      await card.rebuild().catch((e) => console.warn("[cards-gl] texture build failed", e));
    }
    building = false;
  };
  const nearIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        nearIO.unobserve(entry.target);
        const card = [...cards].find((c) => c.el === entry.target);
        if (card) {
          pending.push(card);
          pump();
        }
      });
    },
    { rootMargin: "800px 0px" }
  );
  const shared = {
    uTime: { value: 0 },
    uBend: { value: 0 },
    uShift: { value: 0 },
    uPixelRatio: { value: dpr },
  };

  function makeCard(el, data, index) {
    const caseEl = el.closest(".case") || el;
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.z = CAM_Z;
    const scene = new THREE.Scene();
    const bgScene = new THREE.Scene();

    const tint = new THREE.Color().setStyle(data.tint || "#222222", THREE.LinearSRGBColorSpace);
    const bgU = {
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTint: { value: tint },
      uRadius: { value: 20 },
      uHover: { value: 0 },
      uAlpha: { value: 0 },
    };
    bgScene.add(
      new THREE.Mesh(
        quad,
        new THREE.ShaderMaterial({
          vertexShader: bgVertex,
          fragmentShader: bgFragment,
          uniforms: bgU,
          transparent: true,
          depthTest: false,
          depthWrite: false,
        })
      )
    );

    const pivot = new THREE.Group();
    scene.add(pivot);

    const windows = []; // { mesh, shadow, u, su, w, h, x, y, z, depth }
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const rot = { x: 0, y: 0 };
    const state = { ready: false, shown: false, alpha: 0, hover: 0, aspect: 0, disposed: false };
    const seed = index * 1.7;

    // dust
    const dustCount = 70;
    const dPos = new Float32Array(dustCount * 3);
    const dSeed = new Float32Array(dustCount);
    for (let i = 0; i < dustCount; i++) {
      dPos[i * 3] = (Math.random() - 0.5) * 3.2;
      dPos[i * 3 + 1] = (Math.random() - 0.5) * 2.2;
      dPos[i * 3 + 2] = -0.6 + Math.random() * 1.4;
      dSeed[i] = Math.random();
    }
    const dGeo = new THREE.BufferGeometry();
    dGeo.setAttribute("position", new THREE.BufferAttribute(dPos, 3));
    dGeo.setAttribute("aSeed", new THREE.BufferAttribute(dSeed, 1));
    const dustU = { uTime: shared.uTime, uPixelRatio: shared.uPixelRatio, uAlpha: { value: 0 } };
    const dust = new THREE.Points(
      dGeo,
      new THREE.ShaderMaterial({
        vertexShader: dustVertex,
        fragmentShader: dustFragment,
        uniforms: dustU,
        transparent: true,
        depthWrite: false,
      })
    );
    pivot.add(dust);

    function addWindow(tex, aspect, depth) {
      const u = {
        uTex: { value: tex },
        uSize: { value: new THREE.Vector2(1, 1) },
        uRadius: { value: 0.03 },
        uAlpha: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uHover: { value: 0 },
        uTime: shared.uTime,
        uBend: shared.uBend,
        uShift: shared.uShift,
      };
      const mesh = new THREE.Mesh(
        plane,
        new THREE.ShaderMaterial({
          vertexShader: windowVertex,
          fragmentShader: windowFragment,
          uniforms: u,
          transparent: true,
          extensions: { derivatives: true },
        })
      );
      const su = { uSize: { value: new THREE.Vector2(1, 1) }, uAlpha: { value: 0 } };
      const shadow = new THREE.Mesh(
        flat,
        new THREE.ShaderMaterial({
          vertexShader: flatVertex,
          fragmentShader: shadowFragment,
          uniforms: su,
          transparent: true,
          depthWrite: false,
        })
      );
      shadow.renderOrder = -1;
      pivot.add(shadow, mesh);
      const win = { mesh, shadow, u, su, aspect, depth, w: 1, h: 1, x: 0, y: 0, z: 0 };
      windows.push(win);
      return win;
    }

    function relayout(a) {
      const [main, sub] = windows;
      if (!main) return;
      const mainW = Math.min(2 * a * (sub ? 0.78 : 0.82), 1.6 * main.aspect);
      Object.assign(main, { w: mainW, h: mainW / main.aspect, x: sub ? -a * 0.05 : 0, y: sub ? 0.06 : 0.02, z: 0 });
      if (sub) {
        const w = mainW * 0.46;
        const h = w / sub.aspect;
        const x = Math.min(main.x + mainW * 0.5 - w * 0.32, a * 0.94 - w * 0.5);
        Object.assign(sub, { w, h, x, y: -main.h * 0.5 + h * 0.18, z: 0.34 });
      }
      windows.forEach((win) => {
        win.mesh.scale.set(win.w, win.h, 1);
        win.u.uSize.value.set(win.w, win.h);
        win.shadow.scale.set(win.w * 1.3, win.h * 1.45, 1);
        win.su.uSize.value.set(win.w * 1.3, win.h * 1.45);
      });
    }

    async function build() {
      const theme = readTheme();
      const px = el.getBoundingClientRect().width * dpr;
      const main = await windowTexture(data.image, data.host, theme, px * 0.85);
      const sub = data.secondaryImage ? await windowTexture(data.secondaryImage, "", theme, px * 0.45) : null;
      if (state.disposed) {
        main.tex.dispose();
        if (sub) sub.tex.dispose();
        return;
      }
      if (windows.length) {
        // re-theme: swap textures in place
        windows[0].u.uTex.value.dispose();
        windows[0].u.uTex.value = main.tex;
        if (sub && windows[1]) {
          windows[1].u.uTex.value.dispose();
          windows[1].u.uTex.value = sub.tex;
        }
        return;
      }
      addWindow(main.tex, main.aspect, 1);
      if (sub) addWindow(sub.tex, sub.aspect, 2.2);
      // compile programs + upload textures off the critical path where supported
      // (KHR_parallel_shader_compile); later cards reuse the cached programs
      if (renderer.compileAsync) {
        await renderer.compileAsync(bgScene, orthoCam);
        await renderer.compileAsync(scene, camera);
        if (state.disposed) return;
      }
      state.aspect = 0; // force relayout
      state.ready = true;
    }
    // textures are built lazily (near the viewport) and one card at a time — see `queue`

    function update(r, dt, time, H) {
      const a = r.width / r.height;
      if (Math.abs(a - state.aspect) > 1e-3) {
        state.aspect = a;
        camera.aspect = a;
        camera.updateProjectionMatrix();
        relayout(a);
      }
      bgU.uRes.value.set(r.width, r.height);

      const inside = pointer.x >= r.left && pointer.x <= r.right && pointer.y >= r.top && pointer.y <= r.bottom;
      const mx = ((pointer.x - r.left) / r.width) * 2 - 1;
      const my = -(((pointer.y - r.top) / r.height) * 2 - 1);
      state.hover += ((inside ? 1 : 0) - state.hover) * 0.08;
      bgU.uHover.value = state.hover;
      if (inside) bgU.uMouse.value.lerp(new THREE.Vector2((mx + 1) / 2, (my + 1) / 2), 0.12);

      // fade in once the texture is ready and the CSS reveal has fired
      const target = state.ready && caseEl.classList.contains("is-in") ? 1 : 0;
      state.alpha += (target - state.alpha) * Math.min(1, dt * 5);
      bgU.uAlpha.value = state.alpha;
      dustU.uAlpha.value = state.alpha;
      // GL is drawn *under* the DOM card; only hide the DOM once GL is fully in
      if (state.ready && !state.shown && state.alpha > 0.97) {
        state.shown = true;
        el.classList.add("is-gl");
      }

      // tilt: position in viewport (enter tilted back, exit tipped forward) + cursor
      const p = clamp((r.top + r.height / 2 - H / 2) / (H / 2 + r.height / 2), -1, 1);
      const tx = -p * 0.42 + (inside ? -my * 0.16 : 0);
      const ty = (inside ? mx * 0.26 : 0) + p * 0.05;
      rot.x += (tx - rot.x) * 0.08;
      rot.y += (ty - rot.y) * 0.08;
      pivot.rotation.set(rot.x, rot.y, 0);
      pivot.scale.setScalar(1 - Math.abs(p) * 0.06);
      pivot.position.y = Math.sin(time * 0.9 + seed) * 0.015;

      // cursor → uv on whichever window is under it
      let hitMesh = null;
      let hitUv = null;
      if (inside && windows.length) {
        ndc.set(mx, my);
        raycaster.setFromCamera(ndc, camera);
        const hit = raycaster.intersectObjects(windows.map((w) => w.mesh), false)[0];
        if (hit) {
          hitMesh = hit.object;
          hitUv = hit.uv;
        }
      }

      windows.forEach((win) => {
        const parallax = -p * 0.1 * win.depth;
        win.mesh.position.set(win.x + (inside ? mx * 0.02 * win.depth : 0), win.y + parallax, win.z);
        win.shadow.position.set(win.x + 0.03, win.y + parallax - 0.09, win.z - 0.18);
        win.u.uAlpha.value = state.alpha;
        win.su.uAlpha.value = state.alpha;
        const isHit = win.mesh === hitMesh;
        win.u.uHover.value += ((isHit ? 1 : 0) - win.u.uHover.value) * 0.1;
        if (isHit) win.u.uMouse.value.lerp(hitUv, 0.25);
      });
    }

    function dispose() {
      state.disposed = true;
      el.classList.remove("is-gl");
      windows.forEach((w) => {
        w.u.uTex.value.dispose();
        w.mesh.material.dispose();
        w.shadow.material.dispose();
      });
      dGeo.dispose();
      dust.material.dispose();
      bgScene.children[0].material.dispose();
    }

    return { el, scene, bgScene, camera, update, dispose, rebuild: build };
  }

  /* loop */
  let raf = 0;
  let last = performance.now();
  let lastY = window.scrollY;
  let vel = 0;
  let count = 0;

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    shared.uTime.value += dt;

    const y = window.scrollY;
    const v = (y - lastY) / Math.max(dt, 1e-3);
    lastY = y;
    vel += (v - vel) * 0.12;
    shared.uBend.value = clamp(vel / 5200, -0.3, 0.3);
    shared.uShift.value = clamp(Math.abs(vel) / 260000, 0, 0.007);

    const W = window.innerWidth;
    const H = window.innerHeight;
    renderer.setScissorTest(false);
    renderer.clear();
    renderer.setScissorTest(true);
    cards.forEach((c) => {
      const r = c.el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > H || r.right < 0 || r.left > W || r.width < 2) return;
      c.update(r, dt, shared.uTime.value, H);
      const x = r.left;
      const yb = H - r.bottom;
      renderer.setViewport(x, yb, r.width, r.height);
      renderer.setScissor(x, yb, r.width, r.height);
      renderer.render(c.bgScene, orthoCam);
      renderer.clearDepth();
      renderer.render(c.scene, c.camera);
    });
  }
  const start = () => {
    if (!raf && cards.size && !document.hidden) {
      last = performance.now();
      lastY = window.scrollY;
      raf = requestAnimationFrame(frame);
    }
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onScheme = () => cards.forEach((c) => c.rebuild().catch(() => {}));
  mq.addEventListener ? mq.addEventListener("change", onScheme) : mq.addListener(onScheme);

  return {
    add(el, data) {
      const card = makeCard(el, data, count++);
      cards.add(card);
      nearIO.observe(el);
      start();
      return () => {
        nearIO.unobserve(el);
        cards.delete(card);
        card.dispose();
        if (!cards.size) {
          stop();
          renderer.setScissorTest(false);
          renderer.clear();
        }
      };
    },
  };
}
