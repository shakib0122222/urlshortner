let links = JSON.parse(localStorage.getItem("pixguard_links") || "{}");
let totalVisitors = parseInt(localStorage.getItem("totalVisitors") || "0");

// ভিজিটর দেখানো
document.getElementById("visitorCount")?.textContent = totalVisitors;

// ছবির নাম দেখানো
document.getElementById("imageUpload")?.addEventListener("change", function(){
  const name = this.files[0] ? this.files[0].name : "No file selected";
  document.getElementById("fileName").textContent = name;
});

// ====== GENERATE LINK ======
document.getElementById("generateBtn")?.addEventListener("click", function(){
  const contentUrl = document.getElementById("contentUrl").value.trim();
  const adsUrl = document.getElementById("adsUrl").value.trim();
  const file = document.getElementById("imageUpload").files[0];

  if(!contentUrl || !adsUrl || !file){
    alert("সবকিছু পূরণ করুন!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e){
    const img = e.target.result;
    const id = Math.random().toString(36).substr(2,6).toUpperCase();

    // পুরো ডোমেইনসহ লিংক
    const shortLink = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/") + 1) + "v.html?id=" + id;

    links[id] = {contentUrl, adsUrl, imageData: img};
    localStorage.setItem("pixguard_links", JSON.stringify(links));

    document.getElementById("shortLink").value = shortLink;
    document.getElementById("result").style.display = "block";
  };
  reader.readAsDataURL(file);
});

function copyLink(){
  const input = document.getElementById("shortLink");
  input.select();
  navigator.clipboard.writeText(input.value);
  alert("কপি হয়েছে!");
}

// ====== VIEW PAGE (v.html) ======
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

if(id && links[id]){
  totalVisitors++;
  localStorage.setItem("totalVisitors", totalVisitors);
  document.getElementById("visitorCount")?.textContent = totalVisitors;

  document.getElementById("previewImage").src = links[id].imageData;

  window.goToAds = () => window.open(links[id].adsUrl, "_blank");

  document.getElementById("continueBtn").onclick = () => {
    window.location = "success.html?id=" + id;
  };
}

// ====== SUCCESS PAGE ======
if(window.location.pathname.includes("success.html") && id && links[id]){
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
      msg.textContent = "এড দেখে Back করুন → আবার ক্লিক করুন";
      btn.textContent = "Click Again → Final Link";
    } else {
      window.location.href = links[id].contentUrl;
    }
  };
}
