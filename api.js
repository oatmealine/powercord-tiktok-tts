const { post } = require('powercord/http');

const url = 'https://tiktok-tts.weilnet.workers.dev/api/generation';
let currentAudio;

async function runTTS(text, voice = 'en_us_002', volume = 0.5) {
  let res = await post(url).set('Content-Type', 'application/json').send({text: text, voice: voice});
  if (res.statusCode != 200 || res.body === '' || res.body.success != true) {
    powercord.api.notices.sendToast('tiktok-tts', {
      header: 'Error',
      content: 'TikTok TTS returned an error: "' + (res.body ? res.body.message : res.statusCode) + '"',
      type: 'danger',
      icon: 'error'
    });
  } else {
    if (currentAudio) {
      currentAudio.pause();
    }

    let audio = new Audio('data:audio/mp3;base64,' + res.body.data);
    audio.volume = volume;
    audio.play();
    currentAudio = audio;
  }
}

exports.runTTS = runTTS;
