const _ready = () => {
  const length = document.querySelectorAll('.track').length;

  return length;
};

const loop = (time) => (fn, cb) => {
  const status = fn();

  if (status) {
    cb && cb();
  } else {
    setTimeout(() => loop(time)(fn, cb), time);
  }
};

const fetchLink = (baseLink) => {
  const link = baseLink.replace('http', 'https');

  return fetch(link)
    .then(res => res.text())
    .then((html = '') => {
      if (html) {
        const match = html.match(/http(?:[^"]*mp3)/);

        if (match) {
          return html.match(/http(?:[^"]*mp3)/)[0];
        }

        if (!html.includes('found')) {
          window.location.href = link;          
        }

        return '';
      }

      return '';
    });
};

loop(100)(_ready, () => {
  const trackList = Array.from(document.querySelectorAll('.track'));
  const linkList = Array.from(document.querySelectorAll('.actions-view-listen'));

  const promiseList = trackList.map(
    (item = {}, index) => {
      return new Promise((resolve, reject) => {
        const trackNode = trackList[index];
        const linkNode = linkList[index];

        const title = trackNode.querySelector('.title').innerText;
        const artist = trackNode.querySelector('.artist').innerText;

        const hrefNode = linkNode.querySelector('.deezer');

        const href = hrefNode && hrefNode.href;

        const baseData = { title, artist };

        if (href) {
          fetchLink(href).then((link) => {
            const data = Object.assign({}, baseData, { link });

            resolve(data);
          });
        } else {
          resolve(baseData);
        }
      });
    }
  );

  Promise.all(promiseList).then((list = []) => {
    const domInnerHTML = list.reduce((a, item = {}, index) => {
      const { title, artist, link } = item;

      const href = `https://y.qq.com/portal/search.html#page=1&searchid=1&t=song&w=${title}-${artist}`;
      const cls = `${link ? '' : 'danger'} content-btn`;

      const b = `
        <div data-index="${index}" class="song-content">
          <a class="${cls}" target="_blank" href="${href}">[Search]</a>
          <span>&nbsp;</span>
          <span class="content-title">${title}</span>
          <span>&nbsp;--&nbsp;</span>
          <span class="content-artist">${artist}</span>
        </div>
      `
      return `${a}${b}`;
    }, '');

    const styleInnerHTML = `
      .display-none {
        display: none;
      }

      .song-container {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        color: #333;
        font-size: 12px;
        background: rgba(255,255,255, .8);
        backdrop-filter: blur(5px);
        box-shadow: 0 0 5px rgba(0,0,0, .1);
        z-index: 1111111;
        overflow: auto;
      } 

      .song-container .song-content {
        display: block;
        padding: 5px 5px 5px 15px;
        cursor: pointer;
      }

      .song-container .song-content:hover {
        color: #333;
        opacity: .7;
        transition: .2s;
      }

      .song-container .song-content.listened {
        color: #999;
      }

      .song-container .song-content.active {
        color: #0071bc;
      }

      .song-container .song-content .content-btn.danger {
        color: #f95a5a;
      }
    `;

    const dom = document.createElement('div');
    const style = document.createElement('style');
    const audio = document.createElement('audio');

    audio.classList.add('display-none');
    audio.autoplay = true;

    dom.classList.add('song-container');
    dom.innerHTML = domInnerHTML;

    style.innerHTML = styleInnerHTML

    document.body.appendChild(dom);
    document.head.appendChild(style);
    document.head.appendChild(audio);

    let index = 0;
    const songNodes = Array.from(document.querySelectorAll('.song-container .song-content'));

    const playMusic = () => {
      const item = list[index];

      if (!item) {
        return;
      }

      const { link } = item;

      if (!link) {
        index += 1;
        playMusic();
        return;
      }

      audio.src = link;
      audio.play();
      loadMusic();

      songNodes.forEach((node) => node.classList.remove('active'));
      songNodes[index].classList.add('active');
      songNodes[index].classList.add('listened');
    };

    const loadMusic = () => {
      const item = list[index];

      if (!item) {
        return;
      }

      const { link } = item;

      if (!link) {
        index += 1;
        loadMusic();
        return;
      }

      const audio = document.createElement('audio');

      audio.src = link;
    };

    audio.addEventListener('ended', () => {
      index += 1;

      playMusic(index);
    });

    songNodes.forEach((node = {}, i) => {
      node.addEventListener('click', () => {
        if (i === index) {
          const { paused } = audio;

          paused ? audio.play() : audio.pause();
        } else {
          index = i;
          playMusic();
        }
      });

      node.querySelector('.content-btn').addEventListener('click', e => e.stopPropagation());
    });

    document.addEventListener('keydown', (e) => {
      const { which } = e;

      if (which === 40) {
        // 下
        index += 1;
        playMusic();
      } else if (which == 38) {
        // 上
        index -= 1;
        playMusic();
      }
    });
  });
});
