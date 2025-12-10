const shortenBtn = document.getElementById('shortenBtn');
const resultDiv = document.getElementById('result');
const shortLinkInput = document.getElementById('shortLink');
const totalVisitsSpan = document.getElementById('totalVisits');

function generateId() {
  return Math.random().toString(36).substr(2, 8);
}

shortenBtn.onclick = () => {
  const contentUrl = document.getElementById('contentUrl').value.trim();
  const adUrl = document.getElementById('adUrl').value.trim();
  const file = document.getElementById('imageUpload').files[0];

  if (!contentUrl || !adUrl || !file) {
    alert("সবগুলো ফিল্ড পূরণ করুন!");
    return;
  }

  shortenBtn.disabled = true;
  shortenBtn.textContent = "Creating...";

  const id = generateId();
  const storageRef = storage.ref('images/' + id);
  storageRef.put(file).then(snapshot => {
    return snapshot.ref.getDownloadURL();
  }).then(imageUrl => {
    const linkData = {
      contentUrl,
      adUrl,
      imageUrl,
      visits: 0,
      createdAt: Date.now()
    };

    return db.ref('links/' + id).set(linkData);
  }).then(() => {
    const shortUrl = `${window.location.origin}/v.html?id=${id}`;
    shortLinkInput.value = shortUrl;
    resultDiv.classList.remove('hidden');
    shortenBtn.disabled = false;
    shortenBtn.textContent = "Create Short Link";
  }).catch(err => {
    alert("Error: " + err.message);
    shortenBtn.disabled = false;
    shortenBtn.textContent = "Create Short Link";
  });
};

function copyLink() {
  shortLinkInput.select();
  document.execCommand('copy');
  alert("লিংক কপি হয়েছে!");
}

// রিয়েল টাইম টোটাল ভিজিটর
db.ref('totalVisits').on('value', snap => {
  totalVisitsSpan.textContent = snap.val() || 0;
});
