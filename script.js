const container = document.getElementById("meme-container");
let after = "";
const subreddits = ["cringetopia", "teenagers", "Hellpagedesign", "facebookstories"];
const chosenSub = subreddits[Math.floor(Math.random() * subreddits.length)];

window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 600) {
    fetchMemes();
  }
});

fetchMemes();

async function fetchMemes() {
  try {
    const res = await fetch(`https://www.reddit.com/r/${chosenSub}/hot.json?limit=10&after=${after}`);
    const json = await res.json();
    
    const posts = json.data.children;
    after = json.data.after;

    posts.forEach((postObj, index) => {
      const post = postObj.data;

      try {
        const url = new URL(post.url);
        if (!["i.redd.it", "v.redd.it"].includes(url.hostname)) return;
      } catch {
        return;
      }

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
      card.appendChild(img);

      container.appendChild(card);

      if ((index + 1) % 3 === 0) {
        const ad = document.createElement("div");
        ad.className = "ad-unit";
        ad.innerHTML = "[ GOOGLE ADSENSE WILL GO HERE ]";
        container.appendChild(ad);
      }
    });
  } catch (err) {
    console.error("Failed to load memes:", err);
  }
}
