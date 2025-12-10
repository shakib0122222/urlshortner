let links = JSON.parse(localStorage.getItem("pixguard_links") || "{}");
let totalVisitors = parseInt(localStorage.getItem("totalVisitors") || "0");

// ভিজিটর কাউন্ট
const vCount = document.getElementById("visitorCount");
if(vCount) vCount.textContent = totalVisitors;

// ফাইল নাম দেখানো
const fileInput = document.getElementById("imageUpload");
if(fileInput) && (fileInput.onchange = () => {
  const name = fileInput.files[0] ? fileInput.files[0].name : "No file chosen";
  document.querySelector(".file-name").textContent = name;
});

// ===== INDEX PAGE – লিংক জেনারেট =====
const shortenBtn = document.getElementById("shortenBtn");
if(shortenBtn){
  shortenBtn.onclick = () => {
    const cUrl = document.getElementById("contentUrl").value.trim();
    const aUrl = document.getElementById("adsUrl").value.trim();
    const file = fileInput.files[0];

    if(!cUrl || !aUrl || !file){
      alert("সব ফিল্ড পূরণ করুন!"); return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      const img = e.target.result;
      const id = Math.random().toString(36).substr(2,6).toUpperCase();

      // পুরো ডোমেইনসহ লিংক
      const fullUrl = window.location.origin + window.location.pathname;
      const basePath = fullUrl.substring(0, fullUrl.lastIndexOf("/") + 1);
      const shortLink = basePath + "v.html?id=" + id;

      links[id] = {contentUrl: cUrl, adsUrl: aUrl, imageData: img};
      localStorage.setItem("pixguard_links", JSON.stringify(links));

      document.getElementById("shortLink").value = shortLink;
      document.getElementById("result").style.display = "block";
    };
    reader.readAsDataURL(file);
  };
}

function copyLink(){
  const inp = document.getElementById("shortLink");
  inp.select();
  navigator.clipboard.writeText(inp.value);
  alert("কপি হয়েছে!");
}

// ===== VIEW PAGE (v.html) =====
const params = new URLSearchParams(location.search);
const id = params.get("id");

if(id && links[id]){
  totalVisitors++;
  localStorage.setItem("totalVisitors", totalVisitors);
  if(vCount) vCount.textContent = totalVisitors;

  document.getElementById("previewImage").src = links[id].imageData;

  window.goToAds = () => window.open(links[id].adsUrl, "_blank");

  document.getElementById("continueBtn").onclick = () => {
    location.href = "success.html?id=" + id;
  };
}

// ===== SUCCESS PAGE =====
if(location.pathname.includes("success.html") && id && links[id]){
  let clicks = 0;
  let time = 5;
  const timer = document.getElementById("timer");
  const btn = document.getElementById("getLinkBtn");
  const msg = document.getElementById("msg");

  const countdown = setInterval(() => {
    time--;
    timer.textContent = time;
    if(time <= 0){
      clearInterval(countdown);
      btn.disabled = false;
      btn.textContent = "Get Link";
      btn.style.background = "#10b981";
      btn.style.color = "white";
    }
  }, 1000);

  btn.onclick = () => {
    if(clicks === 0){
      window.open(links[id].adsUrl, "_blank");
      clicks++;
      msg.textContent = "এড দেখে ব্যাক করুন → আবার চাপুন";
      btn.textContent = "Click Again → Final Link";
    } else {
      location.href = links[id].contentUrl;
    }
  };
}
