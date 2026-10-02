// DUOBOOTH — Gen-Z Online Photobooth Main Application Controller
import './style.css';
import confetti from 'canvas-confetti';
import { sounds } from './audio.js';
import { ParticleEngine } from './particles.js';
import { BUILTIN_FRAMES, createCustomPinterestFrame, getLoadedImage, getFrameOrientation } from './frames.js';
import { PeerService } from './peerService.js';
import { StripRenderer, detectFacesAsync } from './renderer.js';

// --- State Management ---
const state = {
  theme: localStorage.getItem('duobooth-theme') || 'girl',
  localStream: null,
  remoteStream: null,
  isMirrored: true,
  isSoloMode: false,
  peerService: new PeerService(),
  activeFrame: BUILTIN_FRAMES.find(f => getFrameOrientation(f) === 'landscape') || BUILTIN_FRAMES[0],
  framesList: [...BUILTIN_FRAMES],
  frameFilter: 'all',
  layoutMode: 'side-by-side',
  pipSwapped: false,
  capturedPhotos: [], // Array of { localImg, remoteImg }
  selectedFilter: 'normal',
  stickers: [],
  activeStickerIndex: -1,
  customCaption: '',
  pendingPinterestImg: null,
  selectedCameraId: null,
  facingMode: 'user',
  availableCameras: [],
  isCapturing: false,
  abortCapture: false,
  activePoseResolver: null
};

// Canvas & Particle instances
let particleEngine = null;
const stripRenderer = new StripRenderer();

// --- DOM Elements ---
const el = {
  html: document.documentElement,
  themeSwitch: document.getElementById('theme-switch'),
  btnSoundToggle: document.getElementById('btn-sound-toggle'),
  soundIcon: document.getElementById('sound-icon'),
  flashOverlay: document.getElementById('flash-overlay'),
  navRoomBadge: document.getElementById('nav-room-badge'),
  navRoomText: document.getElementById('nav-room-text'),

  // Views
  viewLobby: document.getElementById('view-lobby'),
  viewBooth: document.getElementById('view-booth'),
  viewResult: document.getElementById('view-result'),

  // Lobby
  lobbyVideo: document.getElementById('lobby-video'),
  lobbyCamPlaceholder: document.getElementById('lobby-cam-placeholder'),
  btnEnableCam: document.getElementById('btn-enable-cam'),
  camStatusLabel: document.getElementById('cam-status-label'),
  btnFlipCam: document.getElementById('btn-flip-cam'),
  selectCameraLobby: document.getElementById('select-camera-lobby'),
  btnSwitchCamLobby: document.getElementById('btn-switch-cam-lobby'),
  labelSwitchCamLobby: document.getElementById('label-switch-cam-lobby'),
  btnCreateRoom: document.getElementById('btn-create-room'),
  hostIdleState: document.getElementById('host-idle-state'),
  hostActiveState: document.getElementById('host-active-state'),
  displayRoomCode: document.getElementById('display-room-code'),
  btnCopyCode: document.getElementById('btn-copy-code'),
  shareLinkInput: document.getElementById('share-link-input'),
  btnCopyLink: document.getElementById('btn-copy-link'),
  btnCancelCreateRoom: document.getElementById('btn-cancel-create-room'),
  inputGuestCode: document.getElementById('input-guest-code'),
  btnJoinRoom: document.getElementById('btn-join-room'),
  joinErrorMsg: document.getElementById('join-error-msg'),
  btnSoloMode: document.getElementById('btn-solo-mode'),

  // Booth
  boothConnText: document.getElementById('booth-conn-text'),
  selectCameraBooth: document.getElementById('select-camera-booth'),
  btnSwitchCamBooth: document.getElementById('btn-switch-cam-booth'),
  labelSwitchCamBooth: document.getElementById('label-switch-cam-booth'),
  btnFlipCamBooth: document.getElementById('btn-flip-cam-booth'),
  btnLayoutSplit: document.getElementById('btn-layout-split'),
  btnLayoutPip: document.getElementById('btn-layout-pip'),
  layoutToggleGroup: document.getElementById('layout-toggle-group'),
  btnLeaveRoom: document.getElementById('btn-leave-room'),
  videoStageGrid: document.getElementById('video-stage-grid'),
  localPlayerCard: document.querySelector('.local-player-card'),
  remotePlayerCard: document.querySelector('.remote-player-card'),
  boothLocalVideo: document.getElementById('booth-local-video'),
  boothRemoteVideo: document.getElementById('booth-remote-video'),
  remoteWaitingState: document.getElementById('remote-waiting-state'),
  remotePlayerName: document.getElementById('remote-player-name'),
  emojiBurstContainer: document.getElementById('emoji-burst-container'),
  framesCarousel: document.getElementById('frames-carousel'),
  frameModeBadge: document.getElementById('frame-mode-badge'),
  frameSelectorSubtitle: document.getElementById('frame-selector-subtitle'),
  activeFrameName: document.getElementById('active-frame-name'),
  activeFrameCountBadge: document.getElementById('active-frame-count-badge'),
  btnStartCapture: document.getElementById('btn-start-capture'),

  // Countdown & Pose Preview Overlay
  captureOverlay: document.getElementById('capture-overlay'),
  countdownHud: document.getElementById('countdown-hud'),
  posePreviewHud: document.getElementById('pose-preview-hud'),
  previewPoseTitle: document.getElementById('preview-pose-title'),
  previewPoseSubtitle: document.getElementById('preview-pose-subtitle'),
  posePreviewCanvas: document.getElementById('pose-preview-canvas'),
  btnRetakePose: document.getElementById('btn-retake-pose'),
  btnContinuePose: document.getElementById('btn-continue-pose'),
  continuePoseBtnText: document.getElementById('continue-pose-btn-text'),
  btnCancelFromPreview: document.getElementById('btn-cancel-from-preview'),
  previewSyncText: document.getElementById('preview-sync-text'),
  capturePoseStep: document.getElementById('capture-pose-step'),
  captureProgressFill: document.getElementById('capture-progress-fill'),
  countdownNumber: document.getElementById('countdown-number'),
  countdownTip: document.getElementById('countdown-tip'),
  btnCancelCapture: document.getElementById('btn-cancel-capture'),

  // Result Studio
  canvasWrapper: document.getElementById('canvas-wrapper'),
  inputCustomCaption: document.getElementById('input-custom-caption'),
  btnClearStickers: document.getElementById('btn-clear-stickers'),
  stickerActiveEditor: document.getElementById('sticker-active-editor'),
  stickerSelectedBadge: document.getElementById('sticker-selected-badge'),
  stickerSelectedName: document.getElementById('sticker-selected-name'),
  btnDeleteActiveSticker: document.getElementById('btn-delete-active-sticker'),
  btnNudgeUp: document.getElementById('btn-nudge-up'),
  btnNudgeDown: document.getElementById('btn-nudge-down'),
  btnNudgeLeft: document.getElementById('btn-nudge-left'),
  btnNudgeRight: document.getElementById('btn-nudge-right'),
  btnNudgeCenter: document.getElementById('btn-nudge-center'),
  inputStickerSize: document.getElementById('input-sticker-size'),
  labelStickerSize: document.getElementById('label-sticker-size'),
  inputStickerRotate: document.getElementById('input-sticker-rotate'),
  labelStickerRotate: document.getElementById('label-sticker-rotate'),
  btnRotMinus: document.getElementById('btn-rot-minus'),
  btnRotPlus: document.getElementById('btn-rot-plus'),
  stickersChipsList: document.getElementById('stickers-chips-list'),
  btnDownloadStrip: document.getElementById('btn-download-strip'),
  btnRetakePhotos: document.getElementById('btn-retake-photos'),
  btnBackToBooth: document.getElementById('btn-back-to-booth'),

  // Pinterest Modal
  modalUploadPinterest: document.getElementById('modal-upload-pinterest'),
  btnOpenUploadModal: document.getElementById('btn-open-upload-modal'),
  btnCloseModal: document.getElementById('btn-close-modal'),
  btnCancelUpload: document.getElementById('btn-cancel-upload'),
  pinterestDropzone: document.getElementById('pinterest-dropzone'),
  inputPinterestFile: document.getElementById('input-pinterest-file'),
  pinterestPreviewImg: document.getElementById('pinterest-preview-img'),
  selectSlotCount: document.getElementById('select-slot-count'),
  selectSlotLayout: document.getElementById('select-slot-layout'),
  btnApplyPinterestFrame: document.getElementById('btn-apply-pinterest-frame'),

  // Toast Container
  toastContainer: document.getElementById('toast-container')
};

// --- Initialization ---
function init() {
  // Apply saved theme
  applyTheme(state.theme);

  // Init Dynamic Particles
  particleEngine = new ParticleEngine('bg-canvas');
  particleEngine.setTheme(state.theme);

  // Bind Listeners
  bindEvents();

  // Populate Frame Carousel
  renderFramesCarousel();

  // Auto-fill room code from URL query param if present
  const params = new URLSearchParams(window.location.search);
  const roomParam = params.get('room');
  if (roomParam && el.inputGuestCode) {
    el.inputGuestCode.value = roomParam.toUpperCase();
    showToast(`Kode room ${roomParam} terdeteksi! Klik Masuk untuk bergabung.`);
  }

  // Request camera automatically
  startCamera();
}

// --- Theme Management ---
function applyTheme(theme) {
  state.theme = theme;
  localStorage.setItem('duobooth-theme', theme);
  el.html.setAttribute('data-theme', theme);

  const girlOpt = el.themeSwitch.querySelector('.girl-opt');
  const boyOpt = el.themeSwitch.querySelector('.boy-opt');
  if (theme === 'girl') {
    girlOpt.classList.add('active');
    boyOpt.classList.remove('active');
  } else {
    boyOpt.classList.add('active');
    girlOpt.classList.remove('active');
  }

  if (particleEngine) {
    particleEngine.setTheme(theme);
  }
}

// --- Toast Notifications ---
function showToast(message, duration = 3000) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✨</span> <span>${message}</span>`;
  el.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// --- Camera Setup & Switching ---
async function populateCameraList() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(d => d.kind === 'videoinput');
    state.availableCameras = videoDevices;

    const buildOptions = () => {
      if (videoDevices.length === 0) {
        return '<option value="">Tidak ada kamera terdeteksi</option>';
      }
      return videoDevices.map((dev, idx) => {
        const label = dev.label || `Kamera ${idx + 1}`;
        const selected = dev.deviceId === state.selectedCameraId ? 'selected' : '';
        return `<option value="${dev.deviceId}" ${selected}>${label}</option>`;
      }).join('');
    };

    if (el.selectCameraLobby) {
      el.selectCameraLobby.innerHTML = buildOptions();
    }
    if (el.selectCameraBooth) {
      el.selectCameraBooth.innerHTML = buildOptions();
    }
  } catch (err) {
    console.warn('Gagal membaca daftar kamera:', err);
  }
}

async function switchCamera(deviceId) {
  state.selectedCameraId = deviceId;
  const dev = state.availableCameras.find(d => d.deviceId === deviceId);
  let facing = null;
  if (dev && dev.label) {
    const l = dev.label.toLowerCase();
    if (l.includes('back') || l.includes('rear') || l.includes('belakang') || l.includes('environment')) {
      facing = 'environment';
    } else if (l.includes('front') || l.includes('user') || l.includes('depan') || l.includes('selfie')) {
      facing = 'user';
    }
  }
  await startCamera(deviceId, facing);
  if (el.selectCameraLobby) el.selectCameraLobby.value = deviceId;
  if (el.selectCameraBooth) el.selectCameraBooth.value = deviceId;
  showToast('Kamera berhasil dialihkan! 📷');
}

function updateSwitchCameraLabels() {
  const isFront = state.facingMode !== 'environment';
  const text = isFront ? 'Kamera Depan' : 'Kamera Belakang';
  if (el.labelSwitchCamLobby) el.labelSwitchCamLobby.textContent = text;
  if (el.labelSwitchCamBooth) el.labelSwitchCamBooth.textContent = text;
}

async function toggleFrontBackCamera() {
  sounds.playPop();

  const newFacing = state.facingMode === 'user' ? 'environment' : 'user';
  state.facingMode = newFacing;

  // Try finding explicit device ID of target camera if enumerated
  let targetDeviceId = null;
  if (state.availableCameras && state.availableCameras.length >= 2) {
    const isBack = newFacing === 'environment';
    const target = state.availableCameras.find(d => {
      const l = (d.label || '').toLowerCase();
      if (isBack) {
        return l.includes('back') || l.includes('rear') || l.includes('belakang') || l.includes('environment');
      } else {
        return l.includes('front') || l.includes('user') || l.includes('depan') || l.includes('selfie');
      }
    });
    if (target) {
      targetDeviceId = target.deviceId;
    }
  }

  // Front camera defaults to mirrored selfie; rear camera should not be mirrored
  if (newFacing === 'environment') {
    state.isMirrored = false;
    el.lobbyVideo.classList.add('unmirror');
    el.boothLocalVideo.classList.add('unmirror');
  } else {
    state.isMirrored = true;
    el.lobbyVideo.classList.remove('unmirror');
    el.boothLocalVideo.classList.remove('unmirror');
  }

  updateSwitchCameraLabels();
  await startCamera(targetDeviceId, newFacing);

  const label = newFacing === 'user' ? 'Kamera Depan (Selfie)' : 'Kamera Belakang';
  showToast(`Beralih ke ${label} 📷`);
}

async function startCamera(deviceId = null, facingMode = null) {
  try {
    el.camStatusLabel.textContent = 'Meminta izin kamera...';

    // Stop existing tracks before switching to prevent camera lock
    if (state.localStream) {
      state.localStream.getTracks().forEach(track => track.stop());
    }

    const preferredFacing = facingMode || state.facingMode || 'user';
    state.facingMode = preferredFacing;

    let videoConstraints;
    if (deviceId) {
      videoConstraints = {
        deviceId: { exact: deviceId },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      };
    } else {
      videoConstraints = {
        facingMode: { ideal: preferredFacing },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      };
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: videoConstraints,
      audio: false
    });

    state.localStream = stream;
    el.lobbyVideo.srcObject = stream;
    el.boothLocalVideo.srcObject = stream;
    el.lobbyCamPlaceholder.classList.add('hidden');
    el.camStatusLabel.textContent = '🟢 Kamera siap';
    el.camStatusLabel.style.color = '#10b981';

    // Determine active deviceId and real facingMode from track settings if available
    const activeTrack = stream.getVideoTracks()[0];
    if (activeTrack) {
      const settings = activeTrack.getSettings();
      if (settings) {
        if (settings.deviceId) {
          state.selectedCameraId = settings.deviceId;
        }
        if (settings.facingMode) {
          state.facingMode = settings.facingMode;
          if (settings.facingMode === 'environment') {
            state.isMirrored = false;
            el.lobbyVideo?.classList.add('unmirror');
            el.boothLocalVideo?.classList.add('unmirror');
          } else if (settings.facingMode === 'user') {
            state.isMirrored = true;
            el.lobbyVideo?.classList.remove('unmirror');
            el.boothLocalVideo?.classList.remove('unmirror');
          }
        }
      }
    }

    updateSwitchCameraLabels();

    // Refresh list of available cameras with device labels
    await populateCameraList();

    // If already in an active WebRTC session, seamlessly replace the video track
    if (state.peerService && state.peerService.isConnected) {
      state.peerService.updateLocalStream(stream);
    }

  } catch (err) {
    console.warn('Camera error:', err);
    el.camStatusLabel.textContent = '❌ Akses kamera ditolak/tidak ditemukan';
    el.camStatusLabel.style.color = '#ef4444';
  }
}

// --- Event Listeners ---
function bindEvents() {
  // Camera dropdown change in Lobby & Booth
  if (el.selectCameraLobby) {
    el.selectCameraLobby.addEventListener('change', (e) => {
      sounds.playPop();
      if (e.target.value) switchCamera(e.target.value);
    });
  }

  if (el.selectCameraBooth) {
    el.selectCameraBooth.addEventListener('change', (e) => {
      sounds.playPop();
      if (e.target.value) switchCamera(e.target.value);
    });
  }

  // Mobile switch camera buttons (Front / Back toggle)
  if (el.btnSwitchCamLobby) {
    el.btnSwitchCamLobby.addEventListener('click', toggleFrontBackCamera);
  }
  if (el.btnSwitchCamBooth) {
    el.btnSwitchCamBooth.addEventListener('click', toggleFrontBackCamera);
  }

  if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
    navigator.mediaDevices.addEventListener('devicechange', populateCameraList);
  }

  // Theme switch click
  el.themeSwitch.addEventListener('click', (e) => {
    sounds.playPop();
    const newTheme = state.theme === 'girl' ? 'boy' : 'girl';
    applyTheme(newTheme);
  });

  // Sound toggle
  el.btnSoundToggle.addEventListener('click', () => {
    const isMuted = sounds.toggleMute();
    el.soundIcon.textContent = isMuted ? '🔇' : '🔊';
    showToast(isMuted ? 'Suara dinonaktifkan' : 'Suara aktif');
  });

  // Enable Camera button inside placeholder
  el.btnEnableCam.addEventListener('click', () => {
    sounds.playPop();
    startCamera();
  });

  // Camera Mirror (Lobby & Booth)
  const handleToggleMirror = () => {
    sounds.playPop();
    state.isMirrored = !state.isMirrored;
    if (state.isMirrored) {
      el.lobbyVideo?.classList.remove('unmirror');
      el.boothLocalVideo?.classList.remove('unmirror');
      showToast('Kamera Mirror: Aktif (Selfie) 🪞');
    } else {
      el.lobbyVideo?.classList.add('unmirror');
      el.boothLocalVideo?.classList.add('unmirror');
      showToast('Kamera Mirror: Nonaktif (Normal) 📷');
    }
  };

  if (el.btnFlipCam) el.btnFlipCam.addEventListener('click', handleToggleMirror);
  if (el.btnFlipCamBooth) el.btnFlipCamBooth.addEventListener('click', handleToggleMirror);

  // --- Host Room Creation ---
  el.btnCreateRoom.addEventListener('click', async () => {
    sounds.playPop();
    if (!state.localStream) {
      await startCamera();
    }

    const code = PeerService.generateCode();
    el.btnCreateRoom.textContent = 'Menghubungkan...';

    try {
      await state.peerService.startHost(code, state.localStream);

      el.hostIdleState.classList.add('hidden');
      el.hostActiveState.classList.remove('hidden');
      el.displayRoomCode.textContent = code;

      const shareUrl = `${window.location.origin}${window.location.pathname}?room=${code}`;
      el.shareLinkInput.value = shareUrl;

      showToast(`Room ${code} berhasil dibuat! Bagikan kodenya.`);
      setupPeerCallbacks();

    } catch (err) {
      console.error(err);
      el.btnCreateRoom.textContent = 'Buat Kode Room';
      showToast('Gagal membuat room. Silakan coba lagi.');
    }
  });

  // Cancel Host Room Creation
  if (el.btnCancelCreateRoom) {
    el.btnCancelCreateRoom.addEventListener('click', () => {
      sounds.playPop();
      state.peerService.disconnect();
      el.hostActiveState.classList.add('hidden');
      el.hostIdleState.classList.remove('hidden');
      el.btnCreateRoom.textContent = 'Buat Kode Room';
      el.displayRoomCode.textContent = '----';
      el.shareLinkInput.value = '';
      showToast('Pembuatan sesi dibatalkan');
    });
  }

  // Copy code & link
  el.btnCopyCode.addEventListener('click', () => {
    sounds.playPop();
    navigator.clipboard.writeText(el.displayRoomCode.textContent);
    showToast('Kode room disalin ke clipboard! 📋');
  });

  el.btnCopyLink.addEventListener('click', () => {
    sounds.playPop();
    navigator.clipboard.writeText(el.shareLinkInput.value);
    showToast('Link sesi disalin ke clipboard! 🔗');
  });

  // --- Join Room as Guest ---
  el.btnJoinRoom.addEventListener('click', handleJoinRoom);
  el.inputGuestCode.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') handleJoinRoom();
  });

  async function handleJoinRoom() {
    const code = el.inputGuestCode.value.trim().toUpperCase();
    if (!code) {
      el.joinErrorMsg.textContent = 'Masukkan kode sesi terlebih dahulu.';
      el.joinErrorMsg.classList.remove('hidden');
      return;
    }
    el.joinErrorMsg.classList.add('hidden');
    sounds.playPop();

    if (!state.localStream) {
      await startCamera();
    }

    el.btnJoinRoom.textContent = 'Masuk...';

    try {
      await state.peerService.joinRoom(code, state.localStream);
      setupPeerCallbacks();
      showToast(`Mencoba terhubung ke room ${code}...`);
    } catch (err) {
      console.error(err);
      el.btnJoinRoom.textContent = 'Masuk';
      el.joinErrorMsg.textContent = 'Gagal terhubung. Pastikan kode room benar dan Host sedang aktif.';
      el.joinErrorMsg.classList.remove('hidden');
    }
  }

  // --- Solo Mode (Testing without 2nd device) ---
  el.btnSoloMode.addEventListener('click', async () => {
    sounds.playPop();
    state.isSoloMode = true;
    if (!state.localStream) {
      await startCamera();
    }
    goToBoothView({
      isHost: true,
      roomCode: 'SOLO-MODE',
      solo: true
    });
    showToast('Solo Foto diaktifkan! 📸');
  });

  // Layout Toggles in Booth
  el.btnLayoutSplit.addEventListener('click', () => {
    sounds.playPop();
    setLayoutMode('side-by-side');
  });

  el.btnLayoutPip.addEventListener('click', () => {
    sounds.playPop();
    setLayoutMode('pip');
  });

  // Tap / click PiP thumbnail to swap main & corner camera
  function handlePipCardClick(e) {
    if (state.layoutMode !== 'pip' || state.isSoloMode) return;
    const isRemoteThumb = !state.pipSwapped && el.remotePlayerCard && el.remotePlayerCard.contains(e.currentTarget);
    const isLocalThumb = state.pipSwapped && el.localPlayerCard && el.localPlayerCard.contains(e.currentTarget);

    if (isRemoteThumb || isLocalThumb) {
      sounds.playPop();
      state.pipSwapped = !state.pipSwapped;
      el.videoStageGrid.classList.toggle('pip-swapped', state.pipSwapped);
      showToast(state.pipSwapped ? 'Kamera ditukar (Teman layar utama)' : 'Kamera ditukar (Kamu layar utama)');
    }
  }

  if (el.remotePlayerCard) el.remotePlayerCard.addEventListener('click', handlePipCardClick);
  if (el.localPlayerCard) el.localPlayerCard.addEventListener('click', handlePipCardClick);

  // Leave Room
  el.btnLeaveRoom.addEventListener('click', () => {
    sounds.playPop();
    if (confirm('Keluar dari sesi booth saat ini?')) {
      state.peerService.disconnect();
      returnToLobby();
    }
  });

  // Emoji Reactions
  document.querySelectorAll('.emoji-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const emoji = btn.dataset.emoji;
      sounds.playPop();
      spawnFloatingEmoji(emoji);
      if (state.peerService.isConnected) {
        state.peerService.sendMessage({ type: 'EMOJI', emoji });
      }
    });
  });

  // Frame Filter Tabs
  document.querySelectorAll('.frame-tab-btn:not(.upload-tab)').forEach((btn) => {
    btn.addEventListener('click', () => {
      sounds.playPop();
      document.querySelectorAll('.frame-tab-btn:not(.upload-tab)').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.frameFilter = btn.dataset.filter;
      renderFramesCarousel();
    });
  });

  // Start Capture Trigger (Both primary button in middle bar & bottom button)
  const triggerCaptureSession = () => {
    sounds.playPop();
    if (state.peerService.isConnected) {
      state.peerService.sendMessage({ type: 'TRIGGER_CAPTURE' });
    }
    runCaptureWorkflow();
  };

  if (el.btnStartCapture) {
    el.btnStartCapture.addEventListener('click', triggerCaptureSession);
  }

  // Cancel Active Capture Trigger
  if (el.btnCancelCapture) {
    el.btnCancelCapture.addEventListener('click', () => {
      cancelCaptureSession(false);
    });
  }

  // Pose Preview Actions (Continue / Retake / Cancel)
  if (el.btnContinuePose) {
    el.btnContinuePose.addEventListener('click', () => {
      sounds.playPop();
      if (state.peerService.isConnected) {
        state.peerService.sendMessage({ type: 'CONTINUE_NEXT_POSE' });
      }
      if (state.activePoseResolver) {
        state.activePoseResolver('continue');
      }
    });
  }

  if (el.btnRetakePose) {
    el.btnRetakePose.addEventListener('click', () => {
      sounds.playPop();
      if (state.peerService.isConnected) {
        state.peerService.sendMessage({ type: 'RETAKE_POSE' });
      }
      if (state.activePoseResolver) {
        state.activePoseResolver('retake');
      }
    });
  }

  if (el.btnCancelFromPreview) {
    el.btnCancelFromPreview.addEventListener('click', () => {
      cancelCaptureSession(false);
    });
  }

  // Result Tools: Filters
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      sounds.playPop();
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.selectedFilter = btn.dataset.filter;
      updateResultCanvas();
    });
  });

  // Result Tools: Stickers Palette
  document.querySelectorAll('.sticker-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      sounds.playPop();
      const emoji = btn.dataset.emoji;
      const w = state.activeFrame.width || 600;
      const h = state.activeFrame.height || 1800;
      state.stickers.push({
        emoji,
        x: Math.round(w * 0.2 + Math.random() * (w * 0.6)),
        y: Math.round(h * 0.2 + Math.random() * (h * 0.6)),
        size: 48,
        rotate: 0
      });
      state.activeStickerIndex = state.stickers.length - 1;
      updateResultCanvas(true);
      updateStickerControlPanel();
      showToast(`Stiker ${emoji} ditempel! Geser stiker di foto untuk atur posisi.`);
    });
  });

  // Clear all stickers
  el.btnClearStickers.addEventListener('click', () => {
    sounds.playPop();
    state.stickers = [];
    state.activeStickerIndex = -1;
    updateResultCanvas(true);
    updateStickerControlPanel();
    showToast('Semua stiker dihapus.');
  });

  // Delete active sticker
  if (el.btnDeleteActiveSticker) {
    el.btnDeleteActiveSticker.addEventListener('click', () => {
      sounds.playPop();
      if (state.activeStickerIndex >= 0 && state.activeStickerIndex < state.stickers.length) {
        state.stickers.splice(state.activeStickerIndex, 1);
        state.activeStickerIndex = state.stickers.length > 0 ? state.stickers.length - 1 : -1;
        updateResultCanvas(true);
        updateStickerControlPanel();
        showToast('Stiker berhasil dihapus.');
      }
    });
  }

  // Position Nudge Buttons (D-Pad)
  const nudgeActiveSticker = (dx, dy) => {
    if (state.activeStickerIndex >= 0 && state.activeStickerIndex < state.stickers.length) {
      sounds.playPop();
      const s = state.stickers[state.activeStickerIndex];
      const w = state.activeFrame.width || 600;
      const h = state.activeFrame.height || 1800;
      s.x = Math.round(Math.max(15, Math.min(w - 15, s.x + dx)));
      s.y = Math.round(Math.max(15, Math.min(h - 15, s.y + dy)));
      updateResultCanvas(true);
      if (el.stickerSelectedName) {
        el.stickerSelectedName.textContent = `Posisi: X: ${s.x}, Y: ${s.y}`;
      }
    }
  };

  if (el.btnNudgeUp) el.btnNudgeUp.addEventListener('click', () => nudgeActiveSticker(0, -25));
  if (el.btnNudgeDown) el.btnNudgeDown.addEventListener('click', () => nudgeActiveSticker(0, 25));
  if (el.btnNudgeLeft) el.btnNudgeLeft.addEventListener('click', () => nudgeActiveSticker(-25, 0));
  if (el.btnNudgeRight) el.btnNudgeRight.addEventListener('click', () => nudgeActiveSticker(25, 0));
  if (el.btnNudgeCenter) el.btnNudgeCenter.addEventListener('click', () => {
    if (state.activeStickerIndex >= 0 && state.activeStickerIndex < state.stickers.length) {
      sounds.playPop();
      const s = state.stickers[state.activeStickerIndex];
      const w = state.activeFrame.width || 600;
      const h = state.activeFrame.height || 1800;
      s.x = Math.round(w / 2);
      s.y = Math.round(h / 2);
      updateResultCanvas(true);
      if (el.stickerSelectedName) {
        el.stickerSelectedName.textContent = `Posisi: X: ${s.x}, Y: ${s.y} (Tengah)`;
      }
    }
  });

  // Size Slider
  if (el.inputStickerSize) {
    el.inputStickerSize.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      if (state.activeStickerIndex >= 0 && state.activeStickerIndex < state.stickers.length) {
        state.stickers[state.activeStickerIndex].size = val;
        if (el.labelStickerSize) el.labelStickerSize.textContent = `${val}px`;
        updateResultCanvas(true);
      }
    });
  }

  // Rotate Slider
  if (el.inputStickerRotate) {
    el.inputStickerRotate.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      if (state.activeStickerIndex >= 0 && state.activeStickerIndex < state.stickers.length) {
        state.stickers[state.activeStickerIndex].rotate = val;
        if (el.labelStickerRotate) el.labelStickerRotate.textContent = `${val}°`;
        updateResultCanvas(true);
      }
    });
  }

  const rotateActiveSticker = (delta) => {
    if (state.activeStickerIndex >= 0 && state.activeStickerIndex < state.stickers.length) {
      sounds.playPop();
      const s = state.stickers[state.activeStickerIndex];
      let newRot = ((s.rotate || 0) + delta) % 360;
      if (newRot > 180) newRot -= 360;
      if (newRot < -180) newRot += 360;
      s.rotate = newRot;
      if (el.inputStickerRotate) el.inputStickerRotate.value = newRot;
      if (el.labelStickerRotate) el.labelStickerRotate.textContent = `${newRot}°`;
      updateResultCanvas(true);
    }
  };

  if (el.btnRotMinus) el.btnRotMinus.addEventListener('click', () => rotateActiveSticker(-15));
  if (el.btnRotPlus) el.btnRotPlus.addEventListener('click', () => rotateActiveSticker(15));

  // Init Canvas Sticker Drag Listener
  initCanvasStickerDrag();

  // Custom Caption Input
  el.inputCustomCaption.addEventListener('input', (e) => {
    state.customCaption = e.target.value;
    updateResultCanvas();
  });

  // Download HD PNG (renders clean without editor dashed handles)
  el.btnDownloadStrip.addEventListener('click', () => {
    sounds.playSuccess();
    const cleanCanvas = stripRenderer.renderStrip({
      frame: state.activeFrame,
      photos: state.capturedPhotos,
      filter: state.selectedFilter,
      layoutMode: state.layoutMode,
      pipSwapped: state.pipSwapped,
      stickers: state.stickers,
      customText: state.customCaption,
      activeStickerIndex: -1,
      showHandles: false
    });
    const dataUrl = cleanCanvas.toDataURL('image/png', 0.95);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `DUOBOOTH-strip-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Strip foto berhasil diunduh! 📸✨');
    updateResultCanvas(true);
  });

  // Retake Photos
  el.btnRetakePhotos.addEventListener('click', () => {
    sounds.playPop();
    el.viewResult.classList.add('hidden');
    el.viewBooth.classList.remove('hidden');
  });

  // Change Frame
  el.btnBackToBooth.addEventListener('click', () => {
    sounds.playPop();
    el.viewResult.classList.add('hidden');
    el.viewBooth.classList.remove('hidden');
  });

  // --- Pinterest Frame Upload Modal Events ---
  if (el.btnOpenUploadModal) {
    el.btnOpenUploadModal.addEventListener('click', () => {
      sounds.playPop();
      el.modalUploadPinterest.classList.remove('hidden');
    });
  }

  el.btnCloseModal.addEventListener('click', closeUploadModal);
  el.btnCancelUpload.addEventListener('click', closeUploadModal);

  el.pinterestDropzone.addEventListener('click', () => {
    el.inputPinterestFile.click();
  });

  el.inputPinterestFile.addEventListener('change', handlePinterestFileSelect);

  // Drag and drop for Pinterest frame
  el.pinterestDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    el.pinterestDropzone.style.borderColor = 'var(--primary)';
  });
  el.pinterestDropzone.addEventListener('dragleave', () => {
    el.pinterestDropzone.style.borderColor = 'var(--border-color)';
  });
  el.pinterestDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    el.pinterestDropzone.style.borderColor = 'var(--border-color)';
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processPinterestFile(e.dataTransfer.files[0]);
    }
  });

  el.btnApplyPinterestFrame.addEventListener('click', () => {
    if (!state.pendingPinterestImg) return;
    sounds.playSuccess();

    const slotCount = parseInt(el.selectSlotCount.value, 10);
    const layout = el.selectSlotLayout.value;
    const customFrame = createCustomPinterestFrame(state.pendingPinterestImg, slotCount, layout);

    state.framesList.unshift(customFrame);
    state.activeFrame = customFrame;

    renderFramesCarousel();
    updateActiveFrameInfo();
    closeUploadModal();

    if (state.peerService.isConnected) {
      state.peerService.sendMessage({
        type: 'CUSTOM_FRAME_INFO',
        slotCount,
        layout,
        name: customFrame.name
      });
    }

    showToast(`Bingkai Pinterest (${slotCount} Foto) berhasil diterapkan! 🖼️`);
  });
}

function closeUploadModal() {
  sounds.playPop();
  el.modalUploadPinterest.classList.add('hidden');
  state.pendingPinterestImg = null;
  el.pinterestPreviewImg.classList.add('hidden');
  el.btnApplyPinterestFrame.disabled = true;
}

function handlePinterestFileSelect(e) {
  if (e.target.files && e.target.files[0]) {
    processPinterestFile(e.target.files[0]);
  }
}

function processPinterestFile(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      state.pendingPinterestImg = img;
      el.pinterestPreviewImg.src = img.src;
      el.pinterestPreviewImg.classList.remove('hidden');
      el.btnApplyPinterestFrame.disabled = false;
      showToast('File bingkai siap! Pilih jumlah foto.');
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

// --- Layout Mode Switcher ---
function setLayoutMode(mode, syncWithPeer = true) {
  if (state.isSoloMode) return; // Solo mode is strictly single camera, no PiP/Split
  
  state.layoutMode = mode;
  el.videoStageGrid.classList.remove('layout-split', 'layout-pip');
  if (mode === 'side-by-side') {
    el.videoStageGrid.classList.add('layout-split');
    el.btnLayoutSplit.classList.add('active');
    el.btnLayoutPip.classList.remove('active');
  } else {
    el.videoStageGrid.classList.add('layout-pip');
    el.btnLayoutPip.classList.add('active');
    el.btnLayoutSplit.classList.remove('active');
    if (state.pipSwapped) {
      el.videoStageGrid.classList.add('pip-swapped');
    }
  }

  if (syncWithPeer && state.peerService && state.peerService.isConnected) {
    state.peerService.sendMessage({ type: 'LAYOUT_MODE', mode });
  }
}

// --- Peer Callback Setup ---
function setupPeerCallbacks() {
  const ps = state.peerService;

  ps.onConnected = ({ isHost }) => {
    sounds.playSuccess();
    goToBoothView({
      isHost,
      roomCode: ps.roomCode,
      solo: false
    });
    showToast('Teman berhasil terhubung ke booth! 🎉');
  };

  ps.onRemoteStream = (stream) => {
    state.remoteStream = stream;
    el.boothRemoteVideo.srcObject = stream;
    el.remoteWaitingState.classList.add('hidden');
  };

  ps.onMessage = (msg) => {
    switch (msg.type) {
      case 'SELECT_FRAME':
        const found = state.framesList.find(f => f.id === msg.frameId);
        if (found) {
          if (!state.isSoloMode && getFrameOrientation(found) !== 'landscape') {
            break;
          }
          state.activeFrame = found;
          updateActiveFrameInfo();
          renderFramesCarousel();
          showToast(`Partner memilih bingkai: ${found.name}`);
        }
        break;

      case 'LAYOUT_MODE':
        if (!state.isSoloMode && (msg.mode === 'side-by-side' || msg.mode === 'pip')) {
          setLayoutMode(msg.mode, false);
          showToast(`Partner mengganti tampilan: ${msg.mode === 'pip' ? 'PiP' : 'Split Duo'}`);
        }
        break;

      case 'TRIGGER_CAPTURE':
        showToast('Partner memulai sesi foto! Bersiaplah...');
        runCaptureWorkflow();
        break;

      case 'CANCEL_CAPTURE':
        cancelCaptureSession(true);
        break;

      case 'CONTINUE_NEXT_POSE':
        showToast('Partner klik lanjutkan! Memulai pose berikutnya... ✨');
        if (state.activePoseResolver) {
          state.activePoseResolver('continue');
        }
        break;

      case 'RETAKE_POSE':
        showToast('Partner ingin foto ulang pose ini! 📸');
        if (state.activePoseResolver) {
          state.activePoseResolver('retake');
        }
        break;

      case 'EMOJI':
        spawnFloatingEmoji(msg.emoji);
        break;

      case 'CUSTOM_FRAME_INFO':
        showToast(`Partner mengunggah bingkai kustom (${msg.slotCount} pose)!`);
        break;
    }
  };

  ps.onDisconnected = () => {
    showToast('Koneksi dengan teman terputus.');
    returnToLobby();
  };

  ps.onError = (err) => {
    console.error('Peer error:', err);
    showToast(`Koneksi: ${err.message || 'Terjadi gangguan'}`);
  };
}

// --- View Navigation ---
function goToBoothView({ isHost, roomCode, solo = false }) {
  state.isSoloMode = solo;
  el.viewLobby.classList.add('hidden');
  el.viewResult.classList.add('hidden');
  el.viewBooth.classList.remove('hidden');

  el.navRoomBadge.classList.remove('hidden');
  el.navRoomText.innerHTML = `ROOM: <b>${roomCode}</b>`;

  // Rule:
  // Duo mode (solo === false): KHUSUS LANDSCAPE SAJA agar muat berdua
  // Solo mode (solo === true): BISA SEMUA FRAME (portrait maupun landscape)
  if (!solo && getFrameOrientation(state.activeFrame) !== 'landscape') {
    const firstLandscape = state.framesList.find(f => getFrameOrientation(f) === 'landscape');
    if (firstLandscape) {
      state.activeFrame = firstLandscape;
    }
  }

  renderFramesCarousel();

  if (solo) {
    el.videoStageGrid.classList.add('solo-stage');
    el.videoStageGrid.classList.remove('layout-pip', 'pip-swapped');
    el.videoStageGrid.classList.add('layout-split');
    if (el.layoutToggleGroup) {
      el.layoutToggleGroup.style.display = 'none';
    }
    el.boothConnText.textContent = '📸 Solo Foto';
    el.remoteWaitingState.innerHTML = '';
    el.remoteWaitingState.classList.add('hidden');
    el.remotePlayerName.textContent = 'Solo';
  } else {
    el.videoStageGrid.classList.remove('solo-stage');
    if (el.layoutToggleGroup) {
      el.layoutToggleGroup.style.display = 'inline-flex';
    }
    el.boothConnText.textContent = isHost ? 'Kamu (Host) • Teman Terhubung' : 'Kamu (Guest) • Teman Terhubung';
    el.remotePlayerName.textContent = isHost ? 'Guest' : 'Host';
    setLayoutMode(state.layoutMode || 'side-by-side', false);
  }

  updateActiveFrameInfo();
}

function returnToLobby() {
  state.isSoloMode = false;
  state.pipSwapped = false;
  state.remoteStream = null;
  el.videoStageGrid.classList.remove('solo-stage', 'pip-swapped');
  if (el.layoutToggleGroup) {
    el.layoutToggleGroup.style.display = '';
  }
  el.viewBooth.classList.add('hidden');
  el.viewResult.classList.add('hidden');
  el.viewLobby.classList.remove('hidden');
  el.navRoomBadge.classList.add('hidden');

  el.hostIdleState.classList.remove('hidden');
  el.hostActiveState.classList.add('hidden');
  el.btnCreateRoom.textContent = 'Buat Kode Room';
  el.btnJoinRoom.textContent = 'Masuk';

  renderFramesCarousel();
}

// --- Frame Carousel Rendering ---
function renderFramesCarousel() {
  if (!el.framesCarousel) return;
  el.framesCarousel.innerHTML = '';

  const isDuo = !state.isSoloMode;

  // Update header badge & description
  if (el.frameModeBadge) {
    if (isDuo) {
      el.frameModeBadge.className = 'frame-mode-badge badge-duo';
      el.frameModeBadge.innerHTML = '👥 Khusus Duo • Landscape';
    } else {
      el.frameModeBadge.className = 'frame-mode-badge badge-solo';
      el.frameModeBadge.innerHTML = '👤 Solo Foto • Semua Bingkai';
    }
  }

  if (el.frameSelectorSubtitle) {
    if (isDuo) {
      el.frameSelectorSubtitle.textContent = 'Mode Duo: Khusus bingkai landscape lebar agar foto berdua muat berdampingan tanpa terpotong.';
    } else {
      el.frameSelectorSubtitle.textContent = 'Mode Solo: Kamu bebas memilih semua koleksi bingkai (portrait maupun landscape).';
    }
  }

  // Filter frames:
  // Duo mode: KHUSUS LANDSCAPE SAJA
  // Solo mode: BISA SEMUA BINGKAI
  const modeFiltered = isDuo
    ? state.framesList.filter(f => getFrameOrientation(f) === 'landscape')
    : state.framesList;

  // Then filter by category tab:
  let filtered = modeFiltered.filter(f => {
    if (state.frameFilter === 'all') return true;
    if (state.frameFilter === 'pinterest') return f.category === 'pinterest' || f.subCategory === 'pinterest' || f.category === 'custom';
    if (state.frameFilter === 'girl') return f.category === 'girl' || f.subCategory === 'girl';
    if (state.frameFilter === 'boy') return f.category === 'boy' || f.subCategory === 'boy';
    if (state.frameFilter === 'neutral') return f.category === 'neutral' || f.subCategory === 'neutral';
    return f.category === state.frameFilter;
  });

  // Fallback to mode frames if current category has none
  if (filtered.length === 0) {
    filtered = modeFiltered;
  }

  // Ensure activeFrame is valid in the current mode
  if (!filtered.some(f => f.id === state.activeFrame.id)) {
    if (filtered.length > 0) {
      state.activeFrame = filtered[0];
      updateActiveFrameInfo();
    }
  }

  filtered.forEach((frame) => {
    const card = document.createElement('div');
    card.className = `frame-card ${state.activeFrame.id === frame.id ? 'selected' : ''}`;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');

    // Generate mini slot bars preview, SVG preview, or Pinterest image thumbnail
    let previewContent = '';
    if (frame.bgImageSrc) {
      previewContent = `<img src="${frame.bgImageSrc}" alt="${frame.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;" loading="lazy" />`;
    } else if (frame.previewSvg) {
      previewContent = `<img src="${frame.previewSvg}" alt="${frame.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;" loading="lazy" />`;
    } else {
      const slots = frame.slots || [];
      const miniSlotsHtml = slots.map(() => '<div class="mini-slot"></div>').join('');
      previewContent = `<div class="mini-slots-strip">${miniSlotsHtml}</div>`;
    }

    const ori = getFrameOrientation(frame);
    const typeBadge = ori === 'landscape'
      ? '<span class="frame-badge-type badge-duo">👥 Landscape</span>'
      : '<span class="frame-badge-type badge-solo">👤 Portrait</span>';

    card.innerHTML = `
      <div class="frame-card-preview" style="background-color: ${frame.bgColor || '#f8fafc'}">
        ${previewContent}
      </div>
      <h4>${frame.name}</h4>
      <div class="frame-card-meta">
        <span class="frame-badge-slots">📸 ${frame.slotCount} Foto</span>
        ${typeBadge}
      </div>
    `;

    card.addEventListener('click', () => {
      sounds.playPop();
      state.activeFrame = frame;
      document.querySelectorAll('.frame-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      updateActiveFrameInfo();

      if (state.peerService.isConnected) {
        state.peerService.sendMessage({
          type: 'SELECT_FRAME',
          frameId: frame.id
        });
      }
    });

    el.framesCarousel.appendChild(card);
  });
}

function updateActiveFrameInfo() {
  const frame = state.activeFrame;
  const isLand = getFrameOrientation(frame) === 'landscape';
  el.activeFrameName.textContent = frame.name;
  el.activeFrameCountBadge.innerHTML = `<span>📸 ${frame.slotCount} Foto</span> <span class="frame-tag-badge">${isLand ? '👥 Landscape' : '👤 Portrait'}</span>`;
  if (el.btnStartCapture) {
    el.btnStartCapture.innerHTML = `
      <span class="shutter-icon">📷</span>
      <span class="btn-text">MULAI SESI FOTO (${frame.slotCount} POSE)</span>
    `;
  }
}

// --- Floating Emoji Burst ---
function spawnFloatingEmoji(emoji) {
  const burst = document.createElement('div');
  burst.className = 'floating-emoji';
  burst.textContent = emoji;
  burst.style.left = `${Math.random() * 80 + 10}%`;
  burst.style.bottom = '20px';
  el.emojiBurstContainer.appendChild(burst);

  setTimeout(() => burst.remove(), 2000);
}

// --- Helper: Check if video element is visually mirrored on screen ---
function isVideoElementMirrored(videoEl) {
  if (!videoEl) return false;
  // If explicitly unmirrored via CSS class
  if (videoEl.classList && videoEl.classList.contains('unmirror')) {
    return false;
  }
  // Check computed transform (matrix or matrix3d for GPU-accelerated video)
  try {
    const st = window.getComputedStyle(videoEl);
    const tr = st.transform || st.webkitTransform;
    if (tr && tr !== 'none') {
      const match = tr.match(/^matrix(?:3d)?\(([^,]+)/);
      if (match) {
        return parseFloat(match[1]) < 0;
      }
    }
  } catch (_) {}

  // In photobooth, both local and remote selfie streams are mirrored by default unless state.isMirrored is false for local video
  if (videoEl === el.boothLocalVideo || videoEl === el.lobbyVideo) {
    return state.isMirrored !== false;
  }
  // Remote video inside video-card is mirrored by default
  return true;
}

// --- Helper: Video Snapshot Creator ---
function createSnapshotCanvas(videoEl) {
  if (!videoEl || videoEl.videoWidth === 0) return null;

  const vW = videoEl.videoWidth;
  const vH = videoEl.videoHeight;

  // Match the CSS object-fit: cover + object-position: center 20% behaviour.
  // The display container has a 4:3 aspect ratio, so we crop the raw video stream
  // the same way the browser does before capturing the frame.
  const displayAspect = 4 / 3;
  const videoAspect = vW / vH;

  let srcX = 0, srcY = 0, srcW = vW, srcH = vH;

  if (videoAspect > displayAspect) {
    // Video is wider than 4:3 — crop sides, keep center horizontally
    srcH = vH;
    srcW = vH * displayAspect;
    srcX = (vW - srcW) / 2; // center X
    // object-position: 20% vertically means top of face region is ~20% into frame
    srcY = 0; // start from top since 20% positions the object from top
  } else {
    // Video is taller than 4:3 — crop top/bottom, align to 20% from top
    srcW = vW;
    srcH = vW / displayAspect;
    // object-position: center 20% — 20% vertical offset from top
    const maxSrcY = vH - srcH;
    srcY = maxSrcY * 0.20; // 20% offset to show face rather than ceiling
  }

  // Output canvas: fixed 1280×960 (4:3 HD) so quality is consistent
  const OUT_W = 1280;
  const OUT_H = 960;
  const offscreen = document.createElement('canvas');
  offscreen.width = OUT_W;
  offscreen.height = OUT_H;
  const offCtx = offscreen.getContext('2d');

  // Preserve exact mirror orientation matching the on-screen video view
  // (Whether local or remote, snapshot horizontal orientation matches the live view 100%)
  if (isVideoElementMirrored(videoEl)) {
    offCtx.translate(OUT_W, 0);
    offCtx.scale(-1, 1);
  }

  // Draw the cropped region scaled to our output canvas
  offCtx.drawImage(videoEl, srcX, srcY, srcW, srcH, 0, 0, OUT_W, OUT_H);

  // Kick off native face detection (async, result cached on canvas for drawImageSmart to use)
  detectFacesAsync(offscreen);

  return offscreen;
}

// --- Cancel Capture Handler ---
function cancelCaptureSession(fromPeer = false) {
  state.abortCapture = true;
  state.isCapturing = false;
  el.captureOverlay.classList.remove('preview-mode');
  el.captureOverlay.classList.add('hidden');
  if (el.posePreviewHud) el.posePreviewHud.classList.add('hidden');
  el.flashOverlay.classList.remove('active');
  if (state.activePoseResolver) {
    state.activePoseResolver('abort');
  }
  sounds.playPop();
  showToast(fromPeer ? 'Sesi foto dibatalkan oleh partner' : 'Sesi foto dibatalkan');

  if (!fromPeer && state.peerService.isConnected) {
    state.peerService.sendMessage({ type: 'CANCEL_CAPTURE' });
  }
}

// Interruptible Sleep helper (cancels immediately if abortCapture is true)
function interruptibleSleep(ms) {
  return new Promise((resolve) => {
    const checkInterval = 40;
    let elapsed = 0;
    const timer = setInterval(() => {
      if (state.abortCapture) {
        clearInterval(timer);
        resolve();
      }
      elapsed += checkInterval;
      if (elapsed >= ms) {
        clearInterval(timer);
        resolve();
      }
    }, checkInterval);
  });
}

// Draw snapshot preview onto pose preview canvas (matches live booth view exactly)
function drawPosePreviewCanvas(canvas, localImg, remoteImg, layoutMode, pipSwapped = false) {
  if (!canvas) return;
  const w = 720;
  const h = 480;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  // Helper: draw image filling target area exactly (simple cover - no repositioning)
  // Since the snapshot canvas is already cropped to 4:3 matching the live view,
  // we just stretch it to fill — this produces the exact same result as the live video.
  function drawSimpleCover(img, x, y, tw, th) {
    if (!img) return;
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    if (!iw || !ih) return;

    const targetAspect = tw / th;
    const imgAspect = iw / ih;

    let sx = 0, sy = 0, sw = iw, sh = ih;
    if (imgAspect > targetAspect) {
      // wider — crop sides
      sw = ih * targetAspect;
      sx = (iw - sw) / 2;
    } else {
      // taller — crop top/bottom from center
      sh = iw / targetAspect;
      sy = (ih - sh) / 2;
    }
    ctx.drawImage(img, sx, sy, sw, sh, x, y, tw, th);
  }

  // Fill dark backdrop
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, w, h);

  if (remoteImg && layoutMode === 'side-by-side') {
    const halfW = w / 2;
    drawSimpleCover(localImg, 0, 0, halfW, h);
    drawSimpleCover(remoteImg, halfW, 0, halfW, h);

    // Subtle divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(halfW, 0);
    ctx.lineTo(halfW, h);
    ctx.stroke();

    // Player indicator tags
    ctx.save();
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = 'rgba(0, 0, 0, 0.72)';
    ctx.beginPath(); ctx.roundRect(14, 14, 76, 26, 6); ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('KAMU', 52, 27);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.72)';
    ctx.beginPath(); ctx.roundRect(halfW + 14, 14, 88, 26, 6); ctx.fill();
    ctx.fillStyle = '#f472b6';
    ctx.fillText('TEMAN', halfW + 58, 27);
    ctx.restore();

  } else if (remoteImg && layoutMode === 'pip') {
    const mainImg = pipSwapped ? remoteImg : localImg;
    const insetImg = pipSwapped ? localImg : remoteImg;
    const mainTag = pipSwapped ? 'TEMAN' : 'KAMU';
    const mainTagColor = pipSwapped ? '#f472b6' : '#38bdf8';

    drawSimpleCover(mainImg, 0, 0, w, h);

    const pipW = w * 0.36;
    const pipH = h * 0.36;
    const pipX = w - pipW - 16;
    const pipY = h - pipH - 16;

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(pipX, pipY, pipW, pipH);
    ctx.save();
    ctx.beginPath(); ctx.roundRect(pipX, pipY, pipW, pipH, 6); ctx.clip();
    drawSimpleCover(insetImg, pipX, pipY, pipW, pipH);
    ctx.restore();

    ctx.save();
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.72)';
    ctx.beginPath(); ctx.roundRect(14, 14, 76, 26, 6); ctx.fill();
    ctx.fillStyle = mainTagColor;
    ctx.fillText(mainTag, 52, 27);
    ctx.restore();

  } else {
    // Solo Mode
    const img = localImg || remoteImg;
    if (img) drawSimpleCover(img, 0, 0, w, h);

    ctx.save();
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.72)';
    ctx.beginPath(); ctx.roundRect(14, 14, 76, 26, 6); ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('KAMU', 52, 27);
    ctx.restore();
  }
}

// Wait for user or partner action on the preview modal
function waitForPoseAction() {
  return new Promise((resolve) => {
    state.activePoseResolver = (action) => {
      state.activePoseResolver = null;
      resolve(action);
    };
  });
}

// --- Synchronized Capture Workflow ---
async function runCaptureWorkflow() {
  const frame = state.activeFrame;
  const slotCount = frame.slotCount || 4;
  state.capturedPhotos = [];
  state.stickers = [];
  state.isCapturing = true;
  state.abortCapture = false;

  el.captureOverlay.classList.remove('hidden');
  el.captureOverlay.classList.remove('preview-mode');

  let poseIndex = 0;
  while (poseIndex < slotCount) {
    if (state.abortCapture) break;

    // Show Countdown HUD, hide Pose Preview
    el.captureOverlay.classList.remove('preview-mode');
    if (el.posePreviewHud) el.posePreviewHud.classList.add('hidden');
    if (el.countdownHud) el.countdownHud.classList.remove('hidden');

    // 1. Update Progress HUD
    el.capturePoseStep.textContent = `Mengambil Foto ${poseIndex + 1} dari ${slotCount}`;
    const percent = ((poseIndex + 1) / slotCount) * 100;
    el.captureProgressFill.style.width = `${percent}%`;
    el.countdownTip.textContent = poseIndex === 0
      ? 'Pose pertama! Pasang senyum terbaikmu! ✨'
      : `Pose ke-${poseIndex + 1}! Ganti gaya seru bareng temanmu! ✌️`;

    // 2. Countdown 3.. 2.. 1..
    for (let count = 3; count >= 1; count--) {
      if (state.abortCapture) break;
      el.countdownNumber.textContent = count;
      sounds.playCountdownTick(false);
      await interruptibleSleep(1000);
    }

    if (state.abortCapture) break;

    // 3. Shutter Snapshot!
    el.countdownNumber.textContent = '📸';
    sounds.playCountdownTick(true);
    sounds.playShutter();

    // Flash trigger
    el.flashOverlay.classList.add('active');

    // Take snapshots
    const localImg = createSnapshotCanvas(el.boothLocalVideo);
    let remoteImg = null;
    if (!state.isSoloMode && state.remoteStream) {
      remoteImg = createSnapshotCanvas(el.boothRemoteVideo);
    }

    state.capturedPhotos.push({ localImg, remoteImg });

    // Fade out flash
    await interruptibleSleep(80);
    el.flashOverlay.classList.remove('active');

    if (state.abortCapture) break;

    // 4. SHOW PREVIEW MODAL FOR BOTH PLAYERS!
    el.captureOverlay.classList.add('preview-mode');
    if (el.countdownHud) el.countdownHud.classList.add('hidden');
    if (el.posePreviewHud) el.posePreviewHud.classList.remove('hidden');

    const isLastPose = (poseIndex === slotCount - 1);
    if (el.previewPoseTitle) {
      el.previewPoseTitle.textContent = isLastPose
        ? `🎉 Foto Terakhir (${poseIndex + 1} dari ${slotCount}) Selesai!`
        : `📸 Pratinjau Foto Pose ${poseIndex + 1} dari ${slotCount}`;
    }

    if (el.continuePoseBtnText) {
      el.continuePoseBtnText.textContent = isLastPose
        ? 'Lihat Hasil Strip Foto ✨'
        : 'Lanjutkan ke Foto Berikutnya ➡️';
    }

    if (el.previewSyncText) {
      el.previewSyncText.textContent = state.isSoloMode
        ? 'Solo Foto'
        : 'Pratinjau Sinkron 2 Orang';
    }

    // Render photo onto preview canvas
    drawPosePreviewCanvas(el.posePreviewCanvas, localImg, remoteImg, state.layoutMode, state.pipSwapped);

    // Wait for user or partner to click 'Lanjutkan' or 'Foto Ulang'
    const action = await waitForPoseAction();

    if (action === 'abort' || state.abortCapture) {
      break;
    }

    if (action === 'retake') {
      // User or partner chose to retake this pose
      state.capturedPhotos.pop();
      showToast(`Mengulang pose ke-${poseIndex + 1}! Pasang gaya baru! 💫`);
      el.captureOverlay.classList.remove('preview-mode');
      if (el.posePreviewHud) el.posePreviewHud.classList.add('hidden');
      if (el.countdownHud) el.countdownHud.classList.remove('hidden');
      el.countdownTip.textContent = `Mengulang pose ke-${poseIndex + 1}... Bersiaplah! 📸`;
      await interruptibleSleep(1200);
      continue; // Repeat same poseIndex
    }

    // Action is 'continue'
    el.captureOverlay.classList.remove('preview-mode');
    if (el.posePreviewHud) el.posePreviewHud.classList.add('hidden');

    if (isLastPose) {
      // All poses done!
      break;
    }

    // Prepare next pose
    poseIndex++;
    if (el.countdownHud) el.countdownHud.classList.remove('hidden');
    el.countdownTip.textContent = `Siap-siap untuk pose ke-${poseIndex + 1}! ✌️`;
    await interruptibleSleep(1200);
  }

  // Cleanup overlay
  el.captureOverlay.classList.remove('preview-mode');
  el.captureOverlay.classList.add('hidden');
  if (el.posePreviewHud) el.posePreviewHud.classList.add('hidden');
  el.flashOverlay.classList.remove('active');
  state.isCapturing = false;

  // If capture was cancelled mid-way, cleanly return to booth
  if (state.abortCapture) {
    state.abortCapture = false;
    return;
  }

  // Done! Finish capture and go to result studio
  goToResultStudio();
}

// --- Result Studio ---
function goToResultStudio() {
  el.viewBooth.classList.add('hidden');
  el.viewResult.classList.remove('hidden');

  // Trigger celebratory confetti burst!
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
  sounds.playSuccess();

  state.activeStickerIndex = state.stickers.length > 0 ? state.stickers.length - 1 : -1;
  updateResultCanvas(true);
  updateStickerControlPanel();
}

function updateResultCanvas(showHandles = true) {
  const overlaySrc = state.activeFrame?.overlayImageSrc;
  if (overlaySrc) {
    const img = getLoadedImage(overlaySrc);
    if (img && !img.complete) {
      img.onload = () => updateResultCanvas(showHandles);
    }
  }

  const resultCanvas = stripRenderer.renderStrip({
    frame: state.activeFrame,
    photos: state.capturedPhotos,
    filter: state.selectedFilter,
    layoutMode: state.layoutMode,
    pipSwapped: state.pipSwapped,
    stickers: state.stickers,
    customText: state.customCaption,
    activeStickerIndex: state.activeStickerIndex,
    showHandles: showHandles && state.activeStickerIndex >= 0
  });

  el.canvasWrapper.innerHTML = '';
  el.canvasWrapper.appendChild(resultCanvas);
}

// --- Canvas Interactive Sticker Dragging ---
let isDraggingSticker = false;
let stickerDragPointerId = null;
let stickerDragOffset = { x: 0, y: 0 };

function getCanvasStickerCoords(e) {
  const canvas = el.canvasWrapper ? el.canvasWrapper.querySelector('canvas') : null;
  if (!canvas) return null;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    canvas,
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
    isInside: e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom
  };
}

function findStickerAt(cx, cy) {
  for (let i = state.stickers.length - 1; i >= 0; i--) {
    const s = state.stickers[i];
    const sz = s.size || 48;
    const hitRadius = Math.max(38, sz * 0.9);
    const dist = Math.hypot(cx - s.x, cy - s.y);
    if (dist <= hitRadius) {
      return i;
    }
  }
  return -1;
}

function initCanvasStickerDrag() {
  if (!el.canvasWrapper) return;
  el.canvasWrapper.style.touchAction = 'none';

  el.canvasWrapper.addEventListener('pointerdown', (e) => {
    const coords = getCanvasStickerCoords(e);
    if (!coords || !coords.isInside) return;

    const hitIndex = findStickerAt(coords.x, coords.y);
    if (hitIndex !== -1) {
      state.activeStickerIndex = hitIndex;
      isDraggingSticker = true;
      stickerDragPointerId = e.pointerId;
      const s = state.stickers[hitIndex];
      stickerDragOffset.x = s.x - coords.x;
      stickerDragOffset.y = s.y - coords.y;
      try {
        el.canvasWrapper.setPointerCapture(e.pointerId);
      } catch (_) {}
      coords.canvas.style.cursor = 'grabbing';
      updateResultCanvas(true);
      updateStickerControlPanel();
      e.preventDefault();
    } else {
      if (state.activeStickerIndex !== -1) {
        state.activeStickerIndex = -1;
        updateResultCanvas(false);
        updateStickerControlPanel();
      }
    }
  });

  el.canvasWrapper.addEventListener('pointermove', (e) => {
    const coords = getCanvasStickerCoords(e);
    if (!coords) return;

    if (isDraggingSticker && e.pointerId === stickerDragPointerId && state.activeStickerIndex >= 0) {
      const s = state.stickers[state.activeStickerIndex];
      if (s) {
        const pad = 15;
        s.x = Math.round(Math.max(pad, Math.min(coords.canvas.width - pad, coords.x + stickerDragOffset.x)));
        s.y = Math.round(Math.max(pad, Math.min(coords.canvas.height - pad, coords.y + stickerDragOffset.y)));
        updateResultCanvas(true);
        if (el.stickerSelectedName) {
          el.stickerSelectedName.textContent = `Posisi: X: ${s.x}, Y: ${s.y}`;
        }
      }
      e.preventDefault();
    } else {
      if (coords.isInside) {
        const hitIndex = findStickerAt(coords.x, coords.y);
        coords.canvas.style.cursor = hitIndex !== -1 ? 'grab' : 'default';
      }
    }
  });

  const onPointerEnd = (e) => {
    if (isDraggingSticker && e.pointerId === stickerDragPointerId) {
      isDraggingSticker = false;
      stickerDragPointerId = null;
      try {
        el.canvasWrapper.releasePointerCapture(e.pointerId);
      } catch (_) {}
      const canvas = el.canvasWrapper.querySelector('canvas');
      if (canvas) canvas.style.cursor = 'default';
      updateResultCanvas(true);
      updateStickerControlPanel();
    }
  };

  el.canvasWrapper.addEventListener('pointerup', onPointerEnd);
  el.canvasWrapper.addEventListener('pointercancel', onPointerEnd);
}

function updateStickerControlPanel() {
  if (!el.stickerActiveEditor) return;

  const count = state.stickers.length;
  const activeIdx = state.activeStickerIndex;

  if (count === 0 || activeIdx < 0 || activeIdx >= count) {
    el.stickerActiveEditor.classList.add('hidden');
    return;
  }

  el.stickerActiveEditor.classList.remove('hidden');
  const activeSticker = state.stickers[activeIdx];

  if (el.stickerSelectedBadge) {
    el.stickerSelectedBadge.textContent = activeSticker.emoji;
  }
  if (el.stickerSelectedName) {
    el.stickerSelectedName.textContent = `Posisi: X: ${activeSticker.x}, Y: ${activeSticker.y}`;
  }
  if (el.inputStickerSize) {
    el.inputStickerSize.value = activeSticker.size || 48;
  }
  if (el.labelStickerSize) {
    el.labelStickerSize.textContent = `${activeSticker.size || 48}px`;
  }
  if (el.inputStickerRotate) {
    el.inputStickerRotate.value = activeSticker.rotate || 0;
  }
  if (el.labelStickerRotate) {
    el.labelStickerRotate.textContent = `${activeSticker.rotate || 0}°`;
  }

  // Render sticker chips
  if (el.stickersChipsList) {
    el.stickersChipsList.innerHTML = '';
    state.stickers.forEach((s, idx) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `sticker-chip ${idx === activeIdx ? 'active' : ''}`;
      chip.innerHTML = `<span>${s.emoji} #${idx + 1}</span> <span class="sticker-chip-remove" title="Hapus stiker ini">✕</span>`;
      
      chip.addEventListener('click', (e) => {
        if (e.target.classList.contains('sticker-chip-remove')) {
          e.stopPropagation();
          sounds.playPop();
          state.stickers.splice(idx, 1);
          state.activeStickerIndex = state.stickers.length > 0 ? Math.min(activeIdx, state.stickers.length - 1) : -1;
          updateResultCanvas(true);
          updateStickerControlPanel();
          return;
        }
        sounds.playPop();
        state.activeStickerIndex = idx;
        updateResultCanvas(true);
        updateStickerControlPanel();
      });

      el.stickersChipsList.appendChild(chip);
    });
  }
}

// Start application
window.addEventListener('DOMContentLoaded', init);
