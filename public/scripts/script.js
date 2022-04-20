function createSoundTrack(url, initVolume, filterEffectControl) {
    let track = new Tone.Player(url).toDestination(); //Create new instance of Tone with assigned url
    track.chain(filterEffectControl, Tone.Destination);
    track.loop = true; //Assign loop to true so that files play infinitely
    track.volume.value = initVolume; //assign initial Volume
    return track; //Return track variable so it gets assigned to our variable. 
}

let synth_filter = new Tone.Filter(20000, "lowpass");

let track_synth = createSoundTrack('../assets/music/QJamMSSynth.wav', -20, synth_filter);
let track_arp = createSoundTrack('../assets/music/QJamMSArp.wav', -80, synth_filter);
let track_bass = createSoundTrack('../assets/music/QJamMSBass.wav', -100, synth_filter);
let track_drums = createSoundTrack('../assets/music/QJamMSDrums.wav', -100, synth_filter);

