let links = JSON.parse(localStorage.getItem("pixguard_links") || "{}");
let totalVisitors = parseInt(localStorage.getItem("totalVisitors") || "0");

// ভিজিটর দেখানো
document.getElementById("visitorCount").textContent = totalVisitors;

// ফাইল নাম দেখানো
document.getElementById("imageUpload").onchange = function() {
  const name = this.files[0] ? this.files[0].name : "No file selected";
  document.querySelector(".file-name").textContent = name;
};

// Generate Link
document.getElementById("shortenBtn").onclick = function() {
  const contentUrl = document.getElementById("contentUrl").value.trim();
  const adsUrl = document.getElementById("adsUrl").value.trim();
  const file = document.getElementById("imageUpload").files[0];

  if (!contentUrl || !adsUrl || !file) {
    alert("সব ফিল্ড পূরণ করুন!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const imageData = e.target.result;
    const id = Math.random().toString(36).substr(2, 6).toUpperCase();

    const base = location.origin + location.pathname.replace(/[^/]+$/, '');
    const shortLink = base + "v/" + id;

    links[id] = { contentUrl, adsUrl, imageData };
    localStorage.setItem("pixguard_links", JSON.stringify(links));

    document.getElementById("shortLink").value = shortLink;
    document.getElementById("result").classList.remove("hidden");
  };
  reader.readAsDataURL(file);
};

// কপি ফাংশন
function copyLink() {
  const input = document.getElementById("shortLink");
  input.select();
  navigator.clipboard.writeText(input.value);
  alert("কপি হয়েছে!");
}
