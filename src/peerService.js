// PeerJS Real-Time WebRTC P2P Connection Manager
// Handles room code creation, audio/video streaming, and synchronized events

import { Peer } from 'peerjs';

export class PeerService {
  constructor() {
    this.peer = null;
    this.connection = null;
    this.mediaCall = null;
    this.localStream = null;
    this.remoteStream = null;
    this.roomCode = null;
    this.isHost = false;
    this.isConnected = false;

    // Event listeners
    this.onConnected = () => {};
    this.onDisconnected = () => {};
    this.onRemoteStream = () => {};
    this.onMessage = () => {};
    this.onError = () => {};
  }

  // Generate friendly 6-char room code (e.g. STAR-8921)
  static generateCode() {
    const prefixes = ['DUO', 'VIBE', 'STAR', 'MOON', 'NEON', 'ROSE', 'LOVE', 'SNAP', 'GLOW', 'AURA'];
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(1000 + Math.random() * 9000);
    return `${p}-${num}`;
  }

  // Get Peer ID from code
  static getPeerIdFromCode(code) {
    return `duobooth-${code.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '')}`;
  }

  // Initialize Host
  async startHost(code, localStream) {
    this.isHost = true;
    this.roomCode = code.toUpperCase();
    this.localStream = localStream;
    const peerId = PeerService.getPeerIdFromCode(this.roomCode);

    return new Promise((resolve, reject) => {
      try {
        if (this.peer) this.peer.destroy();

        this.peer = new Peer(peerId, {
          debug: 1,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' },
              { urls: 'stun:stun2.l.google.com:19302' }
            ]
          }
        });

        this.peer.on('open', (id) => {
          resolve(this.roomCode);
        });

        this.peer.on('connection', (conn) => {
          this.setupDataConnection(conn);
        });

        this.peer.on('call', (call) => {
          this.mediaCall = call;
          call.answer(this.localStream);
          call.on('stream', (remoteStream) => {
            this.remoteStream = remoteStream;
            this.onRemoteStream(remoteStream);
          });
        });

        this.peer.on('error', (err) => {
          this.onError(err);
          reject(err);
        });

      } catch (err) {
        reject(err);
      }
    });
  }

  // Initialize Guest
  async joinRoom(code, localStream) {
    this.isHost = false;
    this.roomCode = code.toUpperCase();
    this.localStream = localStream;
    const targetPeerId = PeerService.getPeerIdFromCode(this.roomCode);
    const guestPeerId = `duobooth-guest-${Date.now().toString(36)}`;

    return new Promise((resolve, reject) => {
      try {
        if (this.peer) this.peer.destroy();

        this.peer = new Peer(guestPeerId, {
          debug: 1,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' },
              { urls: 'stun:stun2.l.google.com:19302' }
            ]
          }
        });

        this.peer.on('open', () => {
          // 1. Establish data connection to Host
          const conn = this.peer.connect(targetPeerId, {
            reliable: true
          });
          this.setupDataConnection(conn);

          // 2. Call Host with local media stream
          if (this.localStream) {
            const call = this.peer.call(targetPeerId, this.localStream);
            this.mediaCall = call;
            call.on('stream', (remoteStream) => {
              this.remoteStream = remoteStream;
              this.onRemoteStream(remoteStream);
            });
            call.on('error', (err) => this.onError(err));
          }

          resolve(this.roomCode);
        });

        this.peer.on('error', (err) => {
          this.onError(err);
          reject(err);
        });

      } catch (err) {
        reject(err);
      }
    });
  }

  setupDataConnection(conn) {
    this.connection = conn;

    conn.on('open', () => {
      this.isConnected = true;
      this.onConnected({
        peerId: conn.peer,
        isHost: this.isHost
      });
      // Ping handshake
      this.sendMessage({ type: 'HANDSHAKE', isHost: this.isHost });
    });

    conn.on('data', (data) => {
      this.onMessage(data);
    });

    conn.on('close', () => {
      this.isConnected = false;
      this.onDisconnected();
    });

    conn.on('error', (err) => {
      this.onError(err);
    });
  }

  sendMessage(messageObj) {
    if (this.connection && this.connection.open) {
      this.connection.send(messageObj);
    }
  }

  updateLocalStream(newStream) {
    this.localStream = newStream;
    const newVideoTrack = newStream ? newStream.getVideoTracks()[0] : null;
    if (!newVideoTrack) return;

    if (this.mediaCall && this.mediaCall.peerConnection) {
      const senders = this.mediaCall.peerConnection.getSenders();
      const videoSender = senders.find(s => s.track && s.track.kind === 'video');
      if (videoSender) {
        videoSender.replaceTrack(newVideoTrack).catch(err => {
          console.warn('Could not replace video track:', err);
        });
      }
    }
  }

  disconnect() {
    if (this.mediaCall) {
      try { this.mediaCall.close(); } catch (_) {}
    }
    if (this.connection) {
      try { this.connection.close(); } catch (_) {}
    }
    if (this.peer) {
      try { this.peer.destroy(); } catch (_) {}
    }
    this.isConnected = false;
    this.connection = null;
    this.mediaCall = null;
    this.peer = null;
    this.remoteStream = null;
  }
}
