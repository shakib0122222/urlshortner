// pixguard – Full Updated script.js (2025 Version)

let links = JSON.parse(localStorage.getItem("pixguard_links") || "{}");
let totalVisitors = parseInt(localStorage.getItem("totalVisitors") || "0");

// সব পেজে টোটাল ভিজিটর দেখানো
document.addEventListener("DOMContentLoaded", () => {
  const counter = document.getElementById("visitorCount");
  if (counter) counter.textContent = totalVisitors;
});

// ============= INDEX PAGE – লিংক জেনারেট =============
if (document.getElementById("shortenBtn")) {
  document.getElementById("shortenBtn").addEventListener("click", () => {
    const contentUrl = document.getElementById("contentUrl").value.trim();
    const adsUrl = document.getElementById("adsUrl").value.trim();
    const fileInput = document.getElementById("imageUpload");

    if (!contentUrl || !adsUrl || fileInput.files.length === 0) {
      alert("সব ফিল্ড পূরণ করুন!");
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      const imageData = e.target.result;

      // ৬ অক্ষরের সুপার শর্ট ID (বড় হাতের)
      const id = Math.random().toString(36).substr(2, 6).toUpperCase();

      // লিংক হবে → https://yoursite.com/v/AB12XY
      const baseUrl = window.location.origin + window.location.pathname;
      const cleanBase = baseUrl.replace(/index\.html.*$/i, '');
      const shortLink = `${cleanBase}v/${id}`;

      // ডাটা সেভ
      links[id] = {
        contentUrl: contentUrl,
        adsUrl: adsUrl,
        imageData: imageData,
        created: new Date().toISOString()
      };

      localStorage.setItem("pixguard_links", JSON.stringify(links));

      // রেজাল্ট দেখানো
      document.getElementById("shortLink").value = shortLink;
      document.getElementById("result").classList.remove("hidden");
    };

    reader.readAsDataURL(fileInput.files[0]);
  });
}

// কপি বাটন
function copyLink() {
  const linkInput = document.getElementById("shortLink");
  linkInput.select();
  linkInput.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(linkInput.value);
  alert("লিংক কপি হয়েছে!");
}

// ============= VIEW PAGE (v.html) =============
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (id && links[id] && (window.location.pathname.includes("v/") || window.location.pathname.includes("v.html"))) {
  const data = links[id];

  // ভিজিটর কাউন্ট বাড়াও
  totalVisitors++;
  localStorage.setItem("totalVisitors", totalVisitors);
  document.getElementById("visitorCount") && (document.getElementById("visitorCount").textContent = totalVisitors);

  // ছবি দেখাও
  document.getElementById("previewImage").src = data.imageData;

  // সব বাটন এডস-এ নিয়ে যাক
  window.goToAds = () => {
    window.open(data.adsUrl, "_blank");
  };

  // Continue → Success পেজ
  document.getElementById("continueBtn").onclick = () => {
    window.location.href = `success.html?id=${id}`;
  };
}

// ============= SUCCESS PAGE (5 সেকেন্ড কাউন্টডাউন) =============
if (window.location.pathname.includes("success.html") && id && links[id]) {
  const data = links[id];
  let clicks = 0;

  const timerEl = document.getElementById("timer");
  const btn = document.getElementById("getLinkBtn");
  const clickCountEl = document.getElementById("clickCount");

  let timeLeft = 5;
  const countdown = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(countdown);
      btn.disabled = false;
      btn.classList.add("enabled");
      btn.textContent = "Get Link";
    }
  }, 1000);

  btn.onclick = () => {
    if (clicks === 0) {
      window.open(data.adsUrl, "_blank");
      clicks++;
      clickCountEl.textContent = `You clicked Get Link ${clicks} time${clicks > 1 ? 's' : ''}`;
      btn.textContent = "Click Again → Final Link";
    } else {
      window.location.href = data.contentUrl;
    }
  };
}
