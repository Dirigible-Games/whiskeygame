/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundSystem {
  private musicVolume: number = 50;
  private soundVolume: number = 50;

  setMusicVolume(volume: number) {
    this.musicVolume = volume;
    console.log(`Music volume set to ${volume}%`);
    // Placeholder for actual audio logic
  }

  setSoundVolume(volume: number) {
    this.soundVolume = volume;
    console.log(`Sound volume set to ${volume}%`);
    // Placeholder for actual audio logic
  }

  playEffect(effectName: string) {
    if (this.soundVolume === 0) return;
    console.log(`Playing sound effect: ${effectName} at ${this.soundVolume}% volume`);
  }

  getMusicVolume() {
    return this.musicVolume;
  }

  getSoundVolume() {
    return this.soundVolume;
  }
}

export const soundSystem = new SoundSystem();
