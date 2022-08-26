const { post } = require('powercord/http');

const url = 'https://api16-normal-useast5.us.tiktokv.com/media/api/text/speech/invoke/?text_speaker=$1&req_text=$2';
let currentAudio;

async function runTTS(text, voice = 'en_us_002', volume = 0.5) {
  const postUrl = url.replace('$1', voice).replace('$2', encodeURIComponent(text));
  let res = await post(postUrl);
  if (res.statusCode != 200 || res.body === '' || res.body.message != 'success') {
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

    let audio = new Audio('data:audio/mp3;base64,' + res.body.data.v_str);
    audio.volume = volume;
    audio.play();
    currentAudio = audio;
  }
}

exports.runTTS = runTTS;
