const container = document.getElementById("meme-container");

// Public GIPHY API key (works for everyone)
const apiKey = "dc6zaTOxFJmzC";

// Cringe search terms
const tags = [
  "cringe",
  "awkward",
  "secondhand embarrassment",
  "teen fail",
  "embarrassing moment",
  "why did I do that",
  "social anxiety"
];

// Pick random tag
function getRandomTag() {
  return tags[Math.floor(Math.random() * tags.length)];
}

// GIPHY Random URL
function getGiphyUrl() {
  const tag = encodeURIComponent(getRandomTag());
  return `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=${tag}&rating=g&lang=en`;
}

// Load more when scrolling
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 600) {
    fetchMemeWithRetry();
  }
});

// Start loading immediately
fetchMemeWithRetry();

// Auto-retry every 2 seconds if failed
async function fetchMemeWithRetry() {
  let attempts = 0;
  while (attempts < 100) { // Infinite loop (safe because async)
    try {
      const res = await fetch(getGiphyUrl(), {
        method: 'GET',
        cache: 'no-cache'
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      if (!data.data || !data.data.images) {
        throw new Error("No data returned");
      }

      const gif = data.data;
      const imageUrl = gif.images.original.url;
      const title = gif.title || `${getRandomTag().toUpperCase()} Moment`;

      // Create and display meme
      const card = document.createElement("div");
      card.className = "meme-card";

      const titleEl = document.createElement("div");
      titleEl.className = "title";
      titleEl.textContent = title;
      card.appendChild(titleEl);

      const img = document.createElement("img");
      img.src = imageUrl + "&t=" + Date.now(); // Unique URL
      img.alt = title;
      img.loading = "lazy";
      img.onerror = () => {
        img.src = "https://via.placeholder.com/500x300?text=Failed+to+load+meme";
      };
      card.appendChild(img);

      container.appendChild(card);

      // Insert ad every 3rd item
      if (container.children.length % 3 === 0) {
        const ad = document.createElement("div");
        ad.className = "ad-unit";
        ad.innerHTML = "[ GOOGLE ADSENSE WILL GO HERE ]";
        container.appendChild(ad);
      }

      return; // Success → stop retrying

    } catch (err) {
      console.warn("Attempt failed:", err.message);
      attempts++;

      // Show loading indicator only once
      if (attempts === 1 && document.querySelectorAll(".loading").length === 0) {
        const loader = document.createElement("div");
        loader.className = "loading";
        loader.id = "auto-retry-loader";
        loader.innerHTML = "🔁 Fetching cringe... trying again...";
        container.appendChild(loader);
      }

      // Wait 2 seconds before retry
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // If all attempts fail (very rare)
  const errorDiv = document.createElement("div");
  errorDiv.style.color = "yellow";
  errorDiv.style.textAlign = "center";
  errorDiv.style.padding = "1rem";
  errorDiv.innerHTML = "⏳ Still loading... keep this tab open.";
  container.appendChild(errorDiv);
}