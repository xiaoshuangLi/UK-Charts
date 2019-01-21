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

const getData = () => {
  const trackList = Array.from(document.querySelectorAll('.track'));
  const lastList = Array.from(document.querySelectorAll('.last-week'));
  const bestList = Array.from(document.querySelectorAll('.chart-positions td:nth-child(4)'));
  const countList = Array.from(document.querySelectorAll('.chart-positions td:nth-child(5)'));
  const linkList = Array.from(document.querySelectorAll('.actions-view-listen'));

  const promiseList = trackList.map(
    (item = {}, index) => {
      return new Promise((resolve, reject) => {
        const trackNode = trackList[index];
        const lastNode = lastList[index];
        const bestNode = bestList[index];
        const countNode = countList[index];
        const linkNode = linkList[index];

        const title = trackNode.querySelector('.title').innerText;
        const artist = trackNode.querySelector('.artist').innerText;
        const img = trackNode.querySelector('img').src;

        const last = Number(lastNode.innerHTML);
        const landed = Number.isNaN(last);

        const best = Number(bestNode.innerHTML);
        const count = Number(countNode.innerHTML);

        const hrefNode = linkNode.querySelector('.deezer');

        const href = hrefNode && hrefNode.href;

        const baseData = {
          title,
          artist,
          img,
          last,
          best,
          count,
          landed,
        };

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

  return Promise.all(promiseList);
};

const render = (list = []) => {
  const domInnerHTML = list.reduce((a, item = {}, index) => {
    const {
      title,
      artist,
      img,
      last,
      best,
      count,
      landed,
      link,
    } = item;

    const href = `https://y.qq.com/portal/search.html#page=1&searchid=1&t=song&w=${title}-${artist}`;
    const btnCls = `${link ? '' : 'danger'} content-btn`;

    const lastStr = landed ? 'New' : last;

    let partlastCls = '';

    if (landed) {
      partlastCls = 'last-new';
    } else {
      const minus = (index + 1) - last;

      if (minus > 0) {
        partlastCls = 'last-down';
      } else if (minus < 0) {
        partlastCls = 'last-up';
      } else {
        partlastCls = 'last-stay';
      }
    }

    const lastCls = `rank-item ${partlastCls}`;

    const b = `
      <div data-index="${index}" class="song-content">
        <div class="content-info">
          <div class="info-img">
            <div class="img" style="background-image: url(${img})"></div>
          </div>
          <div class="info-msg">
            <div class="msg-title">${title}</div>
            <div class="msg-artist">${artist}</div>
          </div>
        </div>
        <a class="${btnCls}" target="_blank" href="${href}">Search</a>
      </div>
      <div data-index="${index}" class="song-rank">
        <div class="${lastCls}">
          <div class="item-title" data-before="${lastStr}"></div>
          <div class="item-desc">
            <div class="desc">Last Week</div>
            <div class="desc-after">上周排名</div>
          </div>
        </div>
        <div class="rank-item">
          <div class="item-title" data-before="${best}"></div>
          <div class="item-desc">
            <div class="desc">Peak Pos</div>
            <div class="desc-after">最高排名</div> 
          </div>
        </div>
        <div class="rank-item">
          <div class="item-title" data-before="${count}"></div>
          <div class="item-desc">
            <div class="desc">Weeks On</div>
            <div class="desc-after">在榜周数</div> 
          </div>
        </div>
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
      color: #444;
      font-size: 12px;
      background: rgba(255,255,255, .8);
      backdrop-filter: blur(5px);
      box-shadow: 0 0 5px rgba(0,0,0, .1);
      z-index: 1111111;
      overflow: auto;
      counter-reset: rank;
    }

    .song-container .song-rank + .song-content {
      margin-top: 20px;
    }

    .song-container .song-content + .song-rank {
      margin-top: 10px;
    }

    .song-container .song-content {
      display: flex;
      position: relative;
      cursor: pointer;
      transition: .2s;
    }

    .song-container .song-content:before {
      counter-increment: rank;
      content: counter(rank);
      align-self: center;
      padding: 0 10px;
      width: 30px;
      font-size: 24px;
      opacity: .5;
      text-align: right;
    }

    .song-container .song-content:first-child:before {
      align-self: stretch;
      opacity: 1;
      background: gold;
      color: white;
      font-weight: 1000;
    }

    .song-container .song-content:nth-child(n + 10):before {
      font-size: 16px;
      font-weight: 1000;
    }

    .song-container .song-content:hover {
      background: rgba(0,0,0, .1);
      color: white;
    }

    .song-container .song-content.listened {
      color: #999;
    }

    .song-container .song-content.active {
      background: #8484f7;
      color: white;
    }

    .song-container .song-content .content-btn {
      position: absolute;
      right: 5px;
      top: 5px;
      font-size: 12px;
    }

    .song-container .song-content .content-btn.danger {
      color: #f95a5a;
    }

    .song-container .song-content:hover .content-btn, .song-container .song-content.active .content-btn {
      color: white;
    }

    .song-container .song-content .content-info {
      display: flex;
      align-items: center;
      flex: 1;
    }

    .song-container .song-content .content-info .info-img .img {
      height: 45px;
      width: 45px;
      background-position: center center;
      background-size: cover;
    }

    .song-container .song-content .content-info .info-msg {
      margin-left: 5px;
      flex: 1;
    }

    .song-container .song-content .content-info .info-msg .msg-title {
      font-size: 14px;
    }

    .song-container .song-content .content-info .info-msg .msg-artist {
      margin-top: 5px;
      font-size: 12px;
      opacity: .6;
    }

    .song-container .song-rank {
      margin-left: 50px;
      border-radius: 0 0 0 10px;
    }

    .song-container .song-rank .rank-item {
      display: inline-block;
      padding: 0 0 0 5px;
      background: #8484f7;
      color: white;
      border-radius: 50px;
    }

    .song-container .song-rank .rank-item.last-up {
      background: #8bc34a;
    }

    .song-container .song-rank .rank-item.last-up .item-title {
      color: #8bc34a;
    }

    .song-container .song-rank .rank-item.last-down {
      background: #F44336;
    }

    .song-container .song-rank .rank-item.last-down .item-title {
      color: #F44336;
    }

    .song-container .song-rank .rank-item.last-new {
      background: #FFC107;
    }

    .song-container .song-rank .rank-item.last-new .item-title {
      color: #FFC107;
    }

    .song-container .song-rank .rank-item > * {
      display: inline-block;
      vertical-align: middle;
    }

    .song-container .song-rank .rank-item > * + * {
      margin-left: 5px;
    }

    .song-container .song-rank .rank-item .item-title {
      position: relative;
      width: 24px;
      height: 24px;
      font-size: 12px;
      font-weight: 1000;
      border-radius: 50%;
      background: white; 
      color: #8484f7;
    }

    .song-container .song-rank .rank-item .item-title:before {
      content: attr(data-before);
      display: inline-block;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(.8);
    }

    .song-container .song-rank .rank-item .item-desc {
      font-size: 12px;
      font-style: italic;
      transform: scale(.65);
      transform-origin: 0 center;
    }

    .song-container .song-rank .rank-item .item-desc .desc-before {
      
    }

    .song-container .song-rank .rank-item .item-desc .desc-after {
      
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

  let index = -1;
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
}

loop(100)(_ready, () => getData().then(render));
