var origin = 'http://dl.stream.qqmusic.qq.com';
var href = window.location.href;
var hash = window.location.hash;

var loop = (time) => (fn, cb) => {
  const status = fn();

  if (status) {
    cb && cb();
  } else {
    setTimeout(() => loop(time)(fn, cb), time);
  }
};

if (href.includes(origin)) {
  var download = hash.replace('#', '');

  var a = document.createElement('a');

  a.download = window.decodeURIComponent(download);
  a.href = href;

  a.click();

  setTimeout(() => window.close(), 1000)
} else {
  loop(100)(() => {
    return document.getElementById('h5audio_media');
  }, () => {
    var audio = document.getElementById('h5audio_media');

    var container = document.createElement('div');

    container.style = `
      position: fixed;
      top: 0;
      left: 0;
      padding: 5px;
      z-index: 1111111;
    `;

    document.body.appendChild(container);

    audio.addEventListener('play', () => {
      var src = audio.src;

      var downloadHref = src.replace(/.{0,}com/, origin);

      var songDom = document.querySelector('#sim_song_info .js_song');
      var singerDom = document.querySelector('#sim_song_info .js_singer');

      var song = songDom.innerText;
      var singer = singerDom.innerText;

      var downloadName = `${singer} - ${song}.mp3`;

      var a = document.createElement('a');

      a.target = '_blank';
      a.href = `${downloadHref}#${downloadName}`;
      a.innerText = downloadName;

      a.style = `
        padding: 5px;
        margin: 5px;
        color: #666;
        border-radius: 5px;
        background: white;
        display: inline-block;
      `;

      container.appendChild(a);
    });
  });
}

