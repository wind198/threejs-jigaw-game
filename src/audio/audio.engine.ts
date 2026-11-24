import { Howl } from 'howler';
import { AUDIO_CATALOG, AUDIO_MIX, type MusicMode } from './audio.catalog';

export class GameAudioEngine {
  private tracks = new Map<MusicMode, Howl>();
  private snaps: Howl[] = [];
  private reward: Howl | null = null;
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
    for (const mode of ['browsing', 'playing'] as const) {
      const src = AUDIO_CATALOG.music[mode];
      if (src) this.tracks.set(mode, new Howl({src:[src], loop:true, preload:false, volume:0}));
    }
    this.snaps = AUDIO_CATALOG.snap.map(src => new Howl({src:[src], volume:AUDIO_MIX.snap, pool:2}));
    if (AUDIO_CATALOG.success) this.reward = new Howl({src:[AUDIO_CATALOG.success], volume:AUDIO_MIX.success, pool:1});
  }
  private get audible() { return this.enabled && this.visible && this.unlocked; }
  unlock() { this.unlocked = true; this.reconcile(); }
  configure(enabled:boolean, musicEnabled:boolean, effectsEnabled:boolean, musicVolume:number, effectsVolume:number) {
    this.enabled=enabled; this.musicEnabled=musicEnabled; this.effectsEnabled=effectsEnabled;
    this.musicVolume=musicVolume; this.effectsVolume=effectsVolume;
    if (!this.audible || !effectsEnabled) { this.snaps.forEach(s=>s.stop()); this.reward?.stop(); }
    this.snaps.forEach(s=>s.volume(effectsVolume));
    this.reward?.volume(Math.min(1,effectsVolume*1.3));
    this.reconcile();
  }
  setVisible(visible:boolean) {
    this.visible=visible;
    if (!visible) { this.snaps.forEach(s=>s.stop()); this.reward?.stop(); }
    this.reconcile();
  }
  setMode(mode:MusicMode) { if(mode!==this.mode){this.mode=mode;this.completed=false;this.reward?.stop();} this.reconcile(); }
  reset() { this.completed=false; this.reward?.stop(); this.reconcile(); }
  private reconcile() {
    const next=this.audible && this.musicEnabled ? this.tracks.get(this.mode) ?? null : null;
    const gain=this.musicVolume*(this.completed ? AUDIO_MIX.duck : 1);
    if(this.current && this.current!==next) {
      const previous=this.current;
      previous.stop();
    }
    this.current=next;
    if(next) { if(!next.playing()) { next.volume(gain); next.play(); } else next.volume(gain); }
  }
  snap() {
    if(!this.audible || !this.effectsEnabled || this.completed || performance.now()-this.lastSnap<65) return;
    const sound=this.snaps[Math.floor(Math.random()*this.snaps.length)];
    if(!sound)return;
    this.lastSnap=performance.now(); sound.stop(); sound.play();
  }
  complete() {
    if(this.completed)return;
    this.completed=true; this.reconcile();
    if(this.audible && this.effectsEnabled) this.reward?.play();
  }
  dispose() { for(const sound of [...this.tracks.values(),...this.snaps,...(this.reward?[this.reward]:[])]) sound.unload(); this.current=null; }
}
