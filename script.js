const container = document.getElementById("meme-container");
let after = "";
const subreddits = ["cringetopia", "teenagers", "Hellpagedesign", "facebookstories"];
const chosenSub = subreddits[Math.floor(Math.random() * subreddits.length)];

// Show debug message
console.log("App started. Loading memes from:", chosenSub);

// Add error fallback
function showError() {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error";
  errorDiv.innerHTML = `
    <p style="color: red; font-size: 1.2rem;">⚠️ Failed to load memes.</p>
    <p>Check your internet connection or try again later.</p>
    <p><small>API may be blocked in your region.</small></p>
  `;
  container.appendChild(errorDiv);
}

// Load more when user scrolls
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 600) {
    fetchMemes();
  }
});

// Try to load first batch
fetchMemes();

async function fetchMemes() {
  try {
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 sec timeout

    const res = await fetch(`https://www.reddit.com/r/${chosenSub}/hot.json?limit=10&after=${after}`, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const json = await res.json();
    
    const posts = json.data.children;
    after = json.data.after;

    if (posts.length === 0) {
      console.warn("No posts found.");
      return;
    }

    posts.forEach((postObj, index) => {
      const post = postObj.data;

      // Skip non-image posts
      try {
        const url = new URL(post.url);
        if (!["i.redd.it", "v.redd.it"].includes(url.hostname)) return;
      } catch (e) {
        return;
      }

      // Create meme card
      const card = document.createElement("div");
      card.className = "meme-card";

      const title = document.createElement("div");
      title.className = "title";
      title.textContent = post.title.length > 120 ? post.title.slice(0, 120) + "..." : post.title;
      card.appendChild(title);

      const img = document.createElement("img");
      img.src = post.url;
      img.alt = "Cringe Meme";
      img.loading = "lazy";
      img.onerror = () => {
        console.error("Image failed to load:", post.url);
        img.src = "https://via.placeholder.com/500x300?text=Image+Failed";
      };
      card.appendChild(img);

      container.appendChild(card);

      // Insert ad every 3rd meme
      if ((index + 1) % 3 === 0) {
        const ad = document.createElement("div");
        ad.className = "ad-unit";
        ad.innerHTML = "[ GOOGLE ADSENSE WILL GO HERE ]";
        container.appendChild(ad);
      }
    });
  } catch (err) {
    console.error("Error fetching memes:", err);
    showError(); // Show error message
  }
}
