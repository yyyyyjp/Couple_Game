(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,99522,e=>{"use strict";var t=e.i(43476),r=e.i(22016),o=e.i(61745),i=e.i(48148),n=e.i(18566);let s=["en","cn","tw","ja","ko"],a=e=>{switch(e){case"en":return"En";case"cn":return"简体";case"tw":return"正體";case"ja":return"日本語";case"ko":return"한국인";default:return e}};function l(){let e=(0,o.useLocale)(),l=(0,i.useTranslations)("navigation"),c=(0,n.usePathname)()??"/",d=(0,n.useRouter)();return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{className:"relative md:hidden",children:[(0,t.jsx)("select",{value:e,onChange:e=>{let t=e.target.value,r=c.replace(RegExp(`^/(?:${s.join("|")})(?=/|$)`),""),o=`/${t}${r}`.replace(/\/+/g,"/");d.push(o)},className:"h-9 appearance-none rounded-full bg-white/10 py-2.5 pl-4 pr-8 text-xs text-white backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/10","aria-label":l("language"),children:s.map(e=>(0,t.jsx)("option",{value:e,className:"bg-gray-900 text-white",children:a(e)},e))}),(0,t.jsx)("div",{className:"pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/70",children:(0,t.jsx)("svg",{className:"h-4 w-4 fill-current",viewBox:"0 0 20 20",children:(0,t.jsx)("path",{d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"})})})]}),(0,t.jsx)("nav",{"aria-label":l("language"),className:"h-9 hidden md:flex items-center gap-2 rounded-full bg-white/10 px-2 py-1 backdrop-blur border border-white/10",children:s.map(o=>{let i=o===e,n=c.replace(RegExp(`^/(?:${s.join("|")})(?=/|$)`),""),l=`/${o}${n}`.replace(/\/+/g,"/");return(0,t.jsx)(r.default,{href:""===l?"/":l,prefetch:!1,className:`flex items-center rounded-full px-3 py-1 text-sm transition ${i?"bg-white text-gray-900":"text-white/70 hover:text-white"}`,children:a(o)},o)})})]})}e.s(["LocaleSwitcher",()=>l],99522)},13642,e=>{"use strict";var t=e.i(43476),r=e.i(48148);function o(){let e=(0,r.useTranslations)("footer");return(0,t.jsxs)("footer",{className:"mt-auto rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/70 backdrop-blur",children:[(0,t.jsx)("p",{children:e("disclaimer")}),(0,t.jsxs)("div",{className:"flex justify-center items-center gap-4 mt-2",children:["© 2024 ~ ",new Date().getFullYear(),(0,t.jsxs)("a",{href:"https://www.hoothin.com",target:"_blank",rel:"noopener noreferrer",className:"relative group text-white/70 hover:text-white",children:[(0,t.jsx)("span",{className:"relative z-10",children:"www.hoothin.com"}),(0,t.jsx)("span",{className:"absolute inset-x-0 bottom-0 h-px bg-white transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"})]}),(0,t.jsx)("a",{href:"https://x.com/HoothinDev",target:"_blank",rel:"noopener noreferrer","aria-label":"Visit my Twitter profile",className:"flex items-center justify-center h-8 w-8 rounded-full text-white/70 transition-colors hover:bg-gray-700 hover:text-white",children:(0,t.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:"h-4 w-4",children:[(0,t.jsx)("path",{d:"M4 4l11.733 16h4.267l-11.733 -16z"}),(0,t.jsx)("path",{d:"M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"})]})}),(0,t.jsx)("a",{href:"https://github.com/hoothin/qinglv",target:"_blank",rel:"noopener noreferrer","aria-label":"Visit the GitHub repository",className:"flex items-center justify-center h-8 w-8 rounded-full text-white/70 transition-colors hover:bg-gray-700 hover:text-white",children:(0,t.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"h-4 w-4",children:(0,t.jsx)("path",{d:"M12 .5C5.648.5.5 5.648.5 12a11.5 11.5 0 0 0 7.86 10.923c.575.107.785-.25.785-.556 0-.274-.01-1-.016-1.963-3.197.695-3.872-1.54-3.872-1.54-.523-1.328-1.277-1.682-1.277-1.682-1.044-.714.08-.7.08-.7 1.154.08 1.76 1.185 1.76 1.185 1.026 1.758 2.692 1.25 3.348.955.104-.743.402-1.25.73-1.538-2.552-.29-5.236-1.276-5.236-5.682 0-1.255.448-2.282 1.183-3.087-.119-.29-.513-1.458.112-3.04 0 0 .964-.309 3.16 1.18A10.97 10.97 0 0 1 12 6.04c.976.005 1.959.132 2.878.387 2.194-1.49 3.156-1.18 3.156-1.18.627 1.582.233 2.75.114 3.04.737.805 1.18 1.832 1.18 3.087 0 4.417-2.688 5.389-5.248 5.674.414.356.783 1.06.783 2.136 0 1.542-.013 2.786-.013 3.164 0 .309.207.668.79.555A11.503 11.503 0 0 0 23.5 12C23.5 5.648 18.352.5 12 .5Z"})})})]})]})}e.s(["Footer",()=>o])},56923,e=>{"use strict";var t=e.i(43476),r=e.i(57688);function o({locale:e,variant:o="home",className:i="",trackingContent:n="home_banner"}){let s;if("cn"!==e)return null;let a="compact"===o,l=((s=new URL("https://housetime.zgame.fun/")).searchParams.set("utm_source","lovegame"),s.searchParams.set("utm_medium","site_ad"),s.searchParams.set("utm_campaign","housetime"),s.searchParams.set("utm_content",n),s.toString());return(0,t.jsxs)("section",{"aria-label":"宅时光推广",className:`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-white shadow-2xl shadow-black/30 backdrop-blur-xl transition hover:border-pink-300/60 hover:bg-white/10 ${i}`,children:[(0,t.jsx)("div",{className:"absolute -left-16 top-8 h-44 w-44 rounded-full bg-pink-500/20 blur-3xl"}),(0,t.jsx)("div",{className:"absolute -right-16 bottom-0 h-52 w-52 rounded-full bg-sky-400/20 blur-3xl"}),(0,t.jsxs)("div",{className:`relative grid items-center gap-6 ${a?"p-5 sm:grid-cols-[1fr_13rem] sm:p-6":"p-6 md:grid-cols-[1.1fr_0.9fr] lg:p-8"}`,children:[(0,t.jsxs)("div",{className:"space-y-5",children:[(0,t.jsxs)("div",{className:"flex flex-wrap items-center gap-3",children:[(0,t.jsx)("span",{className:"rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-pink-200",children:"像素社区手游"}),(0,t.jsx)("span",{className:"rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-white/60",children:"玩家口碑"})]}),(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsx)(r.default,{src:"/housetime-logo.png",alt:"宅时光",width:220,height:103,className:`${a?"w-32":"w-40 sm:w-52"} h-auto drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]`}),(0,t.jsx)("h2",{className:`${a?"text-2xl":"text-3xl sm:text-4xl"} font-semibold leading-tight`,children:a?"大富翁还在建设中？先去宅时光逛一圈":"听说这是妹子比例最高的像素社区游戏？"}),(0,t.jsx)("p",{className:`${a?"text-sm":"text-base sm:text-lg"} max-w-2xl leading-relaxed text-white/75`,children:a?"妹子多、房间多、还能聊天找 CP。像素社区里先把小家支起来。":"Q版像素画风，换装、建房、串门、聊天、找 CP。玩完情侣小游戏，去宅时光认识更多会玩的朋友。"})]}),(0,t.jsx)("div",{className:"flex flex-wrap items-center gap-3",children:(0,t.jsxs)("a",{href:l,target:"_blank",rel:"sponsored noopener noreferrer",className:"inline-flex items-center gap-2 rounded-full bg-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 transition hover:bg-pink-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-200",children:["去宅时光看看",(0,t.jsx)("span",{"aria-hidden":!0,children:"→"})]})})]}),(0,t.jsxs)("a",{href:l,target:"_blank",rel:"sponsored noopener noreferrer",className:`relative block overflow-hidden rounded-3xl border border-white/10 bg-black/30 transition group-hover:scale-[1.01] ${a?"hidden aspect-[16/10] sm:block":"aspect-[16/9]"}`,"aria-label":"查看宅时光官网",children:[(0,t.jsx)(r.default,{src:"/housetime-promo.png",alt:"宅时光像素社区游戏截图",fill:!0,sizes:a?"13rem":"(max-width: 768px) 100vw, 42vw",className:"object-cover object-left-top"}),(0,t.jsx)("div",{className:"absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4",children:(0,t.jsx)("p",{className:"text-sm font-semibold text-white",children:"换装 · 建房 · 串门 · 找 CP"})})]})]})]})}e.s(["HousetimeAd",()=>o])},34078,e=>{"use strict";var t=e.i(43476),r=e.i(71645);function o(){let e=(0,r.useRef)(null),o=(0,r.useRef)(null);return(0,r.useEffect)(()=>{let t,r=e.current;if(!r)return;let i=r.getContext("webgl");if(!i)return;let n=`
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `,s=`
      precision highp float;

      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;

      // Random generator
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      // Value Noise (Smooth)
      float noise(in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        // Cubic blending for smoothness
        f = f * f * (3.0 - 2.0 * f);

        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      // Fractal Brownian Motion (Clouds)
      float fbm(in vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        // Shift to avoid axis bias
        vec2 shift = vec2(100.0);
        // Rotation matrix
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
        
        for (int i = 0; i < 5; i++) {
          value += amplitude * noise(st);
          st = rot * st * 2.0 + shift;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        uv.x *= u_resolution.x / u_resolution.y;

        float t = u_time * 0.25; 

        // --- Domain Warping (Smoother) ---
        // Reduced frequency for cleaner, less chaotic shapes
        vec2 q = vec2(0.);
        q.x = fbm(uv * 0.8 + 0.1 * t);
        q.y = fbm(uv * 0.8 + vec2(1.0));

        vec2 r = vec2(0.);
        r.x = fbm(uv + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t);
        r.y = fbm(uv + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t);

        float f = fbm(uv + r);

        // --- Palette: "Pure & Vibrant Neon Romance" ---
        // Clean colors only. No murky blacks or browns.

        // Background: Rich Deep Violet (Not Black)
        // This ensures even the shadows look colorful and "expensive"
        vec3 colorBg = vec3(0.12, 0.05, 0.25); 
        
        // 1. Neon Pink (Vibrant & Clean)
        vec3 color1 = vec3(0.95, 0.2, 0.7);   
        // 2. Bright Magenta (Glow)
        vec3 color2 = vec3(0.8, 0.1, 0.9);    
        // 3. Soft Lavender (Lightness)
        vec3 color3 = vec3(0.7, 0.6, 1.0);    

        // --- Clean Blending ---
        vec3 color = colorBg;
        
        // Mix efficiently using smooth noise
        color = mix(color, color1, smoothstep(0.0, 1.0, q.x));
        color = mix(color, color2, smoothstep(0.0, 1.0, q.y));
        
        // Additive highlight for the "Glow"
        // This ensures highlights are pure light
        color += color3 * smoothstep(0.2, 1.0, f) * 0.6;

        // --- Soft Atmosphere ---
        // A general pinkish glow to unify everything
        float atmosphere = f * f;
        color += vec3(0.15, 0.05, 0.1) * atmosphere;

        // --- Interaction ---
        vec2 mouse = u_mouse / u_resolution.xy;
        mouse.x *= u_resolution.x / u_resolution.y;
        float d = length(uv - mouse);
        // Clean white/pink spotlight
        color += vec3(0.2, 0.1, 0.2) * smoothstep(0.4, 0.0, d);

        // --- Post Processing ---

        // 1. Color Grading: Vibrance
        // Slightly increase saturation without darkening
        color = pow(color, vec3(0.95)); 

        // 2. Minimal Grain (Cleaner look)
        // Drastically reduced to avoid "dirty" look
        float grain = random(uv + t) * 0.015;
        color += grain;

        // 3. Soft Vignette
        // Subtle framing, no hard black edges
        float vig = 1.0 - length((gl_FragCoord.xy / u_resolution.xy) - 0.8) * 0.8;
        color *= smoothstep(0.1, 1.3, vig);

        gl_FragColor = vec4(color, 1.0);
      }
    `;function a(e,t,r){let o=e.createShader(t);return o?(e.shaderSource(o,r),e.compileShader(o),e.getShaderParameter(o,e.COMPILE_STATUS))?o:(console.error(e.getShaderInfoLog(o)),e.deleteShader(o),null):null}let l=a(i,i.VERTEX_SHADER,n),c=a(i,i.FRAGMENT_SHADER,s);if(!l||!c)return;let d=i.createProgram();if(!d)return;if(i.attachShader(d,l),i.attachShader(d,c),i.linkProgram(d),!i.getProgramParameter(d,i.LINK_STATUS))return void console.error(i.getProgramInfoLog(d));i.useProgram(d);let u=i.createBuffer();i.bindBuffer(i.ARRAY_BUFFER,u),i.bufferData(i.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),i.STATIC_DRAW);let h=i.getAttribLocation(d,"position");i.enableVertexAttribArray(h),i.vertexAttribPointer(h,2,i.FLOAT,!1,0,0);let m=i.getUniformLocation(d,"u_time"),f=i.getUniformLocation(d,"u_resolution"),x=i.getUniformLocation(d,"u_mouse"),p=window.innerWidth,g=window.innerHeight,v=p/2,b=g/2,w=p/2,j=g/2,k=()=>{p=window.innerWidth,g=window.innerHeight,r.width=p,r.height=g,i.viewport(0,0,p,g),i.uniform2f(f,p,g)};window.addEventListener("resize",k),k();let y=e=>{w=e.clientX,j=g-e.clientY};window.addEventListener("mousemove",y);let N=performance.now(),_=()=>{let e=performance.now();v+=(w-v)*.05,b+=(j-b)*.05,i.uniform1f(m,(e-N)*.001),i.uniform2f(x,v,b),i.drawArrays(i.TRIANGLES,0,6),t=requestAnimationFrame(_)};return _(),o.current&&(o.current.style.opacity="1"),()=>{window.removeEventListener("resize",k),window.removeEventListener("mousemove",y),cancelAnimationFrame(t),i.deleteShader(l),i.deleteShader(c),i.deleteProgram(d),i.deleteBuffer(u)}},[]),(0,t.jsxs)("div",{ref:o,className:"fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-[#050512] transition-opacity duration-1000 ease-in",style:{opacity:0},children:[(0,t.jsx)("canvas",{ref:e,className:"absolute inset-0 h-full w-full opacity-35"}),(0,t.jsx)("div",{className:"absolute inset-0 bg-gradient-to-t from-[#020205]/80 via-transparent to-transparent"})]})}e.s(["BackgroundEffect",()=>o])},6207,e=>{"use strict";var t=e.i(43476),r=e.i(48148),o=e.i(88147);function i({compactOnMobile:e=!1}){let i=(0,r.useTranslations)(),{count:n,connected:s}=(0,o.useOnlinePresence)(),a="number"==typeof n?n:"-",l=i("hero.onlineNow",{count:a});return(0,t.jsxs)("div",{className:"inline-flex h-8 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold tracking-wide text-white/90 backdrop-blur-xl sm:h-9 sm:px-4","aria-label":l,children:[(0,t.jsx)("span",{className:`h-2 w-2 rounded-full ${s?"bg-emerald-400":"bg-white/30"}`,"aria-hidden":!0}),(0,t.jsx)("span",{className:e?"sm:hidden":"",children:e?a:l}),e?(0,t.jsx)("span",{className:"hidden sm:inline",children:l}):null]})}e.s(["OnlineCountPill",()=>i])},36723,e=>{"use strict";var t=e.i(43476),r=e.i(48148),o=e.i(53719);function i(){let e=(0,r.useTranslations)("hero"),{isInstallable:i,promptInstall:n}=(0,o.usePwaInstall)(),s=async()=>{await n()};return i?(0,t.jsxs)("button",{onClick:s,className:"cursor-pointer inline-flex items-center gap-2 rounded-full border border-pink-500/10 bg-pink-500/10 px-6 py-3 text-sm font-semibold text-pink-200 shadow-lg backdrop-blur-sm transition hover:bg-pink-500 hover:text-white hover:border-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-200",children:[(0,t.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,t.jsx)("path",{d:"M12 15V3"}),(0,t.jsx)("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),(0,t.jsx)("path",{d:"m7 10 5 5 5-5"})]}),(0,t.jsx)("span",{children:e("installApp")})]}):null}e.s(["InstallPwaButton",()=>i])}]);