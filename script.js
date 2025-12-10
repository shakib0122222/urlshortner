// ডাটা লোড
let links = JSON.parse(localStorage.getItem("pixguard_links") || "{}");
let totalVisitors = parseInt(localStorage.getItem("totalVisitors") || "0");

// ভিজিটর দেখানো
document.getElementById("visitorCount")?.textContent = totalVisitors;

// ছবির নাম
document.getElementById("imageUpload")?.addEventListener("change", function () {
  document.getElementById("fileInfo").textContent = this.files[0]?.name || "No file selected";
});

// জেনারেট বাটন
document.getElementById("generateBtn")?.addEventListener("click", function () {
  const content = document.getElementById("contentUrl").value.trim();
  const ads = document.getElementById("adsUrl").value.trim();
  const file = document.getElementById("imageUpload").files[0];

  if (!content || !ads || !file) {
    alert("সব ফিল্ড পূরণ করুন!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = e.target.result;
    const id = Math.random().toString(36).substr(2, 6).toUpperCase();

    // সঠিক ফুল URL তৈরি
    const origin = window.location.origin;
    const path = window.location.pathname;
    const dir = path.substring(0, path.lastIndexOf('/') + 1);
    const shortLink = origin + dir + "v.html?id=" + id;

    links[id] = { contentUrl: content, adsUrl: ads, imageData: img };
    localStorage.setItem("pixguard_links", JSON.stringify(links));

    document.getElementById("shortLink").value = shortLink;
    document.getElementById("result").style.display = "block";
  };
  reader.readAsDataURL(file);
});

function copyLink() {
  const el = document.getElementById("shortLink");
  el.select();
  navigator.clipboard.writeText(el.value);
  alert("কপি হয়েছে!");
}

// v.html এর কাজ
const params = new URLSearchParams(location.search);
const id = params.get("id");

if (id && links[id]) {
  totalVisitors++;
  localStorage.setItem("totalVisitors", totalVisitors);
  document.getElementById("visitorCount")?.textContent = totalVisitors;

  document.getElementById("previewImage").src = links[id].imageData;

  window.goToAds = () => window.open(links[id].adsUrl, "_blank");

  document.getElementById("continueBtn")?.addEventListener("click", () => {
    location.href = "success.html?id=" + id;
  });
}

// success.html এর কাজ
if (location.pathname.includes("success.html") && id && links[id]) {
  let clicks = 0;
  let time = 5;
  const timer = document.getElementById("timer");
  const btn = document.getElementById("getLinkBtn");
  const msg = document.getElementById("msg");

  const interval = setInterval(() => {
    time--;
    timer.textContent = time;
    if (time <= 0) {
      clearInterval(interval);
      btn.disabled = false;
      btn.textContent = "Get Link";
      btn.style.background = "#10b981";
      btn.style.color = "white";
    }
  }, 1000);

  btn.onclick = () => {
    if (clicks === 0) {
      window.open(links[id].adsUrl, "_blank");
      clicks++;
      msg.textContent = "এড দেখে ব্যাক করুন → আবার ক্লিক করুন";
      btn.textContent = "Final Link → Click";
    } else {
      location.href = links[id].contentUrl;
    }
  };
}
