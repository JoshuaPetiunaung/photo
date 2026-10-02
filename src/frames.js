// Photobooth Frame Library & Dynamic Slot Configuration System
// Comprehensive Gen-Z Trendy Korean & Pinterest Aesthetic Photobooth Frames (16+ Designs)

// Preload Pinterest graphic frames
// Preload Pinterest graphic frames
const pinterestImages = {};
export function getLoadedImage(src) {
  if (!pinterestImages[src]) {
    const img = new Image();
    img.src = src;
    pinterestImages[src] = img;
  }
  return pinterestImages[src];
}

// Pre-cache generated & user uploaded Pinterest images (both preview JPGs and transparent PNG overlays)
getLoadedImage('/frames/spiderman_comic_3cut.jpg');
getLoadedImage('/frames/spiderman_comic_3cut.png');
getLoadedImage('/frames/ruby_jane_kunst_collage.jpg');
getLoadedImage('/frames/ruby_jane_kunst_collage.png');
getLoadedImage('/frames/western_cowboy_3cut.jpg');
getLoadedImage('/frames/western_cowboy_3cut.png');
getLoadedImage('/frames/denim_snoopy_digicam_4cut.jpg');
getLoadedImage('/frames/denim_snoopy_digicam_4cut.png');
getLoadedImage('/frames/polaroid_receipt_totoro_3cut.jpg');
getLoadedImage('/frames/polaroid_receipt_totoro_3cut.png');
getLoadedImage('/frames/starry_cats_polaroid_3cut.jpg');
getLoadedImage('/frames/starry_cats_polaroid_3cut.png');
getLoadedImage('/frames/ocean_blue_digicam_4cut.jpg');
getLoadedImage('/frames/ocean_blue_digicam_4cut.png');
getLoadedImage('/frames/y2k_pink_grid.jpg');
getLoadedImage('/frames/cyber_acid_3cut.jpg');
getLoadedImage('/frames/haru_baby_blue.jpg');
getLoadedImage('/frames/blue_ocean_fish_3cut.jpg');
getLoadedImage('/frames/blue_ocean_fish_3cut.png');
getLoadedImage('/frames/yellow_gingham_digicam_3cut.jpg');
getLoadedImage('/frames/yellow_gingham_digicam_3cut.png');
getLoadedImage('/frames/retro_switch_consoles_3cut.jpg');
getLoadedImage('/frames/retro_switch_consoles_3cut.png');
getLoadedImage('/frames/japanese_retro_tv_3cut.jpg');
getLoadedImage('/frames/japanese_retro_tv_3cut.png');
getLoadedImage('/frames/polaroid_snoopy_burgundy_3cut.jpg');
getLoadedImage('/frames/polaroid_snoopy_burgundy_3cut.png');

// Helper: Convert SVG string to data URI
function svgToUri(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
}

export const BUILTIN_FRAMES = [
  // ========================================================
  // 1. PINTEREST VIRAL SERIES (User Uploaded & Viral Templates)
  // ========================================================
  {
    id: 'spiderman-comic-3',
    name: 'Spider-Man Comic Favorite Person',
    category: 'pinterest',
    subCategory: 'boy',
    orientation: 'portrait',
    slotCount: 3,
    width: 576,
    height: 1024,
    tag: '🕷️ 3 Foto — Spider-Man Comic',
    description: 'Frame komik retro Marvel Spider-Man, Spider-Gwen, Zendaya & Tom selfie, dan 3 polaroid romantis',
    bgColor: '#7f1d1d',
    textColor: '#ef4444',
    bgImageSrc: '/frames/spiderman_comic_3cut.jpg',
    overlayImageSrc: '/frames/spiderman_comic_3cut.png',
    slots: [
      { id: 1, cx: 197, cy: 297, width: 224, height: 282, rotate: -6.04, radius: 4 },
      { id: 2, cx: 442, cy: 423, width: 194, height: 254, rotate: 2.57, radius: 4 },
      { id: 3, cx: 172, cy: 765, width: 246, height: 190, rotate: -3.22, radius: 4 }
    ],
    drawOverlay: (ctx, width, height) => {
      const img = getLoadedImage('/frames/spiderman_comic_3cut.png');
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, width, height);
      }
    }
  },
  {
    id: 'kalasse-maroon-3',
    name: 'Kalasse Maroon Photobooth (3-Cut)',
    category: 'pinterest',
    subCategory: 'girl',
    orientation: 'landscape',
    slotCount: 3,
    width: 600,
    height: 1450,
    tag: '🍷 Kalasse Duo 3-Cut',
    description: 'Photobooth maroon burgundy elegan dengan doodle triple hearts putih, pita ribbon cantik, dan slot landscape lebar cocok untuk berdua',
    bgColor: '#6b0f1a',
    textColor: '#fecdd3',
    previewSvg: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 500">
        <rect width="300" height="500" fill="#6b0f1a"/>
        <text x="150" y="24" font-family="sans-serif" font-weight="600" font-size="9" fill="#ffffff" opacity="0.9" text-anchor="middle" letter-spacing="1">kalasse photobooth</text>
        <rect x="25" y="32" width="250" height="120" rx="8" fill="#4c0810" stroke="#881324" stroke-width="1.5"/>
        <rect x="25" y="162" width="250" height="120" rx="8" fill="#4c0810" stroke="#881324" stroke-width="1.5"/>
        <rect x="25" y="292" width="250" height="120" rx="8" fill="#4c0810" stroke="#881324" stroke-width="1.5"/>
        <!-- Triple hearts on top left of slots -->
        <g fill="#ffffff">
          <circle cx="34" cy="38" r="4"/>
          <circle cx="42" cy="35" r="3"/>
          <circle cx="37" cy="46" r="3.5"/>
        </g>
        <!-- Bottom ribbon -->
        <path d="M 150 445 C 130 430, 115 450, 145 447 C 138 460, 132 472, 126 478 M 150 445 C 170 430, 185 450, 155 447 C 162 460, 168 472, 174 478" fill="none" stroke="#ffffff" stroke-width="2"/>
        <circle cx="150" cy="445" r="3.5" fill="#ffffff"/>
        <text x="150" y="490" font-family="serif" font-style="italic" font-size="11" fill="#fecdd3" text-anchor="middle">together in memories ♡</text>
      </svg>
    `),
    slots: [
      { id: 1, x: 45, y: 75, width: 510, height: 380, radius: 14 },
      { id: 2, x: 45, y: 485, width: 510, height: 380, radius: 14 },
      { id: 3, x: 45, y: 895, width: 510, height: 380, radius: 14 }
    ],
    drawBackground: (ctx, width, height) => {
      // Luxurious maroon background with subtle gradient
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#660b16');
      grad.addColorStop(0.5, '#730d1a');
      grad.addColorStop(1, '#5a0812');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Delicate outer frame border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(18, 18, width - 36, height - 36);
    },
    drawDecorations: (ctx, width, height) => {
      ctx.save();

      // Top brand caption (centered above top slot)
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('kalasse photobooth', width / 2, 48);

      // Triple Hearts on each slot top-left corner
      const slotYPositions = [75, 485, 895];
      slotYPositions.forEach((sy) => {
        drawTripleHearts(ctx, 48, sy - 8);
      });

      // Scattered cute 4-point white sparkles on margins
      const sparkles = [
        { x: 28, y: 350, s: 7 },
        { x: width - 28, y: 220, s: 6 },
        { x: 30, y: 720, s: 8 },
        { x: width - 28, y: 650, s: 7 },
        { x: 28, y: 1150, s: 6 },
        { x: width - 28, y: 1080, s: 8 },
        { x: 65, y: 1390, s: 9 },
        { x: width - 65, y: 1390, s: 9 }
      ];
      sparkles.forEach(sp => {
        drawSparkle(ctx, sp.x, sp.y, sp.s, '#ffffff');
      });

      // Bottom footer decoration
      const footerY = 1350;
      // White ribbon bow
      drawWhiteRibbonBow(ctx, width / 2, footerY - 12);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'italic 700 20px "Playfair Display", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('kalasse photobooth', width / 2, footerY + 28);

      ctx.font = '12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#fecdd3';
      const today = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
      ctx.fillText(`DUO EDITION  •  ${today}`, width / 2, footerY + 48);

      ctx.restore();
    }
  },
  {
    id: 'blue-ocean-fish-3',
    name: 'Blue Ocean Fish Polaroid (3-Cut)',
    category: 'pinterest',
    subCategory: 'girl',
    orientation: 'landscape',
    slotCount: 3,
    width: 576,
    height: 1024,
    tag: '🐟 3 Foto — Ocean Fish Polaroid',
    description: 'Frame scrapbook biru laut estetik dengan 3 polaroid landscape, jepit binder emas, pita kotak biru, dan stiker ikan lucu',
    bgColor: '#93c5fd',
    textColor: '#1e3a8a',
    bgImageSrc: '/frames/blue_ocean_fish_3cut.jpg',
    overlayImageSrc: '/frames/blue_ocean_fish_3cut.png',
    slots: [
      { id: 1, cx: 264, cy: 195, width: 344, height: 214, rotate: -6.90, radius: 4 },
      { id: 2, cx: 291, cy: 496, width: 360, height: 225, rotate: 5.57, radius: 4 },
      { id: 3, cx: 292, cy: 826, width: 380, height: 244, rotate: -7.82, radius: 4 }
    ],
    drawOverlay: (ctx, width, height) => {
      const img = getLoadedImage('/frames/blue_ocean_fish_3cut.png');
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, width, height);
      }
    }
  },
  {
    id: 'yellow-gingham-digicam-3',
    name: 'Yellow Gingham Digicam (3-Cut)',
    category: 'pinterest',
    subCategory: 'girl',
    orientation: 'landscape',
    slotCount: 3,
    width: 576,
    height: 1024,
    tag: '📸 3 Foto — Yellow Digicam',
    description: 'Frame kotak-kotak kuning ceria dengan 3 layar kamera digital retro silver, bunga kamboja kuning, dan gitar listrik',
    bgColor: '#fef08a',
    textColor: '#854d0e',
    bgImageSrc: '/frames/yellow_gingham_digicam_3cut.jpg',
    overlayImageSrc: '/frames/yellow_gingham_digicam_3cut.png',
    slots: [
      { id: 1, cx: 244, cy: 206, width: 248, height: 188, rotate: -0.28, radius: 4 },
      { id: 2, cx: 248, cy: 501, width: 258, height: 196, rotate: 5.68, radius: 4 },
      { id: 3, cx: 253, cy: 798, width: 250, height: 190, rotate: -5.93, radius: 4 }
    ],
    drawOverlay: (ctx, width, height) => {
      const img = getLoadedImage('/frames/yellow_gingham_digicam_3cut.png');
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, width, height);
      }
    }
  },
  {
    id: 'retro-switch-consoles-3',
    name: 'Retro Switch Handheld Consoles (3-Cut)',
    category: 'pinterest',
    subCategory: 'boy',
    orientation: 'landscape',
    slotCount: 3,
    width: 576,
    height: 1024,
    tag: '🎮 3 Foto — Game Console Screen',
    description: 'Frame gamer retro pastel dengan 3 layar konsol game handheld kuning-biru, stiker kucing gitar, dan teddy bear',
    bgColor: '#fef3c7',
    textColor: '#1e40af',
    bgImageSrc: '/frames/retro_switch_consoles_3cut.jpg',
    overlayImageSrc: '/frames/retro_switch_consoles_3cut.png',
    slots: [
      { id: 1, cx: 290, cy: 196, width: 300, height: 170, rotate: 10.10, radius: 4 },
      { id: 2, cx: 288, cy: 531, width: 290, height: 222, rotate: -6.87, radius: 4 },
      { id: 3, cx: 290, cy: 821, width: 308, height: 240, rotate: 8.78, radius: 4 }
    ],
    drawOverlay: (ctx, width, height) => {
      const img = getLoadedImage('/frames/retro_switch_consoles_3cut.png');
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, width, height);
      }
    }
  },
  {
    id: 'japanese-retro-tv-3',
    name: 'Japanese Retro TV Pop Collage (3-Cut)',
    category: 'pinterest',
    subCategory: 'neutral',
    orientation: 'landscape',
    slotCount: 3,
    width: 576,
    height: 1024,
    tag: '📺 3 Foto — Retro Red TV',
    description: 'Scrapbook pop art Jepang dengan 3 layar TV tabung merah retro, perangko vintage, Miffy bunny, dan stiker Mario',
    bgColor: '#fee2e2',
    textColor: '#991b1b',
    bgImageSrc: '/frames/japanese_retro_tv_3cut.jpg',
    overlayImageSrc: '/frames/japanese_retro_tv_3cut.png',
    slots: [
      { id: 1, cx: 195, cy: 215, width: 282, height: 221, rotate: -10.83, radius: 14 },
      { id: 2, cx: 400, cy: 519, width: 281, height: 221, rotate: 6.82, radius: 14 },
      { id: 3, cx: 210, cy: 848, width: 284, height: 223, rotate: -15.60, radius: 14 }
    ],
    drawOverlay: (ctx, width, height) => {
      const img = getLoadedImage('/frames/japanese_retro_tv_3cut.png');
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, width, height);
      }
    }
  },
  {
    id: 'polaroid-snoopy-burgundy-3',
    name: 'Polaroid OneStep Snoopy Burgundy (3-Cut)',
    category: 'pinterest',
    subCategory: 'girl',
    orientation: 'landscape',
    slotCount: 3,
    width: 576,
    height: 1024,
    tag: '🎀 3 Foto — Snoopy Burgundy Strip',
    description: 'Strip photobooth burgundy klasik dengan kamera Polaroid OneStep 2 di atas, Snoopy panah cinta, boneka beruang, dan kue ulang tahun',
    bgColor: '#ffffff',
    textColor: '#881337',
    bgImageSrc: '/frames/polaroid_snoopy_burgundy_3cut.jpg',
    overlayImageSrc: '/frames/polaroid_snoopy_burgundy_3cut.png',
    slots: [
      { id: 1, cx: 298, cy: 360, width: 228, height: 175, rotate: 0, radius: 4 },
      { id: 2, cx: 298, cy: 554, width: 228, height: 175, rotate: 0, radius: 4 },
      { id: 3, cx: 298, cy: 748, width: 228, height: 175, rotate: 0, radius: 4 }
    ],
    drawOverlay: (ctx, width, height) => {
      const img = getLoadedImage('/frames/polaroid_snoopy_burgundy_3cut.png');
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, width, height);
      }
    }
  },
  {
    id: 'ruby-jane-kunst-8',
    name: 'Ruby Jane Kunst & Digicam Burgundy',
    category: 'pinterest',
    subCategory: 'girl',
    orientation: 'portrait',
    slotCount: 8,
    width: 576,
    height: 1024,
    tag: '📷 8 Foto — Mega Polaroid Collage',
    description: 'Scrapbook burgundy elegan bertekstur karung goni, piringan vinyl hati Ruby Jane, 7 polaroid dan 1 kamera digital',
    bgColor: '#450a0a',
    textColor: '#f87171',
    bgImageSrc: '/frames/ruby_jane_kunst_collage.jpg',
    overlayImageSrc: '/frames/ruby_jane_kunst_collage.png',
    slots: [
      { id: 1, cx: 409, cy: 166, width: 216, height: 216, rotate: -14.04, radius: 4 },
      { id: 2, cx: 116, cy: 182, width: 172, height: 192, rotate: 27.3, radius: 8 },
      { id: 3, cx: 282, cy: 367, width: 226, height: 230, rotate: -23.82, radius: 4 },
      { id: 4, cx: 481, cy: 405, width: 196, height: 204, rotate: 9.41, radius: 4 },
      { id: 5, cx: 111, cy: 511, width: 196, height: 196, rotate: 1.26, radius: 4 },
      { id: 6, cx: 274, cy: 631, width: 220, height: 264, rotate: 27.29, radius: 4 },
      { id: 7, cx: 467, cy: 662, width: 194, height: 198, rotate: 2.2, radius: 4 },
      { id: 8, cx: 131, cy: 871, width: 216, height: 220, rotate: -8.58, radius: 4 }
    ],
    drawOverlay: (ctx, width, height) => {
      const img = getLoadedImage('/frames/ruby_jane_kunst_collage.png');
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, width, height);
      }
    }
  },
  {
    id: 'western-cowboy-3',
    name: 'Western Cowboy Scrapbook',
    category: 'pinterest',
    subCategory: 'boy',
    orientation: 'landscape',
    slotCount: 3,
    width: 576,
    height: 1024,
    tag: '🤠 3 Foto — Western Strip',
    description: 'Frame tema koboi vintage dengan topi kulit, buku catatan, not balok musik jazz/country, dan kartu poker',
    bgColor: '#3c2415',
    textColor: '#d97706',
    bgImageSrc: '/frames/western_cowboy_3cut.jpg',
    overlayImageSrc: '/frames/western_cowboy_3cut.png',
    slots: [
      { id: 1, cx: 343, cy: 420, width: 304, height: 204, rotate: 0, radius: 4 },
      { id: 2, cx: 334, cy: 624, width: 304, height: 204, rotate: 0, radius: 4 },
      { id: 3, cx: 337, cy: 832, width: 304, height: 204, rotate: 0, radius: 4 }
    ],
    drawOverlay: (ctx, width, height) => {
      const img = getLoadedImage('/frames/western_cowboy_3cut.png');
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, width, height);
      }
    }
  },
  {
    id: 'denim-snoopy-4',
    name: 'Denim Snoopy & Digicam',
    category: 'pinterest',
    subCategory: 'girl',
    orientation: 'portrait',
    slotCount: 4,
    width: 576,
    height: 1024,
    tag: '👖 4 Foto (3 Polaroid + Digicam)',
    description: 'Scrapbook denim jeans Y2K dengan Snoopy, disco ball, 3 polaroid dan 1 layar kamera digital Nikon',
    bgColor: '#1e3a8a',
    textColor: '#38bdf8',
    bgImageSrc: '/frames/denim_snoopy_digicam_4cut.jpg',
    overlayImageSrc: '/frames/denim_snoopy_digicam_4cut.png',
    slots: [
      { id: 1, cx: 387, cy: 216, width: 170, height: 174, rotate: -6.78, radius: 4 },
      { id: 2, cx: 417, cy: 441, width: 168, height: 168, rotate: 3.41, radius: 4 },
      { id: 3, cx: 457, cy: 658, width: 170, height: 170, rotate: -6.17, radius: 4 },
      { id: 4, cx: 122, cy: 674, width: 226, height: 178, rotate: 5.85, radius: 8 }
    ],
    drawOverlay: (ctx, width, height) => {
      const img = getLoadedImage('/frames/denim_snoopy_digicam_4cut.png');
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, width, height);
      }
    }
  },
  {
    id: 'polaroid-totoro-receipt-3',
    name: 'Polaroid OneStep & Receipt',
    category: 'pinterest',
    subCategory: 'girl',
    orientation: 'portrait',
    slotCount: 3,
    width: 576,
    height: 1024,
    tag: '📷 3 Foto — Kamera & Struk',
    description: 'Kamera Polaroid OneStep mencetak struk 3 foto dengan Totoro, Hello Kitty, Snoopy, dan vinyl record',
    bgColor: '#fdfbf7',
    textColor: '#dc2626',
    bgImageSrc: '/frames/polaroid_receipt_totoro_3cut.jpg',
    overlayImageSrc: '/frames/polaroid_receipt_totoro_3cut.png',
    slots: [
      { id: 1, cx: 334, cy: 380, width: 172, height: 174, rotate: -3.72, radius: 4 },
      { id: 2, cx: 347, cy: 556, width: 174, height: 174, rotate: -3.67, radius: 4 },
      { id: 3, cx: 360, cy: 732, width: 174, height: 174, rotate: -3.62, radius: 4 }
    ],
    drawOverlay: (ctx, width, height) => {
      const img = getLoadedImage('/frames/polaroid_receipt_totoro_3cut.png');
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, width, height);
      }
    }
  },
  {
    id: 'starry-cats-polaroid-3',
    name: 'Starry Night & Cozy Cats',
    category: 'pinterest',
    subCategory: 'girl',
    orientation: 'portrait',
    slotCount: 3,
    width: 576,
    height: 1024,
    tag: '🐱 3 Foto — Van Gogh & Cats',
    description: 'Lukisan Starry Night Van Gogh dengan 3 polaroid asimetris, kucing berpelukan, dan planet Saturnus',
    bgColor: '#172554',
    textColor: '#facc15',
    bgImageSrc: '/frames/starry_cats_polaroid_3cut.jpg',
    overlayImageSrc: '/frames/starry_cats_polaroid_3cut.png',
    slots: [
      { id: 1, cx: 423, cy: 153, width: 234, height: 228, rotate: 5.47, radius: 4 },
      { id: 2, cx: 138, cy: 373, width: 256, height: 252, rotate: -12.59, radius: 4 },
      { id: 3, cx: 213, cy: 778, width: 264, height: 266, rotate: -7.22, radius: 4 }
    ],
    drawOverlay: (ctx, width, height) => {
      const img = getLoadedImage('/frames/starry_cats_polaroid_3cut.png');
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, width, height);
      }
    }
  },
  {
    id: 'ocean-blue-digicam-4',
    name: 'Ocean Blue & Digicam iPod',
    category: 'pinterest',
    subCategory: 'neutral',
    orientation: 'portrait',
    slotCount: 4,
    width: 576,
    height: 1024,
    tag: '🌊 4 Foto (2 Polaroid + iPod + Digicam)',
    description: 'Nuansa biru laut Mediterania, penyu laut, bintang laut, 2 polaroid, 1 layar iPod, dan 1 kamera digital',
    bgColor: '#0284c7',
    textColor: '#e0f2fe',
    bgImageSrc: '/frames/ocean_blue_digicam_4cut.jpg',
    overlayImageSrc: '/frames/ocean_blue_digicam_4cut.png',
    slots: [
      { id: 1, cx: 391, cy: 264, width: 286, height: 290, rotate: 5.24, radius: 8 },
      { id: 2, cx: 199, cy: 650, width: 330, height: 325, rotate: -12.05, radius: 8 },
      { id: 3, cx: 475, cy: 723, width: 198, height: 198, rotate: 8.08, radius: 10 },
      { id: 4, cx: 136, cy: 905, width: 196, height: 154, rotate: 4.18, radius: 6 }
    ],
    drawOverlay: (ctx, width, height) => {
      const img = getLoadedImage('/frames/ocean_blue_digicam_4cut.png');
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, width, height);
      }
    }
  },
  {
    id: 'pinterest-y2k-pink-4',
    name: 'Life 4-Cut Y2K Pink Ribbon',
    category: 'pinterest',
    subCategory: 'girl',
    orientation: 'portrait',
    slotCount: 4,
    width: 600,
    height: 1066,
    tag: '🔥 Pinterest Korean 4-Cut',
    description: 'Frame Korean 4-Cut 2x2 grid bernuansa soft lilac-pink, pita ribbon, bunny, dan slot tanggal',
    bgColor: '#f5d0fe',
    textColor: '#86198f',
    bgImageSrc: '/frames/y2k_pink_grid.jpg',
    slots: [
      { id: 1, x: 53, y: 210, width: 232, height: 310, radius: 10 },
      { id: 2, x: 315, y: 210, width: 232, height: 310, radius: 10 },
      { id: 3, x: 53, y: 580, width: 232, height: 310, radius: 10 },
      { id: 4, x: 315, y: 580, width: 232, height: 310, radius: 10 }
    ],
    drawBackground: (ctx, width, height) => {
      const img = getLoadedImage('/frames/y2k_pink_grid.jpg');
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, width, height);
      }
    },
    drawDecorations: (ctx, width, height) => {
      ctx.save();
      ctx.fillStyle = '#701a75';
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      const today = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
      ctx.fillText(`♥ ${today}`, 60, 975);
      ctx.fillText(`♥ SEOUL × DUOBOOTH ONLINE`, 60, 1000);
      ctx.restore();
    }
  },
  {
    id: 'pinterest-cyber-acid-3',
    name: 'Cyber Zone Neon HUD (3-Cut)',
    category: 'pinterest',
    subCategory: 'boy',
    orientation: 'landscape',
    slotCount: 3,
    width: 600,
    height: 1066,
    tag: '🔥 Pinterest Cyberpunk 3-Cut',
    description: 'Frame streetwear 3 foto dengan bingkai HUD neon cyan, lime, purple, chrome star, dan barcode',
    bgColor: '#05070d',
    textColor: '#00f0ff',
    bgImageSrc: '/frames/cyber_acid_3cut.jpg',
    slots: [
      { id: 1, x: 114, y: 130, width: 372, height: 252, radius: 8 },
      { id: 2, x: 114, y: 402, width: 372, height: 252, radius: 8 },
      { id: 3, x: 114, y: 680, width: 372, height: 252, radius: 8 }
    ],
    drawBackground: (ctx, width, height) => {
      const img = getLoadedImage('/frames/cyber_acid_3cut.jpg');
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, width, height);
      }
    },
    drawDecorations: (ctx, width, height) => {
      ctx.save();
      ctx.fillStyle = '#00f0ff';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`REC // SESSION_ONLINE`, 125, 145);
      ctx.restore();
    }
  },
  {
    id: 'pinterest-haru-blue-4',
    name: 'Haru Film Soft Sky Blue',
    category: 'pinterest',
    subCategory: 'neutral',
    orientation: 'landscape',
    slotCount: 4,
    width: 600,
    height: 1066,
    tag: '🔥 Haru Film Signature',
    description: 'Aesthetic Haru Film pastel baby blue dengan awan putih, kupu-kupu biru, dan tipografi Photoism',
    bgColor: '#bae6fd',
    textColor: '#0284c7',
    bgImageSrc: '/frames/haru_baby_blue.jpg',
    slots: [
      { id: 1, x: 202, y: 246, width: 196, height: 138, radius: 6 },
      { id: 2, x: 202, y: 400, width: 196, height: 138, radius: 6 },
      { id: 3, x: 202, y: 556, width: 196, height: 138, radius: 6 },
      { id: 4, x: 202, y: 712, width: 196, height: 138, radius: 6 }
    ],
    drawBackground: (ctx, width, height) => {
      const img = getLoadedImage('/frames/haru_baby_blue.jpg');
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, width, height);
      }
    }
  },

  // ========================================================
  // 2. NEW TRENDY GEN-Z DESIGNS (Vector/SVG High-Detail)
  // ========================================================

  // A. Coquette Cherry Gingham (4-Cut Strip)
  {
    id: 'coquette-cherry-4',
    name: 'Coquette Cherry Gingham (4-Cut)',
    category: 'girl',
    subCategory: 'pinterest',
    orientation: 'landscape',
    slotCount: 4,
    width: 600,
    height: 1800,
    tag: '🍒 Viral Coquette 4-Cut',
    description: 'Pola gingham pink-putih dengan stiker buah ceri merah, pita satin merah, mutiara dan hangul Korea',
    bgColor: '#fff1f2',
    textColor: '#e11d48',
    previewSvg: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 500">
        <defs>
          <pattern id="gingham" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="#fff1f2"/>
            <rect width="10" height="20" fill="#ffe4e6" opacity="0.6"/>
            <rect width="20" height="10" fill="#ffe4e6" opacity="0.6"/>
          </pattern>
        </defs>
        <rect width="300" height="500" fill="url(#gingham)"/>
        <text x="150" y="28" font-family="sans-serif" font-weight="bold" font-size="13" fill="#e11d48" text-anchor="middle">체리 블룸 🍒 DUOBOOTH</text>
        <rect x="25" y="40" width="250" height="95" rx="8" fill="#fda4af" stroke="#fff" stroke-width="3"/>
        <rect x="25" y="145" width="250" height="95" rx="8" fill="#fda4af" stroke="#fff" stroke-width="3"/>
        <rect x="25" y="250" width="250" height="95" rx="8" fill="#fda4af" stroke="#fff" stroke-width="3"/>
        <rect x="25" y="355" width="250" height="95" rx="8" fill="#fda4af" stroke="#fff" stroke-width="3"/>
        <text x="150" y="475" font-family="serif" font-style="italic" font-weight="bold" font-size="15" fill="#be123c" text-anchor="middle">Cherry Sweet Heart ♡</text>
        <circle cx="280" cy="470" r="10" fill="#e11d48"/>
        <circle cx="270" cy="475" r="10" fill="#be123c"/>
      </svg>
    `),
    slots: [
      { id: 1, x: 45, y: 70, width: 510, height: 350, radius: 14 },
      { id: 2, x: 45, y: 450, width: 510, height: 350, radius: 14 },
      { id: 3, x: 45, y: 830, width: 510, height: 350, radius: 14 },
      { id: 4, x: 45, y: 1210, width: 510, height: 350, radius: 14 }
    ],
    drawBackground: (ctx, width, height) => {
      // Draw gingham plaid pattern
      ctx.fillStyle = '#fff1f2';
      ctx.fillRect(0, 0, width, height);

      const size = 30;
      ctx.fillStyle = 'rgba(254, 205, 211, 0.45)';
      for (let x = 0; x < width; x += size * 2) {
        ctx.fillRect(x, 0, size, height);
      }
      for (let y = 0; y < height; y += size * 2) {
        ctx.fillRect(0, y, width, size);
      }
    },
    drawDecorations: (ctx, width, height) => {
      ctx.save();
      // Header
      ctx.fillStyle = '#be123c';
      ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🍒 체리 블룸  •  SWEET MEMORY 🍒', width / 2, 45);

      // Footer
      const footerY = 1630;
      ctx.fillStyle = '#9f1239';
      ctx.font = 'italic 700 24px "Playfair Display", serif';
      ctx.fillText('Sweetest Moments with You ♡', width / 2, footerY);

      ctx.font = '13px monospace';
      ctx.fillStyle = '#e11d48';
      const today = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' });
      ctx.fillText(`CHERRY COQUETTE EDITION  •  ${today}`, width / 2, footerY + 28);

      // Cherry pairs doodles
      drawCherryPair(ctx, 50, footerY + 10);
      drawCherryPair(ctx, width - 50, footerY + 10);
      drawRibbonBow(ctx, width / 2, footerY + 50, '#f43f5e');
      ctx.restore();
    }
  },

  // B. Y2K Cyber Goth Chrome Star (4-Cut Strip)
  {
    id: 'cyber-goth-chrome-4',
    name: 'Y2K Cyber Chrome Star (4-Cut)',
    category: 'boy',
    subCategory: 'pinterest',
    orientation: 'landscape',
    slotCount: 4,
    width: 600,
    height: 1800,
    tag: '⚡ Y2K Chrome Street 4-Cut',
    description: 'Background gelap metalik dengan bintang 3D chrome cair, graffiti tribal cyber, dan border neon',
    bgColor: '#06080e',
    textColor: '#00f0ff',
    previewSvg: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 500">
        <rect width="300" height="500" fill="#090d16"/>
        <line x1="0" y1="50" x2="300" y2="50" stroke="#00f0ff" stroke-width="1" opacity="0.3"/>
        <text x="150" y="30" font-family="monospace" font-weight="bold" font-size="12" fill="#00f0ff" text-anchor="middle">✦ CYBER ARCHIVE // 2026 ✦</text>
        <rect x="25" y="45" width="250" height="92" rx="4" fill="#131b2e" stroke="#00f0ff" stroke-width="1.5"/>
        <rect x="25" y="147" width="250" height="92" rx="4" fill="#131b2e" stroke="#a3e635" stroke-width="1.5"/>
        <rect x="25" y="249" width="250" height="92" rx="4" fill="#131b2e" stroke="#c084fc" stroke-width="1.5"/>
        <rect x="25" y="351" width="250" height="92" rx="4" fill="#131b2e" stroke="#00f0ff" stroke-width="1.5"/>
        <text x="150" y="470" font-family="sans-serif" font-weight="bold" font-size="14" fill="#fff" text-anchor="middle">STAY WILD // NEO TOKYO</text>
      </svg>
    `),
    slots: [
      { id: 1, x: 45, y: 70, width: 510, height: 350, radius: 4 },
      { id: 2, x: 45, y: 450, width: 510, height: 350, radius: 4 },
      { id: 3, x: 45, y: 830, width: 510, height: 350, radius: 4 },
      { id: 4, x: 45, y: 1210, width: 510, height: 350, radius: 4 }
    ],
    drawBackground: (ctx, width, height) => {
      ctx.fillStyle = '#06080e';
      ctx.fillRect(0, 0, width, height);

      // Fine cyber grid lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    },
    drawDecorations: (ctx, width, height) => {
      ctx.save();
      // Header
      ctx.fillStyle = '#00f0ff';
      ctx.font = 'bold 20px "Space Grotesk", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('[SYSTEM:ONLINE // ARCHIVE-04]', 45, 48);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#a3e635';
      ctx.font = 'bold 14px monospace';
      ctx.fillText('NEO_DUO // 99.9%', width - 45, 48);

      // Footer
      const footerY = 1630;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('STAY WILD • FOREVER CORE', width / 2, footerY);

      // Giant barcode
      const barX = width / 2 - 130;
      const barY = footerY + 18;
      ctx.fillStyle = '#00f0ff';
      const bars = [4, 1, 3, 2, 4, 1, 3, 2, 4, 1, 2, 4, 3, 1, 2, 4, 1, 3, 2, 4, 1, 3, 2, 4, 1, 4, 2, 3];
      let cx = barX;
      for (const b of bars) {
        ctx.fillRect(cx, barY, b, 28);
        cx += b + 3;
      }

      ctx.fillStyle = '#a1a1aa';
      ctx.font = '10px monospace';
      ctx.fillText('01101001 01101110 01100110 01101001', width / 2, barY + 42);

      // Chrome stars on corners
      drawChromeStar(ctx, 40, footerY + 20, 24);
      drawChromeStar(ctx, width - 40, footerY + 20, 24);
      ctx.restore();
    }
  },

  // C. Sanrio Pastel Kitty & Cloud (2-Cut Duo Polaroid)
  {
    id: 'sanrio-kitty-2',
    name: 'Sanrio Pastel Kitty (2-Cut)',
    category: 'girl',
    subCategory: 'pinterest',
    orientation: 'landscape',
    slotCount: 2,
    width: 600,
    height: 1100,
    tag: '🐱 Sanrio Kawaii 2-Cut',
    description: 'Nuansa soft cream pastel dengan stiker telinga kucing, awan empuk, cakar kucing, dan pita manis',
    bgColor: '#fffbeb',
    textColor: '#f43f5e',
    previewSvg: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 500">
        <rect width="300" height="500" fill="#fffbeb"/>
        <text x="150" y="32" font-family="sans-serif" font-weight="bold" font-size="14" fill="#f43f5e" text-anchor="middle">오늘의 기억 🐱 SWEET PAWS</text>
        <rect x="25" y="45" width="250" height="185" rx="16" fill="#ffe4e6" stroke="#f43f5e" stroke-width="2"/>
        <rect x="25" y="245" width="250" height="185" rx="16" fill="#ffe4e6" stroke="#f43f5e" stroke-width="2"/>
        <text x="150" y="468" font-family="serif" font-style="italic" font-weight="bold" font-size="16" fill="#be123c" text-anchor="middle">Together Forever with You ♡</text>
      </svg>
    `),
    slots: [
      { id: 1, x: 50, y: 70, width: 500, height: 420, radius: 20 },
      { id: 2, x: 50, y: 520, width: 500, height: 420, radius: 20 }
    ],
    drawBackground: (ctx, width, height) => {
      // Warm vanilla cream gradient
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#fffbeb');
      grad.addColorStop(1, '#fef2f2');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    },
    drawDecorations: (ctx, width, height) => {
      ctx.save();
      // Top header with cat ears tag
      ctx.fillStyle = '#fda4af';
      ctx.beginPath();
      ctx.roundRect(width / 2 - 120, 18, 240, 36, 18);
      ctx.fill();

      ctx.fillStyle = '#be123c';
      ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('오늘의 기억 ♡ SWEET PAWS 🐱', width / 2, 42);

      // Bottom footer
      const footerY = 985;
      ctx.fillStyle = '#9f1239';
      ctx.font = 'italic 700 24px "Playfair Display", serif';
      ctx.fillText('Together Forever with You ♡', width / 2, footerY);

      ctx.font = '14px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#fb7185';
      const today = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
      ctx.fillText(`DUOBOOTH KAWAII EDITION  •  ${today}`, width / 2, footerY + 30);

      // Cute paw prints
      drawPawPrint(ctx, 45, footerY + 15, '#fb7185');
      drawPawPrint(ctx, width - 45, footerY + 15, '#fb7185');
      ctx.restore();
    }
  },

  // D. 90s Retro Camcorder & CD Glitch (3-Cut Strip)
  {
    id: 'retro-90s-camcorder-3',
    name: '90s Camcorder & Mixtape (3-Cut)',
    category: 'neutral',
    subCategory: 'pinterest',
    orientation: 'landscape',
    slotCount: 3,
    width: 600,
    height: 1450,
    tag: '📼 Retro 90s Vapor 3-Cut',
    description: 'Aesthetic camcorder REC 90-an dengan piringan CD holografik, pita kaset, dan warna sunset hangat',
    bgColor: '#1c1917',
    textColor: '#f97316',
    previewSvg: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 500">
        <rect width="300" height="500" fill="#1c1917"/>
        <text x="30" y="32" font-family="monospace" font-weight="bold" font-size="13" fill="#ef4444">● REC 00:42:19</text>
        <text x="270" y="32" font-family="monospace" font-weight="bold" font-size="11" fill="#f59e0b" text-anchor="end">SP 📼 1998</text>
        <rect x="25" y="45" width="250" height="115" rx="6" fill="#292524" stroke="#f97316" stroke-width="2"/>
        <rect x="25" y="175" width="250" height="115" rx="6" fill="#292524" stroke="#f97316" stroke-width="2"/>
        <rect x="25" y="305" width="250" height="115" rx="6" fill="#292524" stroke="#f97316" stroke-width="2"/>
        <text x="150" y="460" font-family="sans-serif" font-weight="bold" font-size="14" fill="#fb923c" text-anchor="middle">MIXTAPE MEMORIES // VOL. 01</text>
      </svg>
    `),
    slots: [
      { id: 1, x: 45, y: 75, width: 510, height: 380, radius: 8 },
      { id: 2, x: 45, y: 485, width: 510, height: 380, radius: 8 },
      { id: 3, x: 45, y: 895, width: 510, height: 380, radius: 8 }
    ],
    drawBackground: (ctx, width, height) => {
      ctx.fillStyle = '#181514';
      ctx.fillRect(0, 0, width, height);
    },
    drawDecorations: (ctx, width, height) => {
      ctx.save();
      // Camcorder OSD
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 18px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('● REC 00:42:19', 45, 48);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 15px monospace';
      ctx.fillText('SP 📼 1998 // BATT [||||]', width - 45, 48);

      // Footer
      const footerY = 1330;
      ctx.fillStyle = '#fb923c';
      ctx.font = 'bold 22px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MIXTAPE MEMORIES // VOL. 01', width / 2, footerY);

      ctx.fillStyle = '#fdba74';
      ctx.font = '13px monospace';
      ctx.fillText('HI-FI STEREO • ANALOG CAMCORDER CASSETTE', width / 2, footerY + 28);
      ctx.restore();
    }
  },

  // E. Japanese Manga Anime Panels (4-Cut 2x2 Grid)
  {
    id: 'manga-anime-grid-4',
    name: 'Manga Comic Panels (4-Grid)',
    category: 'neutral',
    subCategory: 'boy',
    orientation: 'portrait',
    slotCount: 4,
    width: 900,
    height: 1050,
    tag: '🍙 Japanese Manga 2x2 Grid',
    description: 'Layout panel komik manga Jepang dengan efek halftone screentone, balon kata, dan garis aksi',
    bgColor: '#ffffff',
    textColor: '#18181b',
    previewSvg: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 350">
        <rect width="300" height="350" fill="#ffffff"/>
        <text x="20" y="26" font-family="sans-serif" font-weight="900" font-size="14" fill="#18181b">DUO MANGA // デュオ</text>
        <rect x="20" y="38" width="125" height="135" fill="#f4f4f5" stroke="#18181b" stroke-width="3"/>
        <rect x="155" y="38" width="125" height="135" fill="#f4f4f5" stroke="#18181b" stroke-width="3"/>
        <rect x="20" y="185" width="125" height="135" fill="#f4f4f5" stroke="#18181b" stroke-width="3"/>
        <rect x="155" y="185" width="125" height="135" fill="#f4f4f5" stroke="#18181b" stroke-width="3"/>
      </svg>
    `),
    slots: [
      { id: 1, x: 45, y: 70, width: 385, height: 395, radius: 4 },
      { id: 2, x: 470, y: 70, width: 385, height: 395, radius: 4 },
      { id: 3, x: 45, y: 495, width: 385, height: 395, radius: 4 },
      { id: 4, x: 470, y: 495, width: 385, height: 395, radius: 4 }
    ],
    drawBackground: (ctx, width, height) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Manga halftone dots pattern
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      for (let x = 0; x < width; x += 12) {
        for (let y = 0; y < height; y += 12) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
    drawDecorations: (ctx, width, height) => {
      ctx.save();
      // Thick manga comic borders around slots
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 4;
      ctx.strokeRect(45, 70, 385, 395);
      ctx.strokeRect(470, 70, 385, 395);
      ctx.strokeRect(45, 495, 385, 395);
      ctx.strokeRect(470, 495, 385, 395);

      // Header
      ctx.fillStyle = '#18181b';
      ctx.font = '900 24px "Space Grotesk", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('DUO COMIC ARCHIVE // デュオブース', 45, 45);

      // Footer
      const footerY = 940;
      ctx.fillStyle = '#18181b';
      ctx.font = '900 28px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ドキドキ! ★ SPECIAL CHAPTER', width / 2, footerY);

      ctx.font = '13px monospace';
      ctx.fillStyle = '#71717a';
      ctx.fillText('EPISODE: BESTIES ON AIR // TO BE CONTINUED ▶', width / 2, footerY + 28);
      ctx.restore();
    }
  },

  // F. Y2K Frutiger Aqua Water Ripple (3-Cut Strip)
  {
    id: 'frutiger-aqua-3',
    name: 'Frutiger Aqua 2000s (3-Cut)',
    category: 'girl',
    subCategory: 'neutral',
    orientation: 'landscape',
    slotCount: 3,
    width: 600,
    height: 1450,
    tag: '🌊 Y2K Aqua Aesthetic 3-Cut',
    description: 'Nuansa Frutiger Aero tahun 2000-an dengan gradasi air aqua jernih, gelembung glossy, dan sayap perak',
    bgColor: '#e0f2fe',
    textColor: '#0284c7',
    previewSvg: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 500">
        <defs>
          <linearGradient id="aqua" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="100%" stop-color="#0284c7"/>
          </linearGradient>
        </defs>
        <rect width="300" height="500" fill="url(#aqua)"/>
        <text x="150" y="32" font-family="sans-serif" font-weight="bold" font-size="13" fill="#ffffff" text-anchor="middle">AQUA HEAVEN // 2000s</text>
        <rect x="25" y="45" width="250" height="115" rx="12" fill="#bae6fd" stroke="#ffffff" stroke-width="2.5"/>
        <rect x="25" y="175" width="250" height="115" rx="12" fill="#bae6fd" stroke="#ffffff" stroke-width="2.5"/>
        <rect x="25" y="305" width="250" height="115" rx="12" fill="#bae6fd" stroke="#ffffff" stroke-width="2.5"/>
        <text x="150" y="465" font-family="serif" font-style="italic" font-weight="bold" font-size="15" fill="#ffffff" text-anchor="middle">Crystal Pure Memories ♡</text>
      </svg>
    `),
    slots: [
      { id: 1, x: 45, y: 75, width: 510, height: 380, radius: 16 },
      { id: 2, x: 45, y: 485, width: 510, height: 380, radius: 16 },
      { id: 3, x: 45, y: 895, width: 510, height: 380, radius: 16 }
    ],
    drawBackground: (ctx, width, height) => {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#38bdf8');
      grad.addColorStop(0.5, '#0ea5e9');
      grad.addColorStop(1, '#0284c7');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw water bubbles
      drawGlossyBubble(ctx, 40, 100, 18);
      drawGlossyBubble(ctx, width - 40, 300, 24);
      drawGlossyBubble(ctx, 35, 700, 14);
      drawGlossyBubble(ctx, width - 35, 1100, 22);
    },
    drawDecorations: (ctx, width, height) => {
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🌊 AQUA PARADISE // 2000s 🐬', width / 2, 45);

      const footerY = 1340;
      ctx.font = 'italic 700 24px "Playfair Display", serif';
      ctx.fillText('Crystal Pure Memories ♡', width / 2, footerY);

      ctx.font = '13px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#e0f2fe';
      const today = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' });
      ctx.fillText(`FRUTIGER AERO ARCHIVE  •  ${today}`, width / 2, footerY + 28);
      ctx.restore();
    }
  },

  // G. Retro 70s Motel Key & Sunset (3-Cut Strip)
  {
    id: 'retro-70s-motel-3',
    name: 'Retro 70s Sunset Motel (3-Cut)',
    category: 'neutral',
    subCategory: 'pinterest',
    orientation: 'landscape',
    slotCount: 3,
    width: 600,
    height: 1450,
    tag: '🌅 Retro Motel 70s 3-Cut',
    description: 'Garis lengkung vintage warna mustard, terakota, dan krem dengan grafis gantungan kunci motel',
    bgColor: '#fef3c7',
    textColor: '#9a3412',
    previewSvg: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 500">
        <rect width="300" height="500" fill="#fef3c7"/>
        <text x="150" y="32" font-family="serif" font-weight="bold" font-size="14" fill="#9a3412" text-anchor="middle">SUNSET MOTEL // ROOM 204</text>
        <rect x="25" y="45" width="250" height="115" rx="20" fill="#fed7aa" stroke="#c2410c" stroke-width="2"/>
        <rect x="25" y="175" width="250" height="115" rx="20" fill="#fed7aa" stroke="#c2410c" stroke-width="2"/>
        <rect x="25" y="305" width="250" height="115" rx="20" fill="#fed7aa" stroke="#c2410c" stroke-width="2"/>
        <text x="150" y="465" font-family="serif" font-style="italic" font-weight="bold" font-size="15" fill="#ea580c" text-anchor="middle">Golden Hours Together ☀</text>
      </svg>
    `),
    slots: [
      { id: 1, x: 45, y: 75, width: 510, height: 380, radius: 24 },
      { id: 2, x: 45, y: 485, width: 510, height: 380, radius: 24 },
      { id: 3, x: 45, y: 895, width: 510, height: 380, radius: 24 }
    ],
    drawBackground: (ctx, width, height) => {
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(0, 0, width, height);

      // 70s wavy lines at footer
      ctx.strokeStyle = '#fb923c';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(0, height - 80);
      ctx.bezierCurveTo(200, height - 120, 400, height - 40, width, height - 80);
      ctx.stroke();

      ctx.strokeStyle = '#c2410c';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(0, height - 60);
      ctx.bezierCurveTo(200, height - 100, 400, height - 20, width, height - 60);
      ctx.stroke();
    },
    drawDecorations: (ctx, width, height) => {
      ctx.save();
      ctx.fillStyle = '#9a3412';
      ctx.font = 'italic 700 24px "Playfair Display", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('Sunset Motel • Room 204 ☀', width / 2, 45);

      const footerY = 1330;
      ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('GOLDEN HOURS ARCHIVE', width / 2, footerY);

      ctx.font = '13px monospace';
      ctx.fillStyle = '#ea580c';
      const today = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
      ctx.fillText(`DUO MOTEL KEY  •  ${today}`, width / 2, footerY + 25);
      ctx.restore();
    }
  },

  // ========================================================
  // 3. CLASSIC & MINIMALIST BUILTINS
  // ========================================================
  {
    id: 'ticket-stub-3',
    name: 'Tokyo Flight Boarding Pass (3-Cut)',
    category: 'boy',
    orientation: 'landscape',
    slotCount: 3,
    width: 600,
    height: 1450,
    tag: '⚡ Aviation Ticket 3-Cut',
    description: 'Desain boarding pass pesawat dengan lubang tiket, kode bandara TYO-SEL, barcode, dan font industrial',
    bgColor: '#f8fafc',
    textColor: '#0f172a',
    slots: [
      { id: 1, x: 45, y: 110, width: 510, height: 340, radius: 4 },
      { id: 2, x: 45, y: 480, width: 510, height: 340, radius: 4 },
      { id: 3, x: 45, y: 850, width: 510, height: 340, radius: 4 }
    ],
    drawDecorations: (ctx, width, height) => {
      ctx.save();
      ctx.fillStyle = '#060910';
      ctx.beginPath();
      ctx.arc(0, 460, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(width, 460, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#cbd5e1';
      ctx.setLineDash([8, 8]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(30, 460);
      ctx.lineTo(width - 30, 460);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 20px "Space Grotesk", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('BOARDING PASS // AIR-DUO', 45, 50);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 14px monospace';
      ctx.fillText('GATE 07 • FLT #DUO-26', width - 45, 50);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 28px "Space Grotesk", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('JKT ✈ TYO', 45, 88);

      const footerY = 1260;
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 18px "Space Grotesk", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('PASSENGER: BESTIES // DUAL-SEAT', 45, footerY);

      ctx.font = '13px monospace';
      ctx.fillStyle = '#64748b';
      ctx.fillText('CLASS: FIRST PRIORITY • NON-REFUNDABLE MEMORY', 45, footerY + 24);

      const barX = 45;
      const barY = footerY + 45;
      ctx.fillStyle = '#0f172a';
      const bars = [5, 2, 4, 1, 6, 2, 3, 5, 2, 1, 6, 3, 2, 4, 1, 6, 2, 3, 5, 2, 4, 1, 6, 3, 2, 4, 1, 6, 3, 5, 2, 4];
      let bx = barX;
      for (const b of bars) {
        ctx.fillRect(bx, barY, b, 44);
        bx += b + 3;
      }
      ctx.restore();
    }
  },
  {
    id: 'street-grid-4',
    name: 'Street Pulse 2x2 Grid',
    category: 'boy',
    orientation: 'portrait',
    slotCount: 4,
    width: 900,
    height: 1050,
    tag: 'Urban 2x2 Grid',
    description: 'Grid modern 4 kotak (2 baris x 2 kolom) bergaya urban street wear dengan barcode',
    bgColor: '#12141c',
    textColor: '#00ff9f',
    slots: [
      { id: 1, x: 45, y: 80, width: 385, height: 385, radius: 10 },
      { id: 2, x: 470, y: 80, width: 385, height: 385, radius: 10 },
      { id: 3, x: 45, y: 495, width: 385, height: 385, radius: 10 },
      { id: 4, x: 470, y: 495, width: 385, height: 385, radius: 10 }
    ],
    drawDecorations: (ctx, width, height) => {
      ctx.save();
      ctx.fillStyle = '#00ff9f';
      ctx.font = 'bold 20px "Space Grotesk", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('DUOBOOTH.SYS / GRID-4', 45, 50);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#a0aec0';
      ctx.font = '13px monospace';
      ctx.fillText('EDITION 04 / 2026', width - 45, 50);

      const footerY = 940;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TWO WORLDS  ×  ONE FRAME', width / 2, footerY);

      const barX = width / 2 - 120;
      const barY = footerY + 22;
      ctx.fillStyle = '#00ff9f';
      const bars = [4, 1, 3, 2, 4, 1, 2, 3, 1, 4, 3, 1, 2, 4, 1, 3, 2, 4, 1, 2, 4, 3, 1, 3, 2, 4];
      let cx = barX;
      for (const b of bars) {
        ctx.fillRect(cx, barY, b, 24);
        cx += b + 3;
      }
      ctx.restore();
    }
  },
  {
    id: 'matcha-cafe-3',
    name: 'Matcha Latte Cozy Cafe (3-Cut)',
    category: 'neutral',
    orientation: 'landscape',
    slotCount: 3,
    width: 600,
    height: 1450,
    tag: '✨ Cozy Korean Cafe 3-Cut',
    description: 'Nuansa matcha green aesthetic yang tenang, garis sudut lembut, dan tipografi cafe Seoul',
    bgColor: '#ecfdf5',
    textColor: '#065f46',
    slots: [
      { id: 1, x: 50, y: 80, width: 500, height: 370, radius: 24 },
      { id: 2, x: 50, y: 485, width: 500, height: 370, radius: 24 },
      { id: 3, x: 50, y: 890, width: 500, height: 370, radius: 24 }
    ],
    drawDecorations: (ctx, width, height) => {
      ctx.save();
      ctx.fillStyle = '#047857';
      ctx.font = 'italic 700 22px "Playfair Display", serif';
      ctx.textAlign = 'center';
      ctx.fillText('A Cup of Memories ☕', width / 2, 48);

      const footerY = 1340;
      ctx.fillStyle = '#065f46';
      ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('WARM & COZY DAYS ♡', width / 2, footerY);

      ctx.font = '13px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#10b981';
      const today = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
      ctx.fillText(`Cafe Seongsu Edition  •  ${today}`, width / 2, footerY + 28);
      ctx.restore();
    }
  },
  {
    id: 'film-noir-3',
    name: 'Analog Film Noir (3-Cut)',
    category: 'neutral',
    orientation: 'landscape',
    slotCount: 3,
    width: 600,
    height: 1450,
    tag: 'Classic Film Strip',
    description: 'Strip 3 foto hitam elegan dengan sprocket kamera film 35mm di tepinya',
    bgColor: '#18181b',
    textColor: '#f4f4f5',
    slots: [
      { id: 1, x: 70, y: 80, width: 460, height: 370, radius: 4 },
      { id: 2, x: 70, y: 485, width: 460, height: 370, radius: 4 },
      { id: 3, x: 70, y: 890, width: 460, height: 370, radius: 4 }
    ],
    drawDecorations: (ctx, width, height) => {
      ctx.save();
      ctx.fillStyle = '#27272a';
      const holeSize = 18;
      const holeHeight = 26;
      for (let y = 30; y < height - 40; y += 45) {
        ctx.beginPath();
        ctx.roundRect(18, y, holeSize, holeHeight, 4);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(width - 36, y, holeSize, holeHeight, 4);
        ctx.fill();
      }

      ctx.fillStyle = '#e4e4e7';
      ctx.font = 'bold 15px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('KODAK PORTRA 400  •  DUO 35MM', width / 2, 50);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('01A ▶', 75, 470);
      ctx.fillText('02A ▶', 75, 875);
      ctx.fillText('03A ▶', 75, 1280);

      const footerY = 1350;
      ctx.fillStyle = '#fafafa';
      ctx.font = 'italic 20px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('Memories in Motion', width / 2, footerY);
      ctx.font = '12px monospace';
      ctx.fillStyle = '#a1a1aa';
      ctx.fillText('DUOBOOTH ANALOG ARCHIVE', width / 2, footerY + 25);
      ctx.restore();
    }
  },
  {
    id: 'single-polaroid-1',
    name: 'Vintage Polaroid (1-Cut)',
    category: 'neutral',
    orientation: 'portrait',
    slotCount: 1,
    width: 650,
    height: 800,
    tag: 'Classic Polaroid 1-Cut',
    description: 'Format polaroid tunggal besar untuk foto berdua langsung berdampingan',
    bgColor: '#fdfbf7',
    textColor: '#292524',
    slots: [
      { id: 1, x: 50, y: 55, width: 550, height: 550, radius: 4 }
    ],
    drawDecorations: (ctx, width, height) => {
      ctx.save();
      ctx.fillStyle = '#292524';
      ctx.font = 'italic 700 28px "Playfair Display", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('Together Everywhere ♡', width / 2, 690);

      ctx.font = '14px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#78716c';
      const today = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
      ctx.fillText(today, width / 2, 730);
      ctx.restore();
    }
  }
];

// Helper: Sparkle Drawer
function drawSparkle(ctx, x, y, size, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.quadraticCurveTo(x, y, x + size, y);
  ctx.quadraticCurveTo(x, y, x, y + size);
  ctx.quadraticCurveTo(x, y, x - size, y);
  ctx.quadraticCurveTo(x, y, x, y - size);
  ctx.fill();
  ctx.restore();
}

// Helper: Draw Single Heart
function drawSingleHeart(ctx, x, y, size, angle = 0, color = '#ffffff') {
  ctx.save();
  ctx.translate(x, y);
  if (angle !== 0) ctx.rotate((angle * Math.PI) / 180);
  ctx.beginPath();
  const s = size / 20;
  ctx.moveTo(0, -4 * s);
  ctx.bezierCurveTo(-9 * s, -16 * s, -20 * s, -3 * s, 0, 16 * s);
  ctx.bezierCurveTo(20 * s, -3 * s, 9 * s, -16 * s, 0, -4 * s);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

// Helper: Triple Hearts cluster doodle (inspired by Korean photobooth strips)
function drawTripleHearts(ctx, x, y) {
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;

  // Heart 1: Top left
  drawSingleHeart(ctx, x - 12, y - 6, 17, -18, '#ffffff');
  // Heart 2: Top right
  drawSingleHeart(ctx, x + 8, y - 10, 13, 22, '#ffffff');
  // Heart 3: Bottom middle
  drawSingleHeart(ctx, x - 2, y + 14, 15, -6, '#ffffff');
  ctx.restore();
}

// Helper: White Ribbon Bow (inspired by Korean photobooth strips)
function drawWhiteRibbonBow(ctx, x, y) {
  ctx.save();
  ctx.strokeStyle = '#ffffff';
  ctx.fillStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Left loop
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(x - 25, y - 22, x - 55, y - 10, x - 50, y + 6);
  ctx.bezierCurveTo(x - 45, y + 18, x - 20, y + 12, x, y);
  ctx.stroke();

  // Right loop
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(x + 25, y - 22, x + 55, y - 10, x + 50, y + 6);
  ctx.bezierCurveTo(x + 45, y + 18, x + 20, y + 12, x, y);
  ctx.stroke();

  // Center knot
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fill();

  // Left tail
  ctx.beginPath();
  ctx.moveTo(x - 4, y + 5);
  ctx.bezierCurveTo(x - 22, y + 25, x - 35, y + 42, x - 42, y + 52);
  ctx.stroke();

  // Right tail
  ctx.beginPath();
  ctx.moveTo(x + 4, y + 5);
  ctx.bezierCurveTo(x + 22, y + 25, x + 35, y + 42, x + 42, y + 52);
  ctx.stroke();

  ctx.restore();
}

// Helper: Ribbon Bow Drawer
function drawRibbonBow(ctx, x, y, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.ellipse(x - 16, y, 12, 8, -0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(x + 16, y, 12, 8, 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#be185d';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(x - 4, y + 4);
  ctx.lineTo(x - 18, y + 22);
  ctx.moveTo(x + 4, y + 4);
  ctx.lineTo(x + 18, y + 22);
  ctx.stroke();
  ctx.restore();
}

// Helper: Chrome Starburst Drawer
function drawChromeStar(ctx, x, y, size) {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size * 0.2, y - size * 0.2);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x + size * 0.2, y + size * 0.2);
  ctx.lineTo(x, y + size);
  ctx.lineTo(x - size * 0.2, y + size * 0.2);
  ctx.lineTo(x - size, y);
  ctx.lineTo(x - size * 0.2, y - size * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Helper: Cherry Pair Drawer
function drawCherryPair(ctx, x, y) {
  ctx.save();
  ctx.strokeStyle = '#15803d';
  ctx.lineWidth = 2.5;

  // Stems
  ctx.beginPath();
  ctx.moveTo(x, y - 18);
  ctx.quadraticCurveTo(x - 8, y - 8, x - 12, y);
  ctx.moveTo(x, y - 18);
  ctx.quadraticCurveTo(x + 8, y - 8, x + 12, y);
  ctx.stroke();

  // Leaf
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.ellipse(x, y - 18, 8, 4, -0.4, 0, Math.PI * 2);
  ctx.fill();

  // Cherries
  ctx.fillStyle = '#e11d48';
  ctx.beginPath();
  ctx.arc(x - 12, y + 6, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 12, y + 6, 10, 0, Math.PI * 2);
  ctx.fill();

  // Highlights
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x - 15, y + 3, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 9, y + 3, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Helper: Paw Print Drawer
function drawPawPrint(ctx, x, y, color) {
  ctx.save();
  ctx.fillStyle = color;
  // Main pad
  ctx.beginPath();
  ctx.ellipse(x, y + 6, 12, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  // Toes
  ctx.beginPath();
  ctx.arc(x - 12, y - 6, 4.5, 0, Math.PI * 2);
  ctx.arc(x - 4, y - 10, 5, 0, Math.PI * 2);
  ctx.arc(x + 4, y - 10, 5, 0, Math.PI * 2);
  ctx.arc(x + 12, y - 6, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Helper: Glossy Bubble Drawer
function drawGlossyBubble(ctx, x, y, r) {
  ctx.save();
  const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 2, x, y, r);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
  grad.addColorStop(0.6, 'rgba(56, 189, 248, 0.35)');
  grad.addColorStop(1, 'rgba(2, 132, 199, 0.15)');
  ctx.fillStyle = grad;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

// Custom Pinterest Frame Generator Helper
export function createCustomPinterestFrame(customImage, slotCount = 4, layout = 'vertical') {
  const width = customImage.naturalWidth || 600;
  const height = customImage.naturalHeight || 1800;

  let slots = [];
  const paddingX = Math.round(width * 0.08);
  const paddingTop = Math.round(height * 0.06);
  const paddingBottom = Math.round(height * 0.12);
  const usableHeight = height - paddingTop - paddingBottom;
  const usableWidth = width - (paddingX * 2);

  if (layout === 'vertical' || slotCount === 1) {
    const gap = Math.round(usableHeight * 0.035);
    const totalGaps = (slotCount - 1) * gap;
    const slotHeight = Math.round((usableHeight - totalGaps) / slotCount);
    const slotWidth = usableWidth;

    for (let i = 0; i < slotCount; i++) {
      slots.push({
        id: i + 1,
        x: paddingX,
        y: paddingTop + i * (slotHeight + gap),
        width: slotWidth,
        height: slotHeight,
        radius: 8
      });
    }
  } else if (layout === 'grid' && slotCount === 4) {
    const gapX = Math.round(usableWidth * 0.04);
    const gapY = Math.round(usableHeight * 0.04);
    const slotWidth = Math.round((usableWidth - gapX) / 2);
    const slotHeight = Math.round((usableHeight - gapY) / 2);

    slots = [
      { id: 1, x: paddingX, y: paddingTop, width: slotWidth, height: slotHeight, radius: 8 },
      { id: 2, x: paddingX + slotWidth + gapX, y: paddingTop, width: slotWidth, height: slotHeight, radius: 8 },
      { id: 3, x: paddingX, y: paddingTop + slotHeight + gapY, width: slotWidth, height: slotHeight, radius: 8 },
      { id: 4, x: paddingX + slotWidth + gapX, y: paddingTop + slotHeight + gapY, width: slotWidth, height: slotHeight, radius: 8 }
    ];
  }

  return {
    id: `custom-pinterest-${Date.now()}`,
    name: `Pinterest Custom (${slotCount}-Frame)`,
    category: 'custom',
    slotCount: slotCount,
    width: width,
    height: height,
    tag: `Custom Pinterest (${slotCount} Foto)`,
    description: `Bingkai upload dari Pinterest yang otomatis disesuaikan untuk ${slotCount} pose foto`,
    customImage: customImage,
    slots: slots,
    orientation: (slots[0] && slots[0].width >= slots[0].height * 1.1) ? 'landscape' : 'portrait',
    drawBackground: (ctx, w, h) => {
      if (customImage) {
        ctx.drawImage(customImage, 0, 0, w, h);
      }
    }
  };
}

// Helper: Determine orientation ('portrait' | 'landscape') for any frame
export function getFrameOrientation(frame) {
  if (!frame) return 'portrait';
  if (frame.orientation) return frame.orientation;
  if (frame.slots && frame.slots.length > 0) {
    const avgAspect = frame.slots.reduce((sum, s) => sum + (s.width / s.height), 0) / frame.slots.length;
    return avgAspect >= 1.15 ? 'landscape' : 'portrait';
  }
  return 'portrait';
}

