// localStorage থেকে ডাটা লোড
let links = JSON.parse(localStorage.getItem("pixguard_links") || "{}");
let totalVisitors = parseInt(localStorage.getItem("totalVisitors") || "0");

// টোটাল ভিজিটর দেখানো (সব পেজে)
document.addEventListener("DOMContentLoaded", () => {
  const counter = document.getElementById("visitorCount");
  if (counter) counter.textContent = totalVisitors;
});

// ============= INDEX PAGE =============
if (document.getElementById("shortenBtn")) {
  document.getElementById("shortenBtn").addEventListener("click", () => {
    const contentUrl = document.getElementById("contentUrl").value.trim();
    const adsUrl = document.getElementById("adsUrl").value.trim();
    const fileInput = document.getElementById("imageUpload");

    if (!contentUrl || !adsUrl || !fileInput.files[0]) {
      alert("সবগুলো ফিল্ড পূরণ করুন!");
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      const imageData = e.target.result;
      const id = Math.random().toString(36).substr(2, 9);

      links[id] = {
        contentUrl: contentUrl,
        adsUrl: adsUrl,
        imageData: imageData,
        created: new Date().toISOString()
      };

      // সেভ করি
      localStorage.setItem("pixguard_links", JSON.stringify(links));

      // শর্ট লিংক তৈরি
      const shortLink = `${window.location.origin}${window.location.pathname.replace("index.html","")}view.html?id=${id}`;
      
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

// ============= VIEW PAGE =============
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (id && links[id] && window.location.pathname.includes("view.html")) {
  const data = links[id];

  // ভিজিটর কাউন্ট
  totalVisitors++;
  localStorage.setItem("totalVisitors", totalVisitors);

  // ছবি দেখানো
  document.getElementById("previewImage").src = data.imageData;

  // সব জাল বাটন এডস-এ নিয়ে যাবে
  window.goToAds = () => {
    window.open(data.adsUrl, "_blank");
  };

  // কন্টিনিউ বাটন → সাকসেস পেজ
  document.getElementById("continueBtn").onclick = () => {
    window.location.href = `success.html?id=${id}`;
  };
}

// ============= SUCCESS PAGE =============
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
