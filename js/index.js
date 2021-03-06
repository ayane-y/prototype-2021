const colorThief = new ColorThief();
var image = new Image() ;
const fileInput = image;
let colors;
//モンスター選択
var monsterList = [];
for (var i = 0; i < 26; ++i) {
  monsterList.push(document.getElementById("monster_id_" + i));
}
console.log(monsterList[0].childNodes);

//モンスターアニメーション
gsap.set(monsterList,{
  opacity: 0,//透明にする
});

//色解析
const showcolors = (colors) => {
  const palettelist = document.querySelectorAll('.js-palette');
  palettelist.forEach((paletteItem, index) => {
    paletteItem.style.backgroundColor = `rgb(${colors[index][0]},${colors[index][1]},${colors[index][2]})`
  });

  //モンスターアニメーション
  gsap.set(monsterList,{
    opacity: 1,//透明にする
  });

  //SVGの色変換
  const path0List = document.querySelectorAll(`.path-color-0`);
  path0List.forEach((pathItem, index) => {
    pathItem.style.fill = `rgb(${colors[0][0]},${colors[0][1]},${colors[0][2]})`;
  });
  const path1List = document.querySelectorAll(`.path-color-1`);
  path1List.forEach((pathItem, index) => {
    pathItem.style.fill = `rgb(${colors[1][0]},${colors[1][1]},${colors[1][2]})`;
  });
  const path2List = document.querySelectorAll(`.path-color-2`);
  path2List.forEach((pathItem, index) => {
    pathItem.style.fill = `rgb(${colors[2][0]},${colors[2][1]},${colors[2][2]})`;
  });
  const path3List = document.querySelectorAll(`.path-color-3`);
  path3List.forEach((pathItem, index) => {
    pathItem.style.fill = `rgb(${colors[3][0]},${colors[3][1]},${colors[3][2]})`;
  });
  const path4List = document.querySelectorAll(`.path-color-4`);
  path4List.forEach((pathItem, index) => {
    pathItem.style.fill = `rgb(${colors[4][0]},${colors[4][1]},${colors[4][2]})`;
  });
  const path5List = document.querySelectorAll(`.path-color-5`);
  path5List.forEach((pathItem, index) => {
    pathItem.style.fill = `rgb(${colors[5][0]},${colors[5][1]},${colors[5][2]})`;
  });
};

//かたち解析
const showobjects = (objects) => {
  const objectlist = document.querySelectorAll('.js-objects');
  objectlist.forEach((objectItem, index) => {
    objectItem.innerHTML = `<b>${objects[index].label}</b>`
    console.log(objects[0].label.charAt(0));

    //モンスターアニメーション分岐
    if (objects[0].label.charAt(0) === 's') {
      console.log('スラ')
      gsap.to(monsterList[0],{
        opacity: 1,//不透明にする
      });
    // } else if(objects[0].label.charAt(0) === 'b') {
    //   console.log('スラ兄')
    //   gsap.to(monsterList[2],{
    //     opacity: 1,
    //   });
    // } else if(objects[0].label.charAt(0) === 'c') {
    //   console.log('スラ姉')
    //   gsap.to(monsterList[3],{
    //     opacity: 1,
    //   });
    } else {
      console.log('豚')
      gsap.to(monsterList[1],{
        opacity: 1,
      });
    }

  });
};

 //カメラ写真　色解析
const getpalette = (canvas) => {
  var url = canvas.toDataURL() ;
  var image = new Image();
  image.src = url ;
  document.body.appendChild( image ) ;
  if (image.complete) {
    colors = colorThief.getPalette(image, 10);
    showcolors(colors);
  } else {
    image.addEventListener('load', () => {
      colors = colorThief.getPalette(image, 10);
      showcolors(colors);
    });
  }
};

//カメラ写真　カタチ解析
const  getobject = (canvas) => {
  var url = canvas.toDataURL() ;
  var image = new Image();
  image.src = url ;
  document.body.appendChild( image ) ;
  if (image.complete) {
    classifier.classify(image, (err, results) => {
      objects = (err, results);
      showobjects(objects);
    });
  } else {
    image.addEventListener('load', () => {
      classifier.classify(image, (err, results) => {
        objects = (err, results);
        showobjects(objects);
      });
    });
  }
};

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
  const videoList  = document.querySelectorAll(".js-camera");
  const canvasList = document.querySelectorAll(".js-picture");
  const seList     = document.querySelectorAll('.js-se');

  /** カメラ設定 */
  const constraints = {
    audio: false,
    video: {
      // width: { min: 800, max: 1920 },
      // height: { min: 600, max: 1080 },
      // facingMode:  { exact: "environment" }   // フロントカメラを利用する
      // facingMode: { exact: "environment" }  // リアカメラを利用する場合
    }
  };

  /**
   * カメラを<video>と同期
   */
  navigator.mediaDevices.getUserMedia(constraints)
  .then( (stream) => {
    videoList.forEach((video) => {
      video.srcObject = stream;
      video.onloadedmetadata = (e) => {
        video.play();
      };
    });
  })
  .catch( (err) => {
    console.log(err.name + ": " + err.message);
  });

  /**
   * シャッターボタン
   */
   document.querySelectorAll(".js-shutter")
  .forEach((shutter,index) =>　{
    shutter.addEventListener("click", () => {
      const ctx = canvasList.item(index).getContext("2d");

      //モンスターアニメーションリセット
      gsap.set(monsterList,{
        opacity: 0,//透明にする
      });
  
      // 演出的な目的で一度映像を止めてSEを再生する
      // videoList.item(index).pause();  // 映像を停止
      // se.play();      // シャッター音
      // setTimeout( () => {
      //   video.play();    // 0.5秒後にカメラ再開
      // }, 500);
  
      // canvasに画像を貼り付ける
      ctx.drawImage(videoList.item(index), 0, 0, canvasList.item(index).width, canvasList.item(index).height);

      if (index === 0) {
        getpalette(canvasList.item(0));
      } else {
        getobject(canvasList.item(1));
      }
      // getpalette(canvasList.item(index));
      // getobject(canvasList.item(index));
    });
  });
};

const previewFile = (file) => {
  // プレビュー画像を追加する要素
  const preview = document.getElementById('preview');
  console.log(image);

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