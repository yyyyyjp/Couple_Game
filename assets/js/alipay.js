/* ============================================================
 * 支付宝红包浮动按钮（AlipayRedPacketButton）
 * 仅中文站显示；左下角浮动，点击弹出 9:16 活动图。
 * ============================================================ */
(function () {
  "use strict";
  var LABEL = "支付宝领红包，买东西省亿点！";

  var REDPACKET_SVG =
    '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<path d="M5.75 3.75h12.5c.83 0 1.5.67 1.5 1.5v16H4.25v-16c0-.83.67-1.5 1.5-1.5Z" fill="#dc2626"></path>' +
      '<path d="M4.25 8.25h15.5v12.5c0 .28-.22.5-.5.5H4.75a.5.5 0 0 1-.5-.5V8.25Z" fill="#ef4444"></path>' +
      '<path d="M4.25 8.25c3.72 3.3 7.72 3.3 11.99 0h3.51v2.36c-5.12 3.94-10.25 3.94-15.5 0V8.25Z" fill="#b91c1c" opacity=".58"></path>' +
      '<path d="M9.25 8.25c.2 1.55 1.44 2.75 2.75 2.75s2.55-1.2 2.75-2.75" stroke="#fde68a" stroke-width="1.5" stroke-linecap="round"></path>' +
      '<path d="M12 14.25v4.25M10.5 15.25h3M10.75 17h2.5" stroke="#fef3c7" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"></path>' +
    '</svg>';

  var btn = document.createElement("div");
  btn.className = "fixed bottom-[calc(env(safe-area-inset-bottom)+1.25rem)] left-4 z-[70] inline-flex max-w-[calc(100vw-2rem)] sm:left-6";
  btn.innerHTML =
    '<span aria-hidden="true" class="pointer-events-none absolute inset-0 rounded-2xl bg-red-400/35 opacity-20 animate-ping"></span>' +
    '<button type="button" aria-label="' + LABEL + '" title="' + LABEL + '" class="group relative z-10 inline-flex max-w-full items-center justify-center rounded-2xl border border-white/10 bg-zinc-950/95 text-[13px] font-medium text-white/85 shadow-lg shadow-black/30 ring-1 ring-white/5 backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-red-200/30 hover:bg-zinc-900/95 hover:text-white min-h-11 gap-2 px-3.5 py-2.5 sm:text-sm">' +
      '<span aria-hidden="true" class="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-red-500/10 text-red-100 ring-1 ring-red-200/15 transition group-hover:bg-red-500/15 group-hover:ring-red-100/25">' + REDPACKET_SVG + '</span>' +
      '<span class="whitespace-nowrap">' + LABEL + '</span>' +
    '</button>';

  /* 弹窗 */
  var modal = document.createElement("div");
  modal.className = "fixed inset-0 z-[10000] hidden items-center justify-center overflow-hidden bg-[#03010a]/90 p-4 text-white backdrop-blur-md sm:p-8";
  modal.innerHTML =
    '<h2 class="sr-only">' + LABEL + '</h2>' +
    '<div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,0.26),transparent_34%),radial-gradient(circle_at_80%_70%,rgba(56,189,248,0.22),transparent_32%)]"></div>' +
    '<div class="relative aspect-[9/16] max-h-[80dvh] w-full max-w-[calc(80dvh*9/16)] overflow-hidden rounded-[20px] shadow-[0_30px_80px_rgba(0,0,0,0.55)]">' +
      '<button type="button" data-close class="absolute right-3 top-3 z-10 rounded-full border border-white/20 bg-zinc-950/75 px-3 py-1.5 text-sm font-semibold text-white/90 shadow-lg shadow-black/30 backdrop-blur-xl transition hover:bg-zinc-900/90 cursor-pointer">关闭</button>' +
      '<img src="../assets/img/alipay-redpacket.jpg" alt="' + LABEL + '" class="h-full w-full rounded-[20px] object-cover" />' +
    '</div>';

  function openModal() {
    modal.classList.remove("hidden"); modal.classList.add("flex");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    modal.classList.add("hidden"); modal.classList.remove("flex");
    document.body.style.overflow = "";
  }
  function onKey(e) { if (e.key === "Escape") closeModal(); }

  btn.querySelector("button").addEventListener("click", openModal);
  modal.addEventListener("click", function (e) {
    if (e.target.hasAttribute("data-close")) { closeModal(); return; }
    if (e.target === modal) closeModal();
  });
  window.addEventListener("keydown", onKey);

  function mount() {
    if (!document.body.contains(btn)) document.body.appendChild(btn);
    if (!document.body.contains(modal)) document.body.appendChild(modal);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
