/* ============================================================
 * 动态 WebGL 背景：霓虹粉紫流动云雾 + 鼠标聚光灯
 * 从原站 BackgroundEffect 组件移植
 * ============================================================ */
(function () {
  "use strict";
  function init(canvas) {
    var gl = canvas.getContext("webgl");
    if (!gl) return null;

    var VERT = [
      "attribute vec2 position;",
      "void main() { gl_Position = vec4(position, 0.0, 1.0); }"
    ].join("\n");

    var FRAG = [
      "precision highp float;",
      "uniform float u_time;",
      "uniform vec2 u_resolution;",
      "uniform vec2 u_mouse;",
      "float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }",
      "float noise(in vec2 st) {",
      "  vec2 i = floor(st); vec2 f = fract(st);",
      "  f = f * f * (3.0 - 2.0 * f);",
      "  float a = random(i);",
      "  float b = random(i + vec2(1.0, 0.0));",
      "  float c = random(i + vec2(0.0, 1.0));",
      "  float d = random(i + vec2(1.0, 1.0));",
      "  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);",
      "}",
      "float fbm(in vec2 st) {",
      "  float value = 0.0; float amplitude = 0.5;",
      "  vec2 shift = vec2(100.0);",
      "  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));",
      "  for (int i = 0; i < 5; i++) { value += amplitude * noise(st); st = rot * st * 2.0 + shift; amplitude *= 0.5; }",
      "  return value;",
      "}",
      "void main() {",
      "  vec2 uv = gl_FragCoord.xy / u_resolution.xy;",
      "  uv.x *= u_resolution.x / u_resolution.y;",
      "  float t = u_time * 0.25;",
      "  vec2 q = vec2(0.);",
      "  q.x = fbm(uv * 0.8 + 0.1 * t);",
      "  q.y = fbm(uv * 0.8 + vec2(1.0));",
      "  vec2 r = vec2(0.);",
      "  r.x = fbm(uv + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t);",
      "  r.y = fbm(uv + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t);",
      "  float f = fbm(uv + r);",
      "  vec3 colorBg = vec3(0.12, 0.05, 0.25);",
      "  vec3 color1 = vec3(0.95, 0.2, 0.7);",
      "  vec3 color2 = vec3(0.8, 0.1, 0.9);",
      "  vec3 color3 = vec3(0.7, 0.6, 1.0);",
      "  vec3 color = colorBg;",
      "  color = mix(color, color1, smoothstep(0.0, 1.0, q.x));",
      "  color = mix(color, color2, smoothstep(0.0, 1.0, q.y));",
      "  color += color3 * smoothstep(0.2, 1.0, f) * 0.6;",
      "  float atmosphere = f * f;",
      "  color += vec3(0.15, 0.05, 0.1) * atmosphere;",
      "  vec2 mouse = u_mouse / u_resolution.xy;",
      "  mouse.x *= u_resolution.x / u_resolution.y;",
      "  float d = length(uv - mouse);",
      "  color += vec3(0.2, 0.1, 0.2) * smoothstep(0.4, 0.0, d);",
      "  color = pow(color, vec3(0.95));",
      "  float grain = random(uv + t) * 0.015;",
      "  color += grain;",
      "  float vig = 1.0 - length((gl_FragCoord.xy / u_resolution.xy) - 0.8) * 0.8;",
      "  color *= smoothstep(0.1, 1.3, vig);",
      "  gl_FragColor = vec4(color, 1.0);",
      "}"
    ].join("\n");

    function makeShader(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s)); return null;
      }
      return s;
    }
    var vs = makeShader(gl.VERTEX_SHADER, VERT);
    var fs = makeShader(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(prog)); return null; }
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var uTime = gl.getUniformLocation(prog, "u_time");
    var uRes = gl.getUniformLocation(prog, "u_resolution");
    var uMouse = gl.getUniformLocation(prog, "u_mouse");

    var W = window.innerWidth, H = window.innerHeight;
    var tx = W / 2, ty = H / 2, mx = W / 2, my = H / 2, raf;
    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
      gl.viewport(0, 0, W, H);
      gl.uniform2f(uRes, W, H);
    }
    function onMove(e) { mx = e.clientX; my = H - e.clientY; }
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    resize();
    var start = performance.now();
    function loop() {
      var now = performance.now();
      tx += (mx - tx) * 0.05;
      ty += (my - ty) * 0.05;
      gl.uniform1f(uTime, (now - start) * 0.001);
      gl.uniform2f(uMouse, tx, ty);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(loop);
    }
    loop();
    var holder = canvas.parentNode;
    if (holder) holder.style.opacity = "1";
    return function destroy() {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }

  window.LGBackground = function (canvas) { return init(canvas); };

  // 自动初始化：页面中 <canvas data-bg>
  document.addEventListener("DOMContentLoaded", function () {
    var c = document.querySelector("canvas[data-bg]");
    if (c) window.LGBackground(c);
  });
})();
