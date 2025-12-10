let links = JSON.parse(localStorage.getItem("pixguard_links") || "{}");
let totalVisitors = parseInt(localStorage.getItem("totalVisitors") || "0");

// ভিজিটর কাউন্ট
document.getElementById("visitorCount")?.textContent = totalVisitors;

// ছবির নাম দেখানো
const imageInput = document.getElementById("imageUpload");
if(imageInput){
  imageInput.addEventListener("change", () => {
    const fileName = imageInput.files[0] ? imageInput.files[0].name : "No file selected";
    document.getElementById("fileInfo").textContent = fileName;
  });
}

// জেনারেট বাটন
document.getElementById("generateBtn")?.addEventListener("click", () => {
  const contentUrl = document.getElementById("contentUrl").value.trim();
  const adsUrl = document.getElementById("adsUrl").value.trim();
  const file = imageInput?.files[0];

  if(!contentUrl || !adsUrl || !file){
    alert("সব ফিল্ড পূরণ করুন!");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const imgData = e.target.result;
    const id = Math.random().toString(36).substr(2,6).toUpperCase();

    // পুরো ডোমেইনসহ লিংক
    const path = window.location.pathname;
    const base = window.location.href.substring(0, window.location.href.length - path.length + path.lastIndexOf("/") + 1);
    const shortLink = base + "v.html?id=" + id;

    links[id] = {contentUrl, adsUrl, imageData: imgData};
    localStorage.setItem("pixguard_links", JSON.stringify(links));

    document.getElementById("shortLink").value = shortLink;
    document.getElementById("result").style.display = "block";
    document.getElementById("result").scrollIntoView({behavior:"smooth"});
  };
  reader.readAsDataURL(file);
});

function copyLink(){
  const el = document.getElementById("shortLink");
  el.select();
  navigator.clipboard.writeText(el.value);
  alert("কপি হয়েছে!");
}

// v.html লজিক
const params = new URLSearchParams(location.search);
const id = params.get("id");

if(id && links[id]){
  totalVisitors++;
  localStorage.setItem("totalVisitors", totalVisitors);
  document.getElementById("visitorCount")?.textContent = totalVisitors;

  document.getElementById("previewImage").src = links[id].imageData;

  window.goToAds = () => window.open(links[id].adsUrl, "_blank");

  document.getElementById("continueBtn")?.addEventListener("click", () => {
    location.href = "success.html?id=" + id;
  });
}

// success.html লজিক
if(location.pathname.includes("success.html") && id && links[id]){
  let clicks = 0;
  let time = 5;
  const timer = document.getElementById("timer");
  const btn = document.getElementById("getLinkBtn");
  const msg = document.getElementById("msg");

  const cd = setInterval(() => {
    time--;
    timer.textContent = time;
    if(time <= 0){
      clearInterval(cd);
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
      btn.textContent = "Final Link → Click Here";
    } else {
      location.href = links[id].contentUrl;
    }
  }
}
