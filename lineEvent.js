var richmenuId = "richmenu-986e3c58e438be65ee14aed5093554fd";

function follow(replyToken){
  setDefaultMenu();

  var msg = "【農作業日誌BOT】\nラインで作業日誌を記録してGoogleカレンダーに登録するアプリ。ストレスなく作業の記録を残せるはず。出先でも登録＆確認できるよ！\n使ってみた感想を教えてね\n\nまずは↓の画像マニュアルに従って、自分用の「作業カテゴリ」を登録してみよう";
  var imgId = "1LRS0bOoby9BXl89NNYbuayOpVrlMySJn";
  var imgUrl = "https://drive.google.com/uc?id=" + imgId;
  var tmbId = "1tikY01qfm3G4OYUlG3y5-w4LzBo8u6-K";
  var tmbUrl = "https://drive.google.com/file/d/" + tmbId + "/view?usp=sharing";
  replyMessageAndPicture(replyToken, msg, imgUrl, tmbUrl);
}



//リッチメニュー作成・画像のアップロードとメニューとの紐付けをPostmanで実行
//以下はデフォルトメニューに設定する関数（フォロー時に実行される）
function setDefaultMenu(){

  var url = "https://api.line.me/v2/bot/user/all/richmenu/" + richmenuId ;
  var header = {
    "Authorization" : "Bearer " + prop.CHANNEL_ACCESS_TOKEN,
    "payload":{}
  };

  var options = {
    'headers': header,  
    'method': 'post',
  };

  UrlFetchApp.fetch(url, options);
}