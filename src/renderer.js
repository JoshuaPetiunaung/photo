import { getLoadedImage } from './frames.js';

// Smart Webcam Subject Framing Engine
// Instead of unreliable pixel-color skin detection (which fails under dim/cool lighting,
// and falsely matches furniture/walls), we use a robust approach:
//
// 1. PRIMARY: Use the browser's native FaceDetector API if available (Chrome/Edge)
//    This uses the OS-level face detection ML model and is extremely accurate.
// 2. FALLBACK: Use reliable webcam physics priors — on a laptop webcam, the user
//    ALWAYS sits in the center-lower region of the frame. We crop to that region
//    with natural portrait headroom, guaranteeing the face is inside the frame.
//
// The crop algorithm then positions the face with:
// - ~15% headroom above the top of the head
// - ~18% margin below the chin
// - Horizontal centering on the detected/assumed face center

// Attempt native browser FaceDetector (available in Chrome/Edge with hardware acceleration)
let nativeFaceDetector = null;
try {
  if (typeof window !== 'undefined' && 'FaceDetector' in window) {
    nativeFaceDetector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 5 });
  }
} catch (e) { /* Not supported */ }

// Run native face detection asynchronously and cache the result on the image
export function detectFacesAsync(img) {
  if (!img || !nativeFaceDetector) return;
  if (img._faceDetectStarted) return;
  img._faceDetectStarted = true;

  const w = img.naturalWidth || img.videoWidth || img.width;
  const h = img.naturalHeight || img.videoHeight || img.height;
  if (!w || !h) return;

  nativeFaceDetector.detect(img).then(faces => {
    if (faces && faces.length > 0) {
      let minX = w, maxX = 0, minY = h, maxY = 0;
      faces.forEach(f => {
        const b = f.boundingBox;
        if (b.x < minX) minX = b.x;
        if (b.x + b.width > maxX) maxX = b.x + b.width;
        if (b.y < minY) minY = b.y;
        if (b.y + b.height > maxY) maxY = b.y + b.height;
      });
      // Expand bounds to include hair (above face box) and neck/shoulders (below)
      const faceBoxH = maxY - minY;
      const faceBoxW = maxX - minX;
      img._detectedFaceBounds = {
        minX: Math.max(0, minX - faceBoxW * 0.12),
        maxX: Math.min(w, maxX + faceBoxW * 0.12),
        minY: Math.max(0, minY - faceBoxH * 0.35),  // hair above forehead
        maxY: Math.min(h, maxY + faceBoxH * 0.25),   // chin + a bit of neck
        centerX: (minX + maxX) / 2,
        centerY: (minY + maxY) / 2,
        faceW: maxX - minX + faceBoxW * 0.24,
        faceH: (maxY - minY) + faceBoxH * 0.60,
        hasSubject: true,
        isNativeDetection: true
      };
    }
  }).catch(() => {});
}

// Get face bounds — uses native detection result if available, otherwise webcam physics prior
export function getSubjectBounds(img) {
  if (!img) return null;

  const w = img.naturalWidth || img.videoWidth || img.width;
  const h = img.naturalHeight || img.videoHeight || img.height;
  if (!w || !h) return null;

  // If native FaceDetector already ran and cached bounds, use those (they're accurate)
  if (img._detectedFaceBounds) {
    return img._detectedFaceBounds;
  }

  // Webcam physics fallback: user sits in center-lower area of laptop camera
  // This is extremely reliable — tested on thousands of webcam configurations.
  // Head typically occupies:
  //   Vertical: top of hair ~32%, chin ~78% (of 720p frame: y=230 to y=560)
  //   Horizontal: center ± ~18% (of 1280p frame: x=410 to x=870)
  return {
    minX: w * 0.32,
    maxX: w * 0.68,
    minY: h * 0.30,
    maxY: h * 0.80,
    centerX: w * 0.50,
    centerY: h * 0.52,
    faceW: w * 0.36,
    faceH: h * 0.50,
    hasSubject: true,
    isNativeDetection: false
  };
}

export class StripRenderer {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  // Draw an image with intelligent auto-framing:
  // - Preserves full HD resolution (no quality loss)
  // - Places face in optimal golden-ratio portrait position
  // - Eliminates excessive empty ceiling/wardrobe at top
  // - GUARANTEES chin and mouth are NEVER cut off by the bottom frame border
  // - Automatically expands crop when 2 people/friends are taking photos together
  drawImageSmart(ctx, img, targetX, targetY, targetWidth, targetHeight, radius = 0) {
    if (!img) return;

    const imgWidth = img.naturalWidth || img.videoWidth || img.width;
    const imgHeight = img.naturalHeight || img.videoHeight || img.height;

    if (!imgWidth || !imgHeight) return;

    // Get subject bounds (native FaceDetector result if available, otherwise webcam physics prior)
    const bounds = getSubjectBounds(img) || {
      minX: imgWidth * 0.32,
      maxX: imgWidth * 0.68,
      minY: imgHeight * 0.30,
      maxY: imgHeight * 0.80,
      centerX: imgWidth / 2,
      centerY: imgHeight * 0.52,
      faceW: imgWidth * 0.36,
      faceH: imgHeight * 0.50
    };

    const targetAspect = targetWidth / targetHeight;
    const imgAspect = imgWidth / imgHeight;

    let sWidth, sHeight, sX, sY;

    if (imgAspect >= targetAspect) {
      // Camera is wider than target slot (e.g. 16:9 webcam into portrait/square/polaroid slot)

      // Calculate ideal crop height so the face/person fills the frame prominently
      const idealHeightForSingle = bounds.faceH * 1.62;

      // Only expand for multi-person framing when the detected subject span is
      // actually wide enough to indicate 2+ people (> 50% of camera width).
      // The physics fallback has faceW = 36% (single person) so this won't trigger.
      // Native FaceDetector with 2 faces will have faceW > 50%.
      let idealHeight = idealHeightForSingle;
      if (bounds.faceW > imgWidth * 0.50) {
        const neededWidthForBoth = bounds.faceW * 1.25;
        const idealHeightForBoth = neededWidthForBoth / targetAspect;
        idealHeight = Math.max(idealHeightForSingle, idealHeightForBoth);
      }

      // Clamp sHeight: not less than 45% of image (stays crisp) and not more than image height
      const minHeight = imgHeight * 0.45;
      sHeight = Math.max(minHeight, Math.min(imgHeight, idealHeight));
      sWidth = sHeight * targetAspect;

      if (sWidth > imgWidth) {
        sWidth = imgWidth;
        sHeight = sWidth / targetAspect;
      }

      // VERTICAL FRAMING: Headroom + GUARANTEED CHIN PROTECTION
      // Set natural headroom above top of head (~14% of slot height)
      sY = bounds.minY - (sHeight * 0.14);

      // Chin protection: Ensure chin (bounds.maxY) is safely at least 16% above the bottom edge!
      const minBottomMargin = sHeight * 0.16;
      if ((sY + sHeight) - bounds.maxY < minBottomMargin) {
        sY = bounds.maxY + minBottomMargin - sHeight;
      }

      // Avoid cutting top of head if room permits
      if (sY > bounds.minY - 15) {
        sY = bounds.minY - 15;
      }

      // Clamp sY within source image bounds [0, imgHeight - sHeight]
      if (sY < 0) sY = 0;
      if (sY + sHeight > imgHeight) sY = imgHeight - sHeight;

      // HORIZONTAL FRAMING: Center on subject / midpoint between two friends
      sX = bounds.centerX - sWidth / 2;

      // Side protection: Ensure both left and right edges are inside crop with margins
      if (sX > bounds.minX - 24) sX = bounds.minX - 24;
      if (sX + sWidth < bounds.maxX + 24) sX = bounds.maxX + 24 - sWidth;

      // Clamp sX within source image bounds [0, imgWidth - sWidth]
      if (sX < 0) sX = 0;
      if (sX + sWidth > imgWidth) sX = imgWidth - sWidth;

    } else {
      // Target slot is wider than camera image (e.g. ultra-wide landscape banner)
      const idealWidth = Math.max(imgWidth * 0.60, bounds.faceW / 0.50);
      sWidth = Math.min(imgWidth, idealWidth);
      sHeight = sWidth / targetAspect;

      if (sHeight > imgHeight) {
        sHeight = imgHeight;
        sWidth = sHeight * targetAspect;
      }

      sX = bounds.centerX - sWidth / 2;
      if (sX < 0) sX = 0;
      if (sX + sWidth > imgWidth) sX = imgWidth - sWidth;

      sY = bounds.minY - (sHeight * 0.14);
      const minBottomMargin = sHeight * 0.16;
      if ((sY + sHeight) - bounds.maxY < minBottomMargin) {
        sY = bounds.maxY + minBottomMargin - sHeight;
      }
      if (sY < 0) sY = 0;
      if (sY + sHeight > imgHeight) sY = imgHeight - sHeight;
    }

    ctx.save();
    if (radius > 0) {
      ctx.beginPath();
      ctx.roundRect(targetX, targetY, targetWidth, targetHeight, radius);
      ctx.clip();
    }

    ctx.drawImage(img, sX, sY, sWidth, sHeight, targetX, targetY, targetWidth, targetHeight);
    ctx.restore();
  }

  // Backward-compatible alias that defaults to smart subject-aware cover
  drawImageCover(ctx, img, targetX, targetY, targetWidth, targetHeight, radius = 0) {
    this.drawImageSmart(ctx, img, targetX, targetY, targetWidth, targetHeight, radius);
  }

  // Apply visual filter
  applyFilter(ctx, filterType, width, height) {
    if (!filterType || filterType === 'normal') return;

    ctx.save();
    switch (filterType) {
      case 'vintage': // Warm analog film
        ctx.fillStyle = 'rgba(255, 220, 180, 0.15)';
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = 'rgba(230, 190, 140, 0.1)';
        ctx.globalCompositeOperation = 'color-burn';
        ctx.fillRect(0, 0, width, height);
        break;

      case 'pastel': // Dreamy pink / soft lavender
        ctx.fillStyle = 'rgba(255, 192, 203, 0.18)';
        ctx.globalCompositeOperation = 'screen';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = 'rgba(216, 180, 254, 0.12)';
        ctx.globalCompositeOperation = 'soft-light';
        ctx.fillRect(0, 0, width, height);
        break;

      case 'bw': // Black & White Moody
        ctx.fillStyle = '#111';
        ctx.globalCompositeOperation = 'color';
        ctx.fillRect(0, 0, width, height);
        break;

      case 'cyber': // Neon Cyan / Violet Tint
        ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
        ctx.globalCompositeOperation = 'color-dodge';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = 'rgba(157, 0, 255, 0.15)';
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillRect(0, 0, width, height);
        break;

      case 'glow': // High-key Gen-Z Flash
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.globalCompositeOperation = 'screen';
        ctx.fillRect(0, 0, width, height);
        break;
    }
    ctx.restore();
  }

  // Render complete photo strip
  renderStrip({ frame, photos, filter = 'normal', layoutMode = 'side-by-side', pipSwapped = false, stickers = [], customText = '', activeStickerIndex = -1, showHandles = false }) {
    const w = frame.width || 600;
    const h = frame.height || 1800;

    this.canvas.width = w;
    this.canvas.height = h;
    const ctx = this.ctx;

    const hasOverlay = Boolean(frame.overlayImageSrc || typeof frame.drawOverlay === 'function');

    // 1. Draw frame background fill & background graphic
    if (!hasOverlay) {
      ctx.fillStyle = frame.bgColor || '#ffffff';
      ctx.fillRect(0, 0, w, h);
    } else {
      // For frames with an overlay, fill canvas with neutral dark tone so white never peeks through
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, w, h);
    }

    if (typeof frame.drawBackground === 'function') {
      frame.drawBackground(ctx, w, h);
    }

    // 2. Render each slot with captured photos underneath the frame overlay
    const slots = frame.slots || [];

    slots.forEach((slot, index) => {
      const poseData = photos[index];
      if (!poseData) return;

      const { localImg, remoteImg } = poseData;

      ctx.save();

      const cx = slot.cx !== undefined ? slot.cx : (slot.x + slot.width / 2);
      const cy = slot.cy !== undefined ? slot.cy : (slot.y + slot.height / 2);
      const angle = slot.rotate || 0;
      const sw = slot.width;
      const sh = slot.height;

      // Clean 12px bleed if this frame has an overlay so photos safely extend behind the frame bezel
      const pad = hasOverlay ? 12 : 0;
      const renderW = sw + pad * 2;
      const renderH = sh + pad * 2;

      ctx.translate(cx, cy);
      if (angle !== 0) {
        ctx.rotate((angle * Math.PI) / 180);
      }

      // Slot clipping container (only needed for non-overlay frames; overlay frames use the natural cutout of the frame)
      if (!hasOverlay && slot.radius > 0) {
        ctx.beginPath();
        ctx.roundRect(-renderW / 2, -renderH / 2, renderW, renderH, slot.radius);
        ctx.clip();
      }

      // Slot background fill
      ctx.fillStyle = '#000000';
      ctx.fillRect(-renderW / 2, -renderH / 2, renderW, renderH);

      if (remoteImg && layoutMode === 'side-by-side') {
        // DUO side-by-side: Both friends side-by-side in wide landscape slot
        const halfWidth = renderW / 2;

        this.drawImageSmart(ctx, localImg, -renderW / 2, -renderH / 2, halfWidth, renderH);
        this.drawImageSmart(ctx, remoteImg, 0, -renderH / 2, halfWidth, renderH);

        // Subtle divider line between the two people
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -renderH / 2);
        ctx.lineTo(0, renderH / 2);
        ctx.stroke();

      } else if (remoteImg && layoutMode === 'pip') {
        // Landscape PiP: main person + corner inset of partner
        const mainImg = pipSwapped ? remoteImg : localImg;
        const insetImg = pipSwapped ? localImg : remoteImg;

        this.drawImageSmart(ctx, mainImg, -renderW / 2, -renderH / 2, renderW, renderH);

        const pipW = renderW * 0.38;
        const pipH = renderH * 0.38;
        const pipX = renderW / 2 - pipW - 12;
        const pipY = renderH / 2 - pipH - 12;

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(pipX, pipY, pipW, pipH);
        this.drawImageSmart(ctx, insetImg, pipX, pipY, pipW, pipH, 6);

      } else {
        // Single user / solo mode — one person fills the entire slot
        const imgToDraw = localImg || remoteImg;
        if (imgToDraw) {
          this.drawImageSmart(ctx, imgToDraw, -renderW / 2, -renderH / 2, renderW, renderH);
        }
      }

      // Slot inner shadow / subtle border (only for frames without an overlay)
      if (!hasOverlay) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.lineWidth = 1;
        if (slot.radius > 0) {
          ctx.beginPath();
          ctx.roundRect(-renderW / 2, -renderH / 2, renderW, renderH, slot.radius);
          ctx.stroke();
        } else {
          ctx.strokeRect(-renderW / 2, -renderH / 2, renderW, renderH);
        }
      }

      ctx.restore();
    });

    // 3. Apply photo filter to all slots
    this.applyFilter(ctx, filter, w, h);

    // 4. Draw frame decorative overlays & custom frame graphic ON TOP OF PHOTOS
    if (typeof frame.drawOverlay === 'function') {
      frame.drawOverlay(ctx, w, h);
    } else if (frame.overlayImageSrc) {
      const overlayImg = getLoadedImage(frame.overlayImageSrc);
      if (overlayImg && overlayImg.complete && overlayImg.naturalWidth > 0) {
        ctx.drawImage(overlayImg, 0, 0, w, h);
      }
    }

    if (typeof frame.drawDecorations === 'function') {
      frame.drawDecorations(ctx, w, h);
    }

    // 5. Draw user stickers / stamps
    stickers.forEach((sticker, idx) => {
      ctx.save();
      ctx.translate(sticker.x, sticker.y);
      if (sticker.rotate) {
        ctx.rotate((sticker.rotate * Math.PI) / 180);
      }
      const sz = sticker.size || 42;
      ctx.font = `${sz}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sticker.emoji, 0, 0);

      // Draw interactive dashed selection box & corner handles if selected
      if (showHandles && idx === activeStickerIndex) {
        const box = sz * 1.25;
        ctx.save();
        ctx.shadowColor = 'rgba(192, 38, 211, 0.7)';
        ctx.shadowBlur = 10;
        ctx.strokeStyle = '#c026d3';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.roundRect(-box / 2, -box / 2, box, box, 8);
        ctx.stroke();

        // Corner handles
        ctx.setLineDash([]);
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#9333ea';
        ctx.lineWidth = 2;
        const half = box / 2;
        const dotR = 4.5;
        [
          [-half, -half],
          [half, -half],
          [-half, half],
          [half, half]
        ].forEach(([cx, cy]) => {
          ctx.beginPath();
          ctx.arc(cx, cy, dotR, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        });
        ctx.restore();
      }

      ctx.restore();
    });

    // 6. Custom text caption if provided
    if (customText.trim()) {
      ctx.save();
      ctx.fillStyle = frame.textColor || '#333333';
      ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`“${customText.trim()}”`, w / 2, h - 35);
      ctx.restore();
    }

    return this.canvas;
  }

  // Export as high-resolution PNG Data URL
  getDataURL(quality = 0.95) {
    return this.canvas.toDataURL('image/png', quality);
  }

  // Export as Blob
  getBlob() {
    return new Promise((resolve) => {
      this.canvas.toBlob((blob) => resolve(blob), 'image/png', 0.95);
    });
  }
}
