#UK-Charts
帮助浏览UK榜歌曲，方便听歌。

<style>
  [id*='icon'] {
    width: 300px;
    margin-left: 2em;
  }

  [id*='preview'] {
    margin: 0 2em;
    padding-bottom: 51%;
    background-position: 50% 0;
    background-size: cover;
    background-image: url(https://github.com/xiaoshuangLi/UK-Charts/raw/master/imgs/help-2.png);
  }

  [id*='container'] {
    display: flex;
  }

  [id*='container'] > div {
    width: 200px;
    padding-bottom: 200px;
    border: 5px solid white;
    border-radius: 5px;
    box-shadow: 0 0 3px rgba(0,0,0, .2);
    background-size: contain;
  }

  [id*='ali'] {
    background-size: contain; background-image: url(https://github.com/xiaoshuangLi/UK-Charts/raw/master/imgs/ali.jpg);
  }

  [id*='wechat'] {
    margin-left: 20px;
    background-size: contain; background-image: url(https://github.com/xiaoshuangLi/UK-Charts/raw/master/imgs/wechat.jpg);
  }
</style>

### 使用方法
* 点击下载[插件文件](https://github.com/xiaoshuangLi/UK-Charts/raw/master/UK-Charts.crx)。

* 拖拽至Chrome。如果提示有风险，直接点保留就可以了。安装后右上方会有UK Charts的Logo。<br> ps: 不敢上chrome 商店，怕被律师函警告，所以只能手动安装。

<img id="icon" src="https://github.com/xiaoshuangLi/UK-Charts/raw/master/imgs/help-1.jpg">

* 然后点击右上方的插件按钮, 会自动跳转UK榜官网, 等一会右侧会加载出歌单。<br> ps: 需要翻墙，不然有些歌可能加载不出来。如果还有问题，可能需要再[这个网站](https://www.deezer.com)上注册一下。

<div id="preview"></div>

### 使用说明
* 点击歌曲名，可以播放或者暂停。歌曲结束会自动播放下一首。歌曲只有试听片段，不是完整的。毕竟白嫖。。。
* 点击 Search, 会自动跳转至QQ音乐，并搜索当前歌曲。如果 Search 是红色，表示这首歌没有试听片段。
* 键盘 ⬆️ ⬇️, 可以切换至上一首和下一首。

### 特别感谢

魔宫玫瑰/魔宫那个玫瑰，我木jj我怕谁，柚子木字幕组. 感谢他们让我们可以听到很多好听的歌。

### 如果可以的话

敲码不易，如果可以赞助一下的话就更好了。如果感觉有啥问题，可以联系我，我会尽量修改。

<div id="container">
  <div id="ali"></div>
  <div id="wechat"></div>
</div>