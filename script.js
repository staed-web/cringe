const container = document.getElementById("meme-container");

// Proxy + Imgur search for "cringe"
const proxyUrl = 'https://api.allorigins.win/raw?url=';
const imgurSearch = encodeURIComponent('https://imgur.com/search/score/all/cringe');

// Load more when scrolling
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 600) {
    fetchMeme();
  }
});

// Load first meme immediately
fetchMeme();

async function fetchMeme() {
  try {
    // Fetch Imgur search page
    const res = await fetch(proxyUrl + imgurSearch);
    
    if (!res.ok) throw new Error(`Failed to load`);

    const html = await res.text();

    // Extract all image URLs using regex
    const imgMatches = html.match(/https:\/\/i\.imgur\.com\/[a-zA-Z0-9]+\.jpg/g);
    const gifMatches = html.match(/https:\/\/i\.imgur\.com\/[a-zA-Z0-9]+\.gif/g);
    
    const allImages = [...(imgMatches || []), ...(gifMatches || [])];
    
    if (allImages.length === 0) {
      // Fallback memes if none found
      const fallbacks = [
        'https://i.imgur.com/3f7d7e7o6u001.jpg',
        'https://i.imgur.com/8l9kx7q6s6v01.jpg',
        'https://i.imgur.com/1hjwv4z6g9t01.jpg'
      ];
      return displayMeme(fallbacks[Math.floor(Math.random() * fallbacks.length)], "Cringe Meme");
    }

    // Pick random image
    const imageUrl = allImages[Math.floor(Math.random() * allImages.length)];
    const title = "Cringe Meme #" + Date.now().toString().slice(-5);

    displayMeme(imageUrl, title);

  } catch (err) {
    console.error("Fetch failed:", err);

    // Show fallback even if everything breaks
    const fallbacks = [
      'https://i.imgur.com/5n6m7p8q9r001.jpg',
      'https://i.imgur.com/mZMqXJy.jpg'
    ];
    displayMeme(fallbacks[Math.floor(Math.random() * fallbacks.length)], "Random Shame");
  }
}

function displayMeme(imgSrc, titleText) {
  const card = document.createElement("div");
  card.className = "meme-card";

  const title = document.createElement("div");
  title.className = "title";
  title.textContent = titleText;
  card.appendChild(title);

  const img = document.createElement("img");
  img.src = imgSrc + '?random=' + Date.now(); // Force freshness
  img.alt = titleText;
  img.loading = "lazy";
  img.onerror = () => {
    img.src = "https://via.placeholder.com/500x300?text=Image+Failed";
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
}