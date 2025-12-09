let links = JSON.parse(localStorage.getItem("pixguard_links") || "{}");
let totalVisitors = parseInt(localStorage.getItem("totalVisitors") || "0");

// ভিজিটর দেখানো
const vCount = document.getElementById("visitorCount");
if(vCount) vCount.textContent = totalVisitors;

// ফাইল নাম
const fileInput = document.getElementById("imageUpload");
if(fileInput){
  fileInput.onchange = () => {
    const name = fileInput.files[0] ? fileInput.files[0].name : "No file chosen";
    document.querySelector(".file-name").textContent = name;
  };
}

// Generate Link
const btn = document.getElementById("shortenBtn");
if(btn){
  btn.onclick = () => {
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
      const base = location.origin + location.pathname.replace(/[^/]*$/)[0] ? location.pathname.slice(0, -location.pathname.split('/').pop().length) : location.pathname;
      const short = `${base}v.html?id=${id}`;

      links[id] = {contentUrl: cUrl, adsUrl: aUrl, imageData: img};
      localStorage.setItem("pixguard_links", JSON.stringify(links));

      document.getElementById("shortLink").value = short;
      document.getElementById("result").style.display = "block";
    };
    reader.readAsDataURL(file);
  };
}

function copyLink(){
  const input = document.getElementById("shortLink");
  input.select();
  navigator.clipboard.writeText(input.value);
  alert("কপি হয়েছে!");
}

// View page logic (v.html)
const params = new URLSearchParams(location.search);
const id = params.get("id");
if(id && links[id]){
  totalVisitors++;
  localStorage.setItem("totalVisitors", totalVisitors);
  if(vCount) vCount.textContent = totalVisitors;

  document.getElementById("previewImage").src = links[id].imageData;

  window.goToAds = () => window.open(links[id].adsUrl, "_blank");

  document.getElementById("continueBtn").onclick = () => {
    location.href = `success.html?id=${id}`;
  };
}

// Success page countdown
if(location.pathname.includes("success.html") && id && links[id]){
  let clicks = 0;
  let time = 5;
  const timer = document.getElementById("timer");
  const btn = document.getElementById("getLinkBtn");

  const interval = setInterval(() => {
    time--;
    timer.textContent = time;
    if(time <= 0){
      clearInterval(interval);
      btn.disabled = false;
      btn.textContent = "Get Link";
    }
  }, 1000);

  btn.onclick = () => {
    if(clicks === 0){
      window.open(links[id].adsUrl, "_blank");
      clicks++;
      btn.textContent = "Click Again → Final Link";
    } else {
      location.href = links[id].contentUrl;
    }
  };
}
