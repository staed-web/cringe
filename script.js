const container = document.getElementById("meme-container");

// Use free meme API: https://meme-api.com
const memeApi = "https://meme-api.com/random";

// Load more when user scrolls
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 600) {
    fetchMemes();
  }
});

// Start loading
fetchMemes();

async function fetchMemes() {
  try {
    const res = await fetch(memeApi);
    
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    
    const data = await res.json();

    // Create meme card
    const card = document.createElement("div");
    card.className = "meme-card";

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = data.title;
    card.appendChild(title);

    const img = document.createElement("img");
    img.src = data.url;
    img.alt = data.title;
    img.loading = "lazy";
    img.onerror = () => {
      img.src = "https://via.placeholder.com/500x300?text=Image+Failed";
    };
    card.appendChild(img);

    container.appendChild(card);

    // Insert ad every 3rd meme
    if (container.children.length % 3 === 0) {
      const ad = document.createElement("div");
      ad.className = "ad-unit";
      ad.innerHTML = "[ GOOGLE ADSENSE WILL GO HERE ]";
      container.appendChild(ad);
    }

  } catch (err) {
    console.error("Error fetching meme:", err);
    
    const errorDiv = document.createElement("div");
    errorDiv.style.color = "red";
    errorDiv.style.textAlign = "center";
    errorDiv.style.padding = "1rem";
    errorDiv.innerHTML = `
      <strong>❌ Failed to load meme</strong><br>
      Try again later or check your internet.
    `;
    container.appendChild(errorDiv);
  }
}