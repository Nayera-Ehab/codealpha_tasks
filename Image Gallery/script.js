/* ==========================================================================
   LUMINA — Data
   ========================================================================== */
const IMAGES = [
  { id: 1,  title: "Serenity in Nature",     category: "nature",       description: "A peaceful morning at the lake surrounded by mountains and endless beauty.", image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1200&q=80" },
  { id: 2,  title: "Golden Forest Path",      category: "nature",       description: "Sunlight breaks through the canopy along a quiet forest trail.",              image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80" },
  { id: 3,  title: "Old World Avenue",        category: "architecture", description: "Historic stone facades line a sunlit European boulevard.",                    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80" },
  { id: 4,  title: "Cliffside Village",       category: "travel",       description: "Whitewashed houses cling to dramatic coastal cliffs above the sea.",          image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80" },
  { id: 5,  title: "Desert Ascension",        category: "travel",       description: "Hot air balloons drift over rugged desert terrain at dawn.",                  image: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=1200&q=80" },
  { id: 6,  title: "Fluid Forms",             category: "architecture", description: "A modern museum facade sculpted into flowing white curves.",                 image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=80" },
  { id: 7,  title: "The Watchful Fox",        category: "animals",      description: "A red fox pauses, ears alert, deep in the woodland undergrowth.",             image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1200&q=80" },
  { id: 8,  title: "Wanderer's View",         category: "people",       description: "A traveler takes in the vast alpine lake stretching before her.",             image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1200&q=80" },
  { id: 9,  title: "Hidden Falls",            category: "nature",       description: "A secluded waterfall cascades through dense emerald forest.",                image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80" },
  { id: 10, title: "Alpine Reflections",      category: "nature",       description: "Still waters mirror snow-capped peaks in perfect symmetry.",                 image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80" },
  { id: 11, title: "Coastal Wanderlust",      category: "travel",       description: "Turquoise waters meet weathered cliffs along a hidden shoreline.",            image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80" },
  { id: 12, title: "Marble & Light",          category: "architecture", description: "Sunbeams cut across the grand interior of a domed cathedral.",               image: "https://images.unsplash.com/photo-1520917130246-4646feb59d31?auto=format&fit=crop&w=1200&q=80" },
  { id: 13, title: "Portrait of Solitude",    category: "people",       description: "A quiet moment of reflection against a muted studio backdrop.",              image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80" },
  { id: 14, title: "Savanna Gaze",            category: "animals",      description: "A lion surveys the golden grasslands as dusk approaches.",                   image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80" },
  { id: 15, title: "Misty Peaks",             category: "nature",       description: "Layered mountain ridges fade into morning fog.",                             image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80" },
  { id: 16, title: "Urban Geometry",          category: "architecture", description: "Glass towers stack into sharp converging lines against the sky.",           image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80" },
  { id: 17, title: "Market Day",              category: "people",       description: "Vendors and travelers cross paths in a bustling old-town square.",            image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80" },
  { id: 18, title: "The Curious Owl",         category: "animals",      description: "A snowy owl turns its head, framed by falling snow.",                        image: "https://images.unsplash.com/photo-1553264701-d0c74f877997?auto=format&fit=crop&w=1200&q=80" },
  { id: 19, title: "Dune Horizons",           category: "travel",       description: "Endless sand dunes ripple beneath a burning afternoon sun.",                 image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1200&q=80" },
  { id: 20, title: "Evergreen Silence",       category: "nature",       description: "Tall pines stand still in the hush of a winter morning.",                    image: "https://images.unsplash.com/photo-1441716844725-09cedc13a4e7?auto=format&fit=crop&w=1200&q=80" },
];

// --- Generate additional images to reach 100 total, with varied per-category
// titles/descriptions and reliable seeded photography (Lorem Picsum, which
// serves real photographs and never returns a broken link for a given seed).
const CATEGORY_BANK = {
  nature: {
    titles: ["Whispering Pines", "River's Edge", "Autumn Canopy", "Mountain Mist", "Meadow at Dawn", "Wildflower Fields", "Frozen Stream", "Highland Trail", "Sunlit Grove", "Coastal Dunes", "Ancient Oak", "Morning Dew", "Valley Bloom", "Rolling Hills", "Crystal Spring", "Twilight Ridge"],
    desc: "A quiet corner of the natural world, captured in soft, changing light."
  },
  travel: {
    titles: ["Distant Roads", "Harbor Lights", "Desert Caravan", "City at Dusk", "Island Escape", "Mountain Pass", "Coastal Drive", "Old Town Streets", "Sunset Ferry", "Hidden Alley", "Terraced Hills", "Nomad's Path", "Lantern Festival", "River Crossing", "Skyline Wander", "Cobblestone Corner"],
    desc: "A fleeting scene from somewhere far from home, worth remembering."
  },
  architecture: {
    titles: ["Concrete Poetry", "Glass Spire", "Stone Arches", "Modern Facade", "Cathedral Light", "Steel Symmetry", "Rooftop Lines", "Courtyard Shadows", "Minimalist Form", "Grand Staircase", "Brutalist Edge", "Vaulted Ceiling", "Urban Lattice", "Timber Frame", "Reflective Tower", "Quiet Corridor"],
    desc: "Structure and light meeting in careful, deliberate proportion."
  },
  people: {
    titles: ["Quiet Portrait", "Street Moment", "Working Hands", "Candid Laughter", "Golden Hour Gaze", "City Wanderer", "Market Vendor", "Studio Light", "Fleeting Glance", "Everyday Grace", "Silhouette at Dusk", "Craftsman's Focus", "Traveler's Rest", "Family Moment", "Urban Portrait", "A Passing Look"],
    desc: "An honest, unposed moment between one person and the camera."
  },
  animals: {
    titles: ["Silent Predator", "Winter Coat", "Feathered Flight", "Ocean Wanderer", "Grazing Herd", "Curious Cub", "Desert Dweller", "Forest Guardian", "Night Hunter", "Gentle Giant", "Camouflaged", "Migration Path", "Alert Stance", "Playful Pair", "Wild Instinct", "Watching, Waiting"],
    desc: "A brief encounter with a creature entirely at home in its world."
  },
};

function generateExtraImages(startId, countPerCategory) {
  const extra = [];
  let id = startId;
  Object.keys(CATEGORY_BANK).forEach((category) => {
    const bank = CATEGORY_BANK[category];
    for (let i = 0; i < countPerCategory; i++) {
      const title = bank.titles[i % bank.titles.length];
      extra.push({
        id: id,
        title: title,
        category: category,
        description: bank.desc,
        image: `https://picsum.photos/seed/lumina-${category}-${id}/900/1125`,
      });
      id++;
    }
  });
  return extra;
}

const EXTRA_IMAGES = generateExtraImages(IMAGES.length + 1, 16); // 16 x 5 categories = 80
IMAGES.push(...EXTRA_IMAGES);

// favorite state loaded from localStorage
const FAVORITES_KEY = "lumina_favorites";
function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch (e) { return new Set(); }
}
function saveFavorites(set) {
  try { localStorage.setItem(FAVORITES_KEY, JSON.stringify([...set])); } catch (e) {}
}

let favorites = loadFavorites();
IMAGES.forEach(img => { img.favorite = favorites.has(img.id); });

/* ==========================================================================
   State
   ========================================================================== */
const state = {
  category: "all",
  query: "",
  view: "explore", // explore | favorites
  currentList: [],  // list currently displayed (for lightbox indexing)
  lightboxIndex: -1,
};

/* ==========================================================================
   DOM refs
   ========================================================================== */
const galleryGrid = document.getElementById("galleryGrid");
const emptyState = document.getElementById("emptyState");
const galleryHeading = document.getElementById("galleryHeading");
const galleryCount = document.getElementById("galleryCount");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const categoriesEl = document.getElementById("categories");
const navLinks = document.querySelectorAll(".nav-link");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileNav = document.getElementById("mobileNav");
const themeToggle = document.getElementById("themeToggle");

const lightbox = document.getElementById("lightbox");
const lightboxOverlay = document.getElementById("lightboxOverlay");
const lbImage = document.getElementById("lbImage");
const lbCategory = document.getElementById("lbCategory");
const lbTitle = document.getElementById("lbTitle");
const lbDesc = document.getElementById("lbDesc");
const lbCounter = document.getElementById("lbCounter");
const lbFavorite = document.getElementById("lbFavorite");
const lbDownload = document.getElementById("lbDownload");
const lbFullscreen = document.getElementById("lbFullscreen");
const lbClose = document.getElementById("lbClose");
const lbCloseMobile = document.getElementById("lbCloseMobile");
const lbPrev = document.getElementById("lbPrev");
const lbNext = document.getElementById("lbNext");

/* ==========================================================================
   Rendering
   ========================================================================== */
function getFilteredImages() {
  let list = state.view === "favorites" ? IMAGES.filter(i => i.favorite) : IMAGES.slice();

  if (state.category !== "all") {
    list = list.filter(i => i.category === state.category);
  }

  if (state.query.trim()) {
    const q = state.query.trim().toLowerCase();
    list = list.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q)
    );
  }

  return list;
}

function renderGallery() {
  const list = getFilteredImages();
  state.currentList = list;

  galleryGrid.innerHTML = "";

  galleryHeading.textContent = state.view === "favorites" ? "Favorites" : "Explore";
  galleryCount.textContent = list.length ? `${list.length} image${list.length === 1 ? "" : "s"}` : "";

  if (!list.length) {
    emptyState.hidden = false;
    emptyState.setAttribute("data-show", "true");
    if (state.view === "favorites") {
      emptyState.textContent = "No favorites yet. Tap the heart on any image to save it here.";
    } else {
      emptyState.textContent = "No images found. Try a different search or category.";
    }
    return;
  }
  emptyState.hidden = true;
  emptyState.setAttribute("data-show", "false");

  list.forEach((img, index) => {
    galleryGrid.appendChild(createCard(img, index));
  });
}

function createCard(img, index) {
  const card = document.createElement("article");
  card.className = "card";
  card.style.animationDelay = `${Math.min(index * 40, 400)}ms`;
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Open ${img.title}`);
  card.dataset.id = img.id;

  card.innerHTML = `
    <img src="${img.image}" alt="${img.title} — ${img.category}" loading="lazy">
    <div class="card-overlay"></div>
    <button class="card-fav ${img.favorite ? "is-favorite" : ""}" aria-label="Toggle favorite" aria-pressed="${img.favorite}">
      <svg viewBox="0 0 24 24" fill="${img.favorite ? "currentColor" : "none"}"><path d="M12 20.3s-7.5-4.6-10-9.3C.4 7.6 2.4 4 6 4c2 0 3.5 1 4.6 2.6C11.7 5 13.2 4 15.2 4c3.6 0 5.6 3.6 4 7-2.5 4.7-10 9.3-10 9.3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
    </button>
    <div class="card-info">
      <span class="card-category">${img.category}</span>
      <h3 class="card-title">${img.title}</h3>
      <p class="card-desc">${img.description}</p>
    </div>
  `;

  card.addEventListener("click", () => openLightbox(img.id));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(img.id); }
  });

  const favBtn = card.querySelector(".card-fav");
  favBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFavorite(img.id);
  });

  return card;
}

/* ==========================================================================
   Filtering / Search
   ========================================================================== */
function filterGallery(category) {
  state.category = category;
  document.querySelectorAll(".cat-btn").forEach(btn => {
    btn.classList.toggle("is-active", btn.dataset.category === category);
  });
  renderGallery();
}

function searchImages(query) {
  state.query = query;
  renderGallery();
}

categoriesEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".cat-btn");
  if (!btn) return;
  filterGallery(btn.dataset.category);
});

searchForm.addEventListener("submit", (e) => e.preventDefault());
searchInput.addEventListener("input", (e) => searchImages(e.target.value));

/* ==========================================================================
   View switching (Explore / Favorites)
   ========================================================================== */
function setView(view) {
  state.view = view;
  [...navLinks, ...mobileNavLinks].forEach(link => {
    link.classList.toggle("is-active", link.dataset.view === view || (view === "explore" && link.dataset.view === "categories" && false));
  });
  navLinks.forEach(l => l.classList.toggle("is-active", l.dataset.view === view));
  mobileNavLinks.forEach(l => l.classList.toggle("is-active", l.dataset.view === view));
  renderGallery();
  document.getElementById("gallery").scrollIntoView({ behavior: "smooth", block: "start" });
}

navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    const view = link.dataset.view;
    if (view === "favorites") { e.preventDefault(); setView("favorites"); }
    else if (view === "explore") { e.preventDefault(); setView("explore"); }
    // "categories" just scrolls to the categories area naturally
  });
});
mobileNavLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    const view = link.dataset.view;
    closeMobileMenu();
    if (view === "favorites") { e.preventDefault(); setView("favorites"); }
    else if (view === "explore") { e.preventDefault(); setView("explore"); }
  });
});

/* ==========================================================================
   Favorites
   ========================================================================== */
function toggleFavorite(id) {
  const img = IMAGES.find(i => i.id === id);
  if (!img) return;
  img.favorite = !img.favorite;

  if (img.favorite) favorites.add(id); else favorites.delete(id);
  saveFavorites(favorites);

  // Update card in DOM without full re-render for smoothness
  const card = galleryGrid.querySelector(`.card[data-id="${id}"]`);
  if (card) {
    const favBtn = card.querySelector(".card-fav");
    favBtn.classList.toggle("is-favorite", img.favorite);
    favBtn.setAttribute("aria-pressed", img.favorite);
    favBtn.querySelector("svg").setAttribute("fill", img.favorite ? "currentColor" : "none");
  }

  // If we're on the favorites view and just unfavorited, re-render to remove it
  if (state.view === "favorites" && !img.favorite) {
    renderGallery();
  }

  // Sync lightbox favorite button if this image is open
  if (state.lightboxIndex > -1 && state.currentList[state.lightboxIndex] && state.currentList[state.lightboxIndex].id === id) {
    updateLightboxFavoriteButton(img.favorite);
  }
}

function updateLightboxFavoriteButton(isFav) {
  lbFavorite.classList.toggle("is-favorite", isFav);
  lbFavorite.setAttribute("aria-pressed", isFav);
  lbFavorite.querySelector("svg").setAttribute("fill", isFav ? "currentColor" : "none");
}

/* ==========================================================================
   Lightbox
   ========================================================================== */
function openLightbox(id) {
  const list = state.currentList.length ? state.currentList : getFilteredImages();
  const index = list.findIndex(i => i.id === id);
  if (index === -1) return;
  state.currentList = list;
  state.lightboxIndex = index;
  updateLightbox();
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  lbClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
  state.lightboxIndex = -1;
}

function showNextImage() {
  if (!state.currentList.length) return;
  state.lightboxIndex = (state.lightboxIndex + 1) % state.currentList.length;
  updateLightbox();
}

function showPreviousImage() {
  if (!state.currentList.length) return;
  state.lightboxIndex = (state.lightboxIndex - 1 + state.currentList.length) % state.currentList.length;
  updateLightbox();
}

function updateLightbox() {
  const img = state.currentList[state.lightboxIndex];
  if (!img) return;

  lbImage.src = img.image;
  lbImage.alt = `${img.title} — ${img.category}`;
  lbCategory.textContent = img.category.charAt(0).toUpperCase() + img.category.slice(1);
  lbTitle.textContent = img.title;
  lbDesc.textContent = img.description;
  lbCounter.textContent = `${state.lightboxIndex + 1} / ${state.currentList.length}`;
  updateLightboxFavoriteButton(img.favorite);

  // restart image fade animation
  lbImage.style.animation = "none";
  void lbImage.offsetWidth;
  lbImage.style.animation = "";
}

lbClose.addEventListener("click", closeLightbox);
lbCloseMobile.addEventListener("click", closeLightbox);
lightboxOverlay.addEventListener("click", closeLightbox);
lbPrev.addEventListener("click", showPreviousImage);
lbNext.addEventListener("click", showNextImage);

lbFavorite.addEventListener("click", () => {
  const img = state.currentList[state.lightboxIndex];
  if (img) toggleFavorite(img.id);
});

lbDownload.addEventListener("click", () => {
  const img = state.currentList[state.lightboxIndex];
  if (!img) return;
  const a = document.createElement("a");
  a.href = img.image;
  a.download = `${img.title.replace(/\s+/g, "-").toLowerCase()}.jpg`;
  a.target = "_blank";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
});

lbFullscreen.addEventListener("click", () => {
  const wrap = document.querySelector(".lb-image-wrap");
  if (!document.fullscreenElement) {
    wrap.requestFullscreen?.().catch(() => {});
  } else {
    document.exitFullscreen?.();
  }
});

document.addEventListener("keydown", (e) => {
  if (lightbox.hidden) return;
  if (e.key === "Escape") closeLightbox();
  else if (e.key === "ArrowLeft") showPreviousImage();
  else if (e.key === "ArrowRight") showNextImage();
});

/* ==========================================================================
   Mobile menu
   ========================================================================== */
function toggleMobileMenu() {
  const isOpen = mobileNav.classList.toggle("is-open");
  hamburgerBtn.classList.toggle("is-open", isOpen);
  hamburgerBtn.setAttribute("aria-expanded", isOpen);
  hamburgerBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
}
function closeMobileMenu() {
  mobileNav.classList.remove("is-open");
  hamburgerBtn.classList.remove("is-open");
  hamburgerBtn.setAttribute("aria-expanded", "false");
  hamburgerBtn.setAttribute("aria-label", "Open menu");
}
hamburgerBtn.addEventListener("click", toggleMobileMenu);

/* ==========================================================================
   Theme toggle (true light / dark themes, persisted)
   ========================================================================== */
const THEME_KEY = "lumina_theme";
const moonIcon = `<path d="M20.5 14.5a8.5 8.5 0 1 1-9-11 7 7 0 0 0 9 11Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>`;
const sunIcon = `<circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.5"/><path d="M12 3v2.2M12 18.8V21M4.2 12H2M22 12h-2.2M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M5.6 18.4l1.6-1.6M16.8 7.2l1.6-1.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`;

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.querySelector("svg").innerHTML = theme === "light" ? sunIcon : moonIcon;
  themeToggle.setAttribute("aria-label", theme === "light" ? "Switch to dark theme" : "Switch to light theme");
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
}

function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
  applyTheme(saved === "light" ? "light" : "dark");
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  applyTheme(current === "light" ? "dark" : "light");
});

initTheme();

/* ==========================================================================
   Init
   ========================================================================== */
function init() {
  navLinks.forEach(l => l.classList.toggle("is-active", l.dataset.view === "explore"));
  renderGallery();
}

init();
