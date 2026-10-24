// Cabina LP（2026-10-24 リデザイン）。動きの正は docs/redesign/cabina-lp-mock.html

// #region [planes] ヒーローの板：HPトップと同じ考え方（4色・ごく薄い）
(function () {
  const svg = document.getElementById("planes"), w = innerWidth, h = innerHeight;
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  let s = 5; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const c = ["#F0A46B", "#5CC0B5", "#7C9CF0", "#E58C9A", null]; let o = "";
  for (let i = 0; i < 18; i++) { const z = 90 + r() * 260, x = r() * w, y = r() * h, a = r() * 60 - 30, k = c[i % 5];
    o += `<rect x="${x - z / 2}" y="${y - z * .4}" width="${z}" height="${z * (0.6 + r() * 0.6)}" transform="rotate(${a} ${x} ${y})" fill="${k || "none"}" fill-opacity="${k ? .06 + r() * .04 : 0}" stroke="#fff" stroke-opacity=".06"/>`; }
  svg.innerHTML = o;
})();
// #endregion [planes]

// #region [price] 値段はここ1か所だけで持つ（値下げしたら、この数字だけ変える）。HTML に数字を書かない。
// 特定商取引法の表記（tokushoho.html）・利用規約（terms.html）・Stripe の価格と揃える
const PRICE = 300;
document.querySelectorAll("[data-price]").forEach((el) => { el.textContent = "¥" + PRICE.toLocaleString(); });
// #endregion [price]

// #region [wipe] 見出しの塗り替え：見えたら左から濃い字で覆う
document.querySelectorAll(".wipe").forEach((h) => h.setAttribute("data-t", h.textContent.trim()));
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .4 });
document.querySelectorAll(".wipe").forEach((el) => io.observe(el));
// #endregion [wipe]

// #region [feature] Feature：左の項目を選ぶと、右の中身が切り替わる（矢印キーでも動く）
(function () {
  const tabs = [...document.querySelectorAll(".tablist button")], panels = [...document.querySelectorAll(".panel")];
  const pick = (i) => { tabs.forEach((t, k) => t.setAttribute("aria-selected", String(k === i))); panels.forEach((p, k) => p.classList.toggle("on", k === i)); };
  tabs.forEach((t, i) => { t.addEventListener("click", () => pick(i)); t.addEventListener("keydown", (e) => { if (e.key === "ArrowDown") { e.preventDefault(); tabs[(i + 1) % tabs.length].focus(); pick((i + 1) % tabs.length); } if (e.key === "ArrowUp") { e.preventDefault(); const j = (i + tabs.length - 1) % tabs.length; tabs[j].focus(); pick(j); } }); });
})();
// #endregion [feature]

// #region [planes-price] Price の暗い地にも板を敷く
(function () {
  const svg = document.getElementById("planes3"); if (!svg) return; const w = innerWidth, h = 640;
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`); svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
  let s = 13; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const c = ["#F0A46B", "#5CC0B5", "#7C9CF0", "#E58C9A", null]; let o = "";
  for (let i = 0; i < 12; i++) { const z = 80 + r() * 200, x = r() * w, y = r() * h, a = r() * 60 - 30, k = c[i % 5];
    o += `<rect x="${x - z / 2}" y="${y - z * .4}" width="${z}" height="${z * (0.6 + r() * 0.6)}" transform="rotate(${a} ${x} ${y})" fill="${k || "none"}" fill-opacity="${k ? .06 + r() * .04 : 0}" stroke="#fff" stroke-opacity=".06"/>`; }
  svg.innerHTML = o;
})();
// #endregion [planes-price]

// #region [planes-closing] 最後の案内：右側だけに、色から透明へ消える板（名刺の表と同じ考え方）
(function () {
  const svg = document.getElementById("planes4"); if (!svg) return; const w = 1440, h = 620;
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`); svg.setAttribute("preserveAspectRatio", "xMaxYMid slice");
  const cols = ["#F0A46B", "#5CC0B5", "#7C9CF0", "#E58C9A"]; let s = 21; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  let o = "<defs>" + cols.map((c, i) => `<linearGradient id="cg${i}" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity=".28"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient>`).join("") + "</defs>";
  for (let i = 0; i < 7; i++) { const z = 180 + r() * 260, x = w * (0.72 + r() * 0.34), y = r() * h, a = r() * 50 - 25;
    o += `<rect x="${x - z / 2}" y="${y - z * .4}" width="${z}" height="${z * (0.6 + r() * 0.5)}" rx="3" transform="rotate(${a} ${x} ${y})" fill="url(#cg${i % 4})"/>`; }
  svg.innerHTML = o;
})();
// #endregion [planes-closing]

// #region [header] ヘッダー：ヒーローの下端を越えたら白い帯にする。
// 対応環境の案内（device-notice）をヘッダーのすぐ下に置くため、ヘッダーの高さを CSS の --head-h へ渡す
(function () {
  const head = document.querySelector(".head"), hero = document.querySelector(".hero");
  const update = () => {
    head.classList.toggle("scrolled", window.scrollY > hero.offsetHeight - 80);
    document.documentElement.style.setProperty("--head-h", head.offsetHeight + "px");
  };
  addEventListener("scroll", update, { passive: true }); addEventListener("resize", update); update();
  head.addEventListener("transitionend", update);
})();
// #endregion [header]

// #region [illust] 線のイラスト：線ごとの長さ（--len）と描き始めのずれ（--d）を入れる。点線・点・チェック（.wk）は動かさない
document.querySelectorAll(".ill").forEach((svg) => {
  [...svg.querySelectorAll(":is(rect, circle, path):not(.dash):not(.af):not(.wk)")].forEach((el, i) => {
    el.style.setProperty("--len", Math.ceil(el.getTotalLength()) + 1);
    el.style.setProperty("--d", (i * 0.05).toFixed(2) + "s");
    el.classList.add("dr");
  });
});
// Flow のイラストは、見えたときに1回だけ線を引く
const illIo = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); illIo.unobserve(e.target); } }), { threshold: .35 });
document.querySelectorAll(".flow-step").forEach((el) => illIo.observe(el));
// #endregion [illust]

// #region [measure] 計測：CTA のクリックを GA4 に送る（イベント名は docs/LP再構成案_v1.0.14.md §5）。
// data-cta="trial" は体験版のダウンロード、"purchase" は Stripe へ進む購入。data-where は押した場所
document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-cta]"); if (!a || typeof gtag !== "function") return;
  const name = a.dataset.cta === "trial" ? "trial_download_click" : "purchase_cta_click";
  gtag("event", name, { cta_location: a.dataset.where || "" });
});
// #endregion [measure]
