const MODELS = {
  "Samsung": ["Galaxy A03","Galaxy A04","Galaxy A04s","Galaxy A05","Galaxy A05s","Galaxy A06","Galaxy A12","Galaxy A13","Galaxy A14","Galaxy A15","Galaxy A24","Galaxy A25","Galaxy A34","Galaxy A35","Galaxy A54","Galaxy S21","Galaxy S22","Galaxy S23","Galaxy S24"],
  "Tecno": ["Spark 8","Spark 10","Spark 20","Camon 19","Camon 20","Pova 4","Pova 5","Pova 6"],
  "Infinix": ["Hot 10","Hot 11","Hot 12","Hot 20","Hot 30","Hot 40","Note 12","Note 30","Zero 30"],
  "Itel": ["A56","A60","P40","P55","S23","Vision 3"],
  "Xiaomi": ["Redmi 9A","Redmi 10","Redmi 12","Redmi 13C","Redmi Note 11","Redmi Note 12","Redmi Note 13","Poco X5","Poco X6","Poco F5"],
  "Apple": ["iPhone 8","iPhone X","iPhone 11","iPhone 12","iPhone 13","iPhone 14","iPhone 15"],
  "Oppo": ["A15","A17","A38","A57","A78","Reno 8","Reno 10"],
  "Vivo": ["Y01","Y15","Y21","Y22","Y36","V25","V29"],
  "Huawei": ["Y6","Y7a","Y9a","P30","Nova 9"],
  "Motorola": ["Moto E13","Moto G14","Moto G23","Moto G54","Edge 40"],
  "Realme": ["C11","C21","C33","C55","Narzo 50","Realme 11","GT Neo 5"],
  "OnePlus": ["Nord N20","Nord CE 3","OnePlus 9","OnePlus 11","OnePlus 12"],
  "Google": ["Pixel 6","Pixel 7","Pixel 8"]
};

// Bases par puissance : Général, Point rouge, Lunette 2X, Lunette 4X, Sniper/AWM, Vue libre
const LABELS = ["Général","Point rouge","Lunette 2X","Lunette 4X","Sniper / AWM","Vue libre"];
const BASE = {
  low:  [188,181,173,160,80,130],
  mid:  [193,187,180,166,84,134],
  high: [197,193,186,172,90,140]
};
// Ajustements selon le style de jeu
const STYLE = {
  rush: [3,4,2,1,-6,3],
  head: [2,2,2,2,2,2],
  bal:  [0,0,0,0,0,0]
};
const POWER_NAME = {low:"Entrée de gamme",mid:"Milieu de gamme",high:"Haut de gamme"};

const $ = id => document.getElementById(id);
const brand = $("brand"), model = $("model"), power = $("power"), style = $("style");
let current = [];

brand.innerHTML = ["Toutes les marques", ...Object.keys(MODELS)]
  .map(b => `<option>${b}</option>`).join("");
brand.value = "Samsung";

function fillModels(){
  const list = brand.value === "Toutes les marques" ? Object.values(MODELS).flat() : MODELS[brand.value];
  $("models").innerHTML = list.map(m => `<option value="${m}">`).join("");
}
brand.addEventListener("change", () => { model.value = ""; fillModels(); });
fillModels();
model.value = "Galaxy A05";

function generate(){
  const vals = BASE[power.value].map((v,i) => Math.max(0, Math.min(200, v + STYLE[style.value][i])));
  current = vals;
  const name = model.value.trim() || "Modèle générique";
  const b = brand.value === "Toutes les marques" ? "Générique" : brand.value;
  $("sub").textContent = `${b} • ${name} • ${POWER_NAME[power.value]}`;
  $("list").innerHTML = vals.map((v,i) =>
    `<div class="item"><span>${LABELS[i]}</span><b>${v}</b><div class="bar"><i data-w="${v/2}"></i></div></div>`).join("");
  $("result").hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() =>
    document.querySelectorAll(".bar i").forEach(e => e.style.width = e.dataset.w + "%")));
  $("result").scrollIntoView({behavior:"smooth", block:"start"});
}

function toast(msg){
  const t = $("toast"); t.textContent = msg; t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 1800);
}

$("generate").addEventListener("click", generate);

$("copy").addEventListener("click", async () => {
  const text = `Free Fire Sensi Pro\n${$("sub").textContent}\n` +
    current.map((v,i) => `${LABELS[i]} : ${v}`).join("\n");
  try { await navigator.clipboard.writeText(text); }
  catch {
    const ta = document.createElement("textarea"); ta.value = text;
    document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
  }
  toast("Sensibilités copiées ✔");
});

$("reset").addEventListener("click", () => {
  brand.value = "Samsung"; fillModels(); model.value = "";
  power.value = "mid"; style.value = "rush";
  $("result").hidden = true;
  window.scrollTo({top:0, behavior:"smooth"});
});
