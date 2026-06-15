# 吴欣霖生日主页

## 本地预览

直接双击 `index.html` 即可浏览。为获得最稳定的效果，也可以在本目录运行：

```powershell
python -m http.server 4173
```

然后访问 `http://localhost:4173`。

## 修改内容

人物资料、祝福文案、照片说明和音乐路径集中在 `birthday-profile.js`。

当前使用的原创动漫人物位于 `assets/illustrations/wuxinlin-anime-v2.webp`。旧版立绘仍保留在同目录中作为备份。

结尾三份礼物的主题、标题和祝福初稿位于 `birthday-profile.js` 的 `gifts` 数组中，最终确定文案后直接修改对应的 `message` 即可。

若要加入音乐：

1. 将 MP3 文件放入 `assets/music/`。
2. 把 `birthday-profile.js` 中 `music.src` 改为 `assets/music/文件名.mp3`。

音乐不会自动播放，访客需要主动点击页面右上角的播放按钮。

## 部署

整个目录均为静态文件，可以直接上传到 GitHub Pages、Netlify 或其他静态托管平台。所有资源均使用相对路径。
