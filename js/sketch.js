const imageFile = 'img/猫.jpg';//画像ファイル名
console.log(imageFile);
let classifier;//画像分類器
let img;//画像
let status = '';//表示テキスト

function preload(){
    console.log(preload);
    //モデルを読み込み
    classifier = ml5.imageClassifier('MobileNet');
    //画像を読み込み
    img = loadImage(imageFile);
    console.log(img);
}

function setup(){
    //p5.jsキャンバス生成
    createCanvas(windowWidth, windowHeight);
    status = '画像分析中…';
    //画像の分析開始
    classifier.classify(img, gotResult);
}

function draw(){
    //画像を表示
    image(img, 0, 0, width, height);
    //分析結果をテキストで表示
    fill(255, 255, 127);
    textSize(18);
    text(status, 20, 30);
}

//解析結果の出力
function gotResult(err, results){
    //エラー処理
    if (err){
        console.error(err);
        status = err;
    }
    //結果を出力
    status = 'クラス名：　' + results[0].label + ', 確度：　' + results[0].confidence + '¥n';
}