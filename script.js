const container = document.getElementById("meme-container");
let after = "";
const subreddits = ["cringetopia", "teenagers", "Hellpagedesign", "facebookstories"];
const chosenSub = subreddits[Math.floor(Math.random() * subreddits.length)];

// 🔁 Use a working CORS proxy
const proxy = 'https://api.allorigins.win/raw?url=';
const redditUrl = encodeURIComponent(`https://www.reddit.com/r/${chosenSub}/hot.json?limit=10&after=${after}`);

window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 600) {
    fetchMemes();
  }
});

fetchMemes();

async function fetchMemes() {
  try {
    const res = await fetch(proxy + redditUrl);
    
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    
    const json = await res.json();
    
    const posts = json.data.children;
    after = json.data.after;

    if (!posts || posts.length === 0) {
      console.warn("No posts returned");
      return;
    }

    posts.forEach((postObj, index) => {
      const post = postObj.data;

      // Only show i.redd.it image links
      if (!post.url || !post.url.includes("i.redd.it")) return;

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
        img.src = "https://via.placeholder.com/500x300?text=Failed+to+load+image";
      };
      card.appendChild(img);

      container.appendChild(card);

      // Insert ad placeholder every 3rd meme
      if ((index + 1) % 3 === 0) {
        const ad = document.createElement("div");
        ad.className = "ad-unit";
        ad.innerHTML = "[ GOOGLE ADSENSE WILL GO HERE ]";
        container.appendChild(ad);
      }
    });
  } catch (err) {
    console.error("Fetch failed:", err);
    
    const errorDiv = document.createElement("div");
    errorDiv.style.color = "red";
    errorDiv.style.textAlign = "center";
    errorDiv.style.padding = "2rem";
    errorDiv.innerHTML = `
      <strong>❌ Failed to load memes</strong><br>
      Network issue or Reddit is blocked.<br>
      Try on Wi-Fi or use a different device.
    `;
    container.appendChild(errorDiv);
  }
}