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

const previewFile = (file) => {
  // プレビュー画像を追加する要素
  const preview = document.getElementById('preview');

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
      });
    };
    img.src = imageUrl; // URLをimg要素にセット
    preview.appendChild(img); // #previewの中に追加

    if (img.complete) {
      classifier.classify(img, (err, results) => {
       console.log(err, results)
      });
      colors = colorThief.getPalette(img, 5);
      showcolors(colors);

    } else {
      img.addEventListener('load', () => {
        classifier.classify(img, (err, results) => {
          console.log(err, results);
        });
        colors = colorThief.getPalette(img, 5);
        showcolors(colors);
      });
    }

  }

  // いざファイルをURLとして読み込む
  reader.readAsDataURL(file);
}

// MobileNetによる画像分類法の初期化
const classifier = ml5.imageClassifier('MobileNet', modelLoaded);