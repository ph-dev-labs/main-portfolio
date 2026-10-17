// Registry for the WebGL card renderer.
// Cards register their stage element; the engine (and three.js) only loads
// when WebGL is available and the visitor hasn't asked for reduced motion.
// Until the engine has a card ready, the plain DOM version stays visible.

let enginePromise = null;
let glFailed = false;

// No probe context here: creating a WebGL context is expensive, so the engine's
// own renderer is the test — if it throws, we fall back to the DOM cards for good.
function canUseGL() {
  if (glFailed) return false;
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  if (!("WebGL2RenderingContext" in window || "WebGLRenderingContext" in window)) return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function registerStage(el, data) {
  if (!el || !canUseGL()) return () => {};
  let cancelled = false;
  let remove = null;

  if (!enginePromise) {
    enginePromise = import("./cardEngine").then((m) => m.createEngine());
  }
  enginePromise
    .then((engine) => {
      if (!cancelled) remove = engine.add(el, data);
    })
    .catch(() => {
      glFailed = true; // stay on the DOM version
    });

  return () => {
    cancelled = true;
    if (remove) remove();
  };
}
