const colorThief = new ColorThief();
const fileInput = document.getElementById('example');
let colors;

// ファイルが change された時の処理
const handleFileSelect = () => {
  const files = fileInput.files;
  for (let i = 0; i < files.length; i++) {
    previewFile(files[i]);
  }
};

const modelLoaded = () => {
  console.log('Model Loaded!');
  // 読み込みが終わったタイミングでファイルの change イベントを有効にする
  fileInput.addEventListener("change", handleFileSelect);
};

//カメラ
window.onload = () => {
  const video  = document.querySelector("#camera");
  const canvas = document.querySelector("#picture");
  const se     = document.querySelector('#se');

  /** カメラ設定 */
  const constraints = {
    audio: false,
    video: {
      width: { min: 800, max: 1920 },
      height: { min: 600, max: 1080 },
      facingMode:  { exact: "environment" }   // フロントカメラを利用する
      // facingMode: { exact: "environment" }  // リアカメラを利用する場合
    }
  };

  /**
   * カメラを<video>と同期
   */
  navigator.mediaDevices.getUserMedia(constraints)
  .then( (stream) => {
    video.srcObject = stream;
    video.onloadedmetadata = (e) => {
      video.play();
    };
  })
  .catch( (err) => {
    console.log(err.name + ": " + err.message);
  });

  /**
   * シャッターボタン
   */
   document.querySelector("#shutter").addEventListener("click", () => {
    const ctx = canvas.getContext("2d");

    // 演出的な目的で一度映像を止めてSEを再生する
    video.pause();  // 映像を停止
    se.play();      // シャッター音
    setTimeout( () => {
      video.play();    // 0.5秒後にカメラ再開
    }, 500);

    // canvasに画像を貼り付ける
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  });
};

const previewFile = (file) => {
  // プレビュー画像を追加する要素
  // const preview = document.getElementById('preview');
  const preview = ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // FileReaderオブジェクトを作成
  const reader = new FileReader();

  // URLとして読み込まれたときに実行する処理
  reader.onload = (e) => {
    const imageUrl = e.target.result; // URLはevent.target.resultで呼び出せる
    const img = document.createElement("img"); // img要素を作成
    //色解析
    const showcolors = (colors) => {
      const palettelist = document.querySelectorAll('.js-palette');
      palettelist.forEach((paletteItem, index) => {
        paletteItem.style.backgroundColor = `rgb(${colors[index][0]},${colors[index][1]},${colors[index][2]})`
        //SVGの色変換
        const pathList = document.querySelectorAll(`.path`);
          pathList.forEach((pathItem, index) => {
            pathItem.style.fill = `rgb(${colors[index][0]},${colors[index][1]},${colors[index][2]})`;
          });
      });
    };
    //かたち解析
    const showobjects = (objects) => {
      const objectlist = document.querySelectorAll('.js-objects');
      objectlist.forEach((objectItem, index) => {
        console.log(objects[index].label);
        objectItem.innerHTML = `<b>${objects[index].label}</b>`
      });
    };

    img.src = imageUrl; // URLをimg要素にセット
    preview.appendChild(img); // #previewの中に追加

    if (img.complete) {
      classifier.classify(img, (err, results) => {
        objects = (err, results);
        showobjects(objects);
      });
      colors = colorThief.getPalette(img, 10);
      showcolors(colors);

    } else {
      img.addEventListener('load', () => {
        classifier.classify(img, (err, results) => {
          objects = (err, results);
          showobjects(objects);
        });
        colors = colorThief.getPalette(img, 10);
        showcolors(colors);
      });
    }

  }

  // いざファイルをURLとして読み込む
  reader.readAsDataURL(file);
}

// MobileNetによる画像分類法の初期化
const classifier = ml5.imageClassifier('MobileNet', modelLoaded);