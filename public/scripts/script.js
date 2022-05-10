function createSoundTrack(url, initVolume, filterEffectControl, reverbEffect, delayEffect) {
    let track = new Tone.Player(url).toDestination(); //Create new instance of Tone with assigned url
    track.chain(filterEffectControl, reverbEffect, delayEffect,  Tone.Destination);
    track.loop = true; //Assign loop to true so that files play infinitely
    track.volume.value = initVolume; //assign initial Volume
    return track; //Return track variable so it gets assigned to our variable. 
}

let audio_tracks = [];

let bg_arp_filter = new Tone.Filter(22000, "lowpass");
let bg_arp_verb = new Tone.Reverb();
let bg_arp_delay = new Tone.PingPongDelay(); 
let backgroundArp = createSoundTrack('../assets/music/mp3/ambientArpMain.mp3', -100, bg_arp_filter, bg_arp_verb, bg_arp_delay);
let backgroundArpVariant = createSoundTrack('../assets/music/mp3/ambientArpVariant.mp3', -100, bg_arp_filter, bg_arp_verb, bg_arp_delay);
audio_tracks.push(backgroundArp, backgroundArpVariant);


let synth_filter = new Tone.Filter(20000, "lowpass");
let synth_verb = new Tone.Reverb();
let synth_delay = new Tone.PingPongDelay(); 
let backSynthDark = createSoundTrack('../assets/music/mp3/BackSynthDark.mp3', -100, synth_filter, synth_verb, synth_delay);
let mainSynth = createSoundTrack('../assets/music/mp3/BackSynthSounds.mp3', 0, synth_filter, synth_verb, synth_delay);
let standardSynth = createSoundTrack('../assets/music/mp3/standardSynth.mp3', -100, synth_filter, synth_verb, synth_delay);
audio_tracks.push(backSynthDark, mainSynth, standardSynth);

let bass_filter = new Tone.Filter(22000, "lowpass");
let bass_verb = new Tone.Reverb();
let bass_delay = new Tone.PingPongDelay(); 
bass_delay.wet.value = 0;
bass_verb.wet.value = 0;
let bass = createSoundTrack('../assets/music/mp3/bass.mp3', -100, bass_filter, bass_verb, bass_delay);
audio_tracks.push(bass);

let lead_filter = new Tone.Filter(22000, "lowpass");
let lead_verb = new Tone.Reverb();
let lead_delay = new Tone.PingPongDelay(); 
let mainLead = createSoundTrack('../assets/music/mp3/MainLead.mp3', -100, lead_filter, lead_verb, lead_delay);
audio_tracks.push(mainLead);

let drums_filter = new Tone.Filter(22000, "highpass");
let drums_verb = new Tone.Reverb();
let drums_delay = new Tone.PingPongDelay(); 
drums_delay.wet.value = 0;
let drums = createSoundTrack('../assets/music/mp3/Drums.mp3', -100, drums_filter, drums_verb, drums_delay);
audio_tracks.push(drums);

let melody_filter = new Tone.Filter(22000, "lowpass");
let melody_verb = new Tone.Reverb();
let melody_delay = new Tone.PingPongDelay(); 
let melodyLeadHigh = createSoundTrack('../assets/music/mp3/melodyLeadHigh.mp3', -60, melody_filter, melody_verb, melody_delay);
let melodyLeadNormal = createSoundTrack('../assets/music/mp3/melodyLeadNormal.mp3', -100,  melody_filter, melody_verb, melody_delay);
let melodyLeadLow = createSoundTrack('../assets/music/mp3/melodyLeadLow.mp3', -100,  melody_filter, melody_verb, melody_delay);
audio_tracks.push(melodyLeadLow, melodyLeadNormal, melodyLeadHigh);

let melodyVariant = createSoundTrack('../assets/music/mp3/melodyVariant.mp3', -100, melody_filter, melody_verb, melody_delay);
let melodyVariantHigh = createSoundTrack('../assets/music/mp3/melodyVariantHigh.mp3', -100, melody_filter, melody_verb, melody_delay);
let melodyVariantLow = createSoundTrack('../assets/music/mp3/melodyVariantLow.mp3', -100, melody_filter, melody_verb, melody_delay);
audio_tracks.push(melodyVariant, melodyVariantHigh, melodyVariantLow);

let piano_filter = new Tone.Filter(22000, "lowpass");
let piano_verb = new Tone.Reverb();
let piano_delay = new Tone.PingPongDelay(); 
let piano = createSoundTrack('../assets/music/mp3/Piano.mp3', -100, piano_filter, piano_verb, piano_delay);

let pianoAmb = createSoundTrack('../assets/music/mp3/ambientPiano.mp3', -100, piano_filter, piano_verb, piano_delay);

let sfx_filter = new Tone.Filter(22000, "lowpass");
let sfx_verb = new Tone.Reverb();
let sfx_delay = new Tone.PingPongDelay(); 
let sfx = createSoundTrack('../assets/music/mp3/SFX.mp3', -20, sfx_filter, sfx_verb, sfx_delay);
audio_tracks.push(piano, sfx, pianoAmb);

let bell1 = new Tone.Player('../assets/sounds/bell1.wav').toDestination(); //Create new instance of Tone with assigned url
let bell2 = new Tone.Player('../assets/sounds/bell2.wav').toDestination(); //Create new instance of Tone with assigned url
let bell3 = new Tone.Player('../assets/sounds/bell3.wav').toDestination(); //Create new instance of Tone with assigned url
let bell4 = new Tone.Player('../assets/sounds/bell4.wav').toDestination(); //Create new instance of Tone with assigned url
let jumpAudio = new Tone.Player('../assets/sounds/jump.ogg').toDestination(); //Create new instance of Tone with assigned url
jumpAudio.volume.value = -25;

Tone.loaded().then(() => {
    Tone.Transport.bpm.value = 128;
    soundsLoaded = true;
});