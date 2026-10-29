const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const menu = document.querySelector('[data-menu]');

// Reemplaza los valores vacíos con los canales oficiales de la iglesia.
// Instagram: URL completa. WhatsApp: https://wa.me/569XXXXXXXX.
// Correo: mailto:correo@dominio.cl.
const contactChannels = {
  instagram: { href: '', label: 'Usuario por confirmar' },
  whatsapp: { href: '', label: 'Número por confirmar' },
  email: { href: '', label: 'Dirección por confirmar' },
};

// Agrega el ID del video programado en YouTube y la URL del canal oficial.
// El ID es la parte final de una URL como youtube.com/watch?v=ID_DEL_VIDEO.
const youtubeLive = {
  videoId: '',
  channelId: 'UC8pmI3GI9PlhdFFH9EWX-Nw',
  channelUrl: 'https://www.youtube.com/@IMPPeralilloTV',
};

document.querySelectorAll('[data-contact-link]').forEach((link) => {
  const channel = contactChannels[link.dataset.contactLink];
  if (!channel?.href) return;

  link.href = channel.href;
  link.removeAttribute('aria-disabled');
  if (channel.href.startsWith('http')) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
  const label = link.querySelector('[data-contact-label]');
  if (label) label.textContent = channel.label;
});

const liveEmbed = document.querySelector('[data-live-embed]');
const livePlaceholder = document.querySelector('[data-live-placeholder]');
const youtubeChannelButton = document.querySelector('[data-youtube-channel]');

if (youtubeLive.videoId && liveEmbed && livePlaceholder) {
  const videoId = encodeURIComponent(youtubeLive.videoId.trim());
  liveEmbed.src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
  liveEmbed.hidden = false;
  livePlaceholder.hidden = true;
}

const youtubeDestination = youtubeLive.channelUrl || (youtubeLive.videoId
  ? `https://www.youtube.com/watch?v=${encodeURIComponent(youtubeLive.videoId.trim())}`
  : '');

if (youtubeDestination && youtubeChannelButton) {
  youtubeChannelButton.href = youtubeDestination;
  youtubeChannelButton.target = '_blank';
  youtubeChannelButton.rel = 'noopener noreferrer';
  youtubeChannelButton.removeAttribute('aria-disabled');
}

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  menu.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
});

menu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menú');
    menu.classList.remove('open');
    document.body.classList.remove('menu-open');
  });
});

const revealItems = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('revealed'));
}

const galleryItems = Array.from(document.querySelectorAll('[data-gallery-item]'));
const galleryFilters = document.querySelectorAll('[data-gallery-filter]');
const galleryDialog = document.querySelector('[data-gallery-dialog]');
const galleryImage = document.querySelector('[data-gallery-image]');
const galleryTitle = document.querySelector('[data-gallery-title]');
const galleryDetail = document.querySelector('[data-gallery-detail]');
const galleryCredit = document.querySelector('[data-gallery-credit]');
let currentGalleryItem = null;
let galleryTrigger = null;

galleryFilters.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedCategory = button.dataset.galleryFilter;

    galleryFilters.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle('active', isActive);
      filterButton.setAttribute('aria-pressed', String(isActive));
    });

    galleryItems.forEach((item) => {
      item.hidden = selectedCategory !== 'todos' && item.dataset.category !== selectedCategory;
    });
  });
});

const visibleGalleryItems = () => galleryItems.filter((item) => !item.hidden);

const updateGalleryDialog = (item) => {
  const thumbnail = item.querySelector('img');
  currentGalleryItem = item;
  galleryImage.src = thumbnail.src;
  galleryImage.alt = thumbnail.alt;
  galleryTitle.textContent = item.dataset.title;
  galleryDetail.textContent = item.dataset.detail;
  galleryCredit.textContent = `Foto de ${item.dataset.credit} · Pexels ↗`;
  galleryCredit.href = item.dataset.source;
};

const openGalleryDialog = (item) => {
  if (!galleryDialog || typeof galleryDialog.showModal !== 'function') return;
  galleryTrigger = item;
  updateGalleryDialog(item);
  galleryDialog.showModal();
  document.body.classList.add('lightbox-open');
};

const moveGallery = (direction) => {
  const items = visibleGalleryItems();
  const currentIndex = items.indexOf(currentGalleryItem);
  const nextIndex = (currentIndex + direction + items.length) % items.length;
  updateGalleryDialog(items[nextIndex]);
};

galleryItems.forEach((item) => item.addEventListener('click', () => openGalleryDialog(item)));

document.querySelector('[data-gallery-close]')?.addEventListener('click', () => galleryDialog.close());
document.querySelector('[data-gallery-prev]')?.addEventListener('click', () => moveGallery(-1));
document.querySelector('[data-gallery-next]')?.addEventListener('click', () => moveGallery(1));

galleryDialog?.addEventListener('click', (event) => {
  if (event.target === galleryDialog) galleryDialog.close();
});

galleryDialog?.addEventListener('close', () => {
  document.body.classList.remove('lightbox-open');
  galleryTrigger?.focus();
});

galleryDialog?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') moveGallery(-1);
  if (event.key === 'ArrowRight') moveGallery(1);
});
