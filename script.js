// links.json এ সেভ হবে {id: {content, ads, image, clicks}}
let links = {};

// Load from localStorage
if (localStorage.getItem("pixguard_links")) {
  links = JSON.parse(localStorage.getItem("pixguard_links"));
}

// Total visitor count
let totalVisitors = parseInt(localStorage.getItem("totalVisitors") || "0");
document.getElementById("visitorCount")?.textContent = totalVisitors;

// Index page - Generate link
document.getElementById("shortenBtn")?.addEventListener("click", () => {
  const contentUrl = document.getElementById("contentUrl").value.trim();
  const adsUrl = document.getElementById("adsUrl").value.trim();
  const file = document.getElementById("imageUpload").files[0];

  if (!contentUrl || !adsUrl || !file) {
    alert("All fields are required!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const imageData = e.target.result;
    const id = Math.random().toString(36).substr(2, 9); // র‍্যান্ডম শর্ট ID

    links[id] = { contentUrl, adsUrl, imageData, clicks: 0 };
    localStorage.setItem("pixguard_links", JSON.stringify(links));

    const shortLink = `${window.location.origin}${window.location.pathname}view.html?id=${id}`;
    document.getElementById("shortLink").value = shortLink;
    document.getElementById("result").classList.remove("hidden");
  }
  reader.readAsDataURL(file);
});

function copyLink() {
  const linkInput = document.getElementById("shortLink");
  linkInput.select();
  document.execCommand("copy");
  alert("Link copied!");
}

// View page logic
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

if (id && links[id]) {
  const data = links[id];
  totalVisitors++;
  localStorage.setItem("totalVisitors", totalVisitors);
  document.getElementById("visitorCount") && (document.getElementById("visitorCount").textContent = totalVisitors);

  document.getElementById("previewImage").src = data.imageData;

  window.goToAds = () => {
    window.location.href = data.adsUrl;
  };

  document.getElementById("continueBtn").onclick = () => {
    window.location.href = `success.html?id=${id}`;
  };
}

// Success page countdown
if (window.location.pathname.includes("success.html")) {
  const savedId = urlParams.get("id");
  const data = links[savedId];
  let clicks = 0;
  let time = 5;

  const timerEl = document.getElementById("timer");
  const btn = document.getElementById("getLinkBtn");
  const clickCountEl = document.getElementById("clickCount");

  const countdown = setInterval(() => {
    time--;
    timerEl.textContent = time;
    if (time <= 0) {
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
      btn.textContent = "Get Link Again (Final)";
    } else {
      window.location.href = data.contentUrl;
    }
  };
}
