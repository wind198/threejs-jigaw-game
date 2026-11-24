import { Howl, Howler } from 'howler';
import { AUDIO_CATALOG, AUDIO_MIX, type MusicMode } from './audio.catalog';

Howler.html5PoolSize = 4;

export class GameAudioEngine {
  private tracks = new Map<MusicMode, Howl>();
  private snaps: Howl[] = [];
  private reward: Howl | null = null;
  private effectsReady = false;
  private current: Howl | null = null;
  private mode: MusicMode = 'browsing';
  private enabled = false;
  private musicEnabled = true;
  private effectsEnabled = true;
  private visible = true;
  private unlocked = false;
  private completed = false;
  private lastSnap = -Infinity;
  private musicVolume: number = AUDIO_MIX.music;
  private effectsVolume: number = AUDIO_MIX.snap;

  constructor() {
    // Only HTML5 music at construct time — avoids creating a suspended WebAudio context
    // that then fails decodeAudioData for snaps/success before the first gesture.
    for (const mode of ['browsing', 'playing'] as const) {
      const src = AUDIO_CATALOG.music[mode];
      if (!src) continue;
      this.tracks.set(mode, new Howl({
        src: [src],
        format: ['mp3'],
        loop: true,
        html5: true,
        preload: true,
        volume: 0,
        onloaderror: (_id, err) => console.warn('Music load failed:', src, err),
      }));
    }
  }

  private ensureEffects() {
    if (this.effectsReady) return;
    this.effectsReady = true;
    this.snaps = AUDIO_CATALOG.snap.map(src => new Howl({
      src: [src],
      format: ['wav'],
      preload: true,
      volume: this.effectsVolume,
      pool: 3,
      onloaderror: (_id, err) => console.warn('Snap load failed:', src, err),
    }));
    if (AUDIO_CATALOG.success) {
      this.reward = new Howl({
        src: [AUDIO_CATALOG.success],
        format: ['wav'],
        preload: true,
        volume: Math.min(1, this.effectsVolume * 1.3),
        pool: 1,
        onloaderror: (_id, err) => console.warn('Success load failed:', AUDIO_CATALOG.success, err),
      });
    }
  }

  private get audible() { return this.enabled && this.visible && this.unlocked; }

  unlock() {
    this.unlocked = true;
    void Howler.ctx?.resume();
    this.ensureEffects();
    this.reconcile();
  }

  configure(enabled: boolean, musicEnabled: boolean, effectsEnabled: boolean, musicVolume: number, effectsVolume: number) {
    this.enabled = enabled; this.musicEnabled = musicEnabled; this.effectsEnabled = effectsEnabled;
    this.musicVolume = musicVolume; this.effectsVolume = effectsVolume;
    if (!this.audible || !effectsEnabled) { this.snaps.forEach(s => s.stop()); this.reward?.stop(); }
    this.snaps.forEach(s => s.volume(effectsVolume));
    this.reward?.volume(Math.min(1, effectsVolume * 1.3));
    this.reconcile();
  }

  setVisible(visible: boolean) {
    this.visible = visible;
    if (!visible) { this.snaps.forEach(s => s.stop()); this.reward?.stop(); }
    this.reconcile();
  }

  setMode(mode: MusicMode) {
    if (mode !== this.mode) { this.mode = mode; this.completed = false; this.reward?.stop(); }
    this.reconcile();
  }

  reset() { this.completed = false; this.reward?.stop(); this.reconcile(); }

  private playMusic(track: Howl, gain: number) {
    track.volume(gain);
    if (track.playing()) return;
    track.play();
    track.once('playerror', () => {
      void Howler.ctx?.resume().then(() => {
        track.volume(gain);
        if (!track.playing()) track.play();
      });
    });
  }

  private reconcile() {
    const next = this.audible && this.musicEnabled ? this.tracks.get(this.mode) ?? null : null;
    const gain = this.musicVolume * (this.completed ? AUDIO_MIX.duck : 1);
    if (this.current && this.current !== next) this.current.stop();
    this.current = next;
    if (next) this.playMusic(next, gain);
  }

  snap() {
    if (!this.audible || !this.effectsEnabled || this.completed || performance.now() - this.lastSnap < 65) return;
    this.ensureEffects();
    void Howler.ctx?.resume();
    const ready = this.snaps.filter(s => s.state() === 'loaded');
    const sound = (ready.length ? ready : this.snaps)[Math.floor(Math.random() * (ready.length || this.snaps.length))];
    if (!sound) return;
    this.lastSnap = performance.now();
    sound.stop();
    sound.play();
  }

  complete() {
    if (this.completed) return;
    this.completed = true;
    this.reconcile();
    if (!this.audible || !this.effectsEnabled) return;
    this.ensureEffects();
    void Howler.ctx?.resume();
    this.reward?.play();
  }

  dispose() {
    for (const sound of [...this.tracks.values(), ...this.snaps, ...(this.reward ? [this.reward] : [])]) sound.unload();
    this.tracks.clear(); this.snaps = []; this.reward = null; this.current = null; this.effectsReady = false;
  }
}
