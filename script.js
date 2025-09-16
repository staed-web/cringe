const container = document.getElementById("meme-container");

// GIPHY Public Beta Key (free, works for all)
const apiKey = "dc6zaTOxFJmzC"; // GIPHY's public API key (widely used, no auth needed)

// Search terms for "cringe" content
const queries = [
  "cringe",
  "awkward moment",
  "secondhand embarrassment",
  "teenager fail",
  "facebook cringe",
  "embarrassing"
];

// Pick random query
const query = queries[Math.floor(Math.random() * queries.length)];

// GIPHY Random Endpoint
const apiUrl = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=${encodeURIComponent(query)}&rating=g&lang=en`;

// Load more when user scrolls
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 600) {
    fetchMeme();
  }
});

// Load first meme on open
fetchMeme();

async function fetchMeme() {
  try {
    const res = await fetch(apiUrl);
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    
    if (!data.data || !data.data.images) return;

    const gifUrl = data.data.images.original.url; // Get GIF or MP4
    const title = data.data.title || query.toUpperCase();

    // Create meme card
    const card = document.createElement("div");
    card.className = "meme-card";

    const titleEl = document.createElement("div");
    titleEl.className = "title";
    titleEl.textContent = title;
    card.appendChild(titleEl);

    // Create video/image based on type
    const isVideo = gifUrl.endsWith(".mp4");

    if (isVideo) {
      const video = document.createElement("video");
      video.src = gifUrl;
      video.loop = true;
      video.autoplay = true;
      video.muted = true;
      video.playsInline = true;
      video.loading = "lazy";
      video.style.width = "100%";
      video.style.borderRadius = "8px";
      card.appendChild(video);
    } else {
      const img = document.createElement("img");
      img.src = gifUrl;
      img.alt = title;
      img.loading = "lazy";
      img.onerror = () => {
        img.src = "https://via.placeholder.com/500x300?text=Failed+to+load+meme";
      };
      card.appendChild(img);
    }

    container.appendChild(card);

    // Insert ad every 3rd item
    if (container.children.length % 3 === 0) {
      const ad = document.createElement("div");
      ad.className = "ad-unit";
      ad.innerHTML = "[ GOOGLE ADSENSE WILL GO HERE ]";
      container.appendChild(ad);
    }

  } catch (err) {
    console.error("Error fetching from GIPHY:", err);

    const errorDiv = document.createElement("div");
    errorDiv.style.color = "red";
    errorDiv.style.textAlign = "center";
    errorDiv.style.padding = "1rem";
    errorDiv.innerHTML = `
      <strong>❌ Failed to load meme</strong><br>
      Trying again...
    `;
    container.appendChild(errorDiv);

    // Retry after 2 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) errorDiv.remove();
      fetchMeme();
    }, 2000);
  }
}