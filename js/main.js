/* ===== À MODIFIER ===== */
// Liens des réseaux (laisse "" pour masquer le bouton)
var LINKS = {
  discord:   "",
  instagram: "",
  twitter:   "",
  youtube:   "",
  github:    ""
};
// Adresse qui reçoit les e-mails (ex. Formspree : "https://formspree.io/f/xxxxxxx").
// Tant qu'elle est vide, le formulaire refuse l'inscription pour ne perdre aucun e-mail.
var FORM_ENDPOINT = "https://formspree.io/f/xvkkbykv";
/* ====================== */

var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var $ = function (id) { return document.getElementById(id); };

// Intro (une seule fois par session)
var intro = $("intro");
function closeIntro() {
  intro.classList.add("done");
  try { sessionStorage.setItem("utsuku-intro", "1"); } catch (e) {}
}
var seen = false;
try { seen = sessionStorage.getItem("utsuku-intro") === "1"; } catch (e) {}
if (seen || reduce) intro.style.display = "none"; else setTimeout(closeIntro, 2600);
$("skip").addEventListener("click", closeIntro);

// Étoiles
var stars = $("stars"), sh = "";
for (var s = 0; s < 55; s++) {
  sh += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;top:' + (Math.random() * 100).toFixed(1) +
        '%;--t:' + (3 + Math.random() * 5).toFixed(1) + 's;--d:-' + (Math.random() * 8).toFixed(1) + 's"></i>';
}
stars.innerHTML = sh;

// Bandeau défilant
var words = ["UTSUKU", "Bientôt", "Prépare-toi", "Très bientôt"], row = "";
for (var r = 0; r < 4; r++) for (var w = 0; w < words.length; w++) row += "<span>" + words[w] + "</span>";
$("track").innerHTML = row + row;

// Réseaux sociaux
var ICONS = { discord: "lni-discord", instagram: "lni-instagram-original", twitter: "lni-twitter-filled", youtube: "lni-youtube", github: "lni-github-original" };
function addSocial(parent, key, url) {
  var a = document.createElement("a");
  a.className = "icon-btn"; a.href = url; a.target = "_blank"; a.rel = "noopener";
  a.setAttribute("aria-label", key);
  a.innerHTML = '<i class="lni ' + ICONS[key] + '"></i>';
  parent.appendChild(a);
}
Object.keys(LINKS).forEach(function (k) {
  if (!LINKS[k]) return;
  addSocial($("social"), k, LINKS[k]);
  addSocial($("contact-links"), k, LINKS[k]);
});

// Bouton « Me prévenir » : remonte au formulaire et active le champ
document.querySelectorAll("[data-focus-email]").forEach(function (a) {
  a.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    setTimeout(function () { $("email").focus({ preventScroll: true }); }, reduce ? 0 : 450);
  });
});

// Formulaire
var form = $("signup"), msg = $("form-msg");
function say(text, type) { msg.textContent = text; msg.className = "form-msg " + (type || ""); }
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (form.website.value) return; // piège anti-robots
  if (!form.checkValidity()) { say("Entre une adresse e-mail valide.", "err"); return; }
  if (!FORM_ENDPOINT) {
    console.error("UTSUKU : renseigne FORM_ENDPOINT dans js/main.js pour recevoir les e-mails.");
    say("Les inscriptions ne sont pas encore ouvertes. Reviens vite !", "err");
    return;
  }
  var btn = form.querySelector("button"); btn.disabled = true; say("Envoi…");
  fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ email: form.email.value.trim() })
  }).then(function (res) {
    if (!res.ok) throw new Error(res.status);
    form.reset(); say("Merci ! Tu seras prévenu dès l’ouverture.", "ok");
  }).catch(function () {
    say("Envoi impossible pour le moment. Réessaie dans un instant.", "err");
  }).then(function () { btn.disabled = false; });
});

// Apparition au scroll
var items = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  var io = new IntersectionObserver(function (en) {
    en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
  }, { threshold: .15 });
  items.forEach(function (el) { io.observe(el); });
} else items.forEach(function (el) { el.classList.add("in"); });

$("year").textContent = new Date().getFullYear();
