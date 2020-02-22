var richMenuId = "";
var richMenuUrl = "https://api-data.line.me/v2/bot/richmenu/" + richMenuId;
var richMenuHeader = {
  "Content-Type" : "image/jpeg",
  "Authorization" : "Bearer " + prop.CHANNEL_ACCESS_TOKEN
}

function follow(event, replyToken){
  var msg = "【農作業日誌BOT】\nラインで作業日誌を記録してGoogleカレンダーに登録するアプリ。ストレスなく作業の記録を残せるはず。出先でも登録＆確認できるよ！\n使ってみた感想を教えてね\n\nまずは↓の画像マニュアルに従って、自分用の「作業カテゴリ」を登録してみよう";
  var imgId = "1LRS0bOoby9BXl89NNYbuayOpVrlMySJn";
  var imgUrl = "https://drive.google.com/uc?id=" + imgId;
  var tmbId = "1tikY01qfm3G4OYUlG3y5-w4LzBo8u6-K";
  var tmbUrl = "https://drive.google.com/uc?id=" + tmbId;
  replyMessages(replyToken, msg, imgUrl, tmbUrl);
}



function postRichMenuImage(){


  var content = "";
  var contentType = "image/png";

  var options = {
    "method" : "post",
    "headers" : header,
    "payload" : DriveApp.getFileById(content).getBlob()
  };

  var response = UrlFetchup.fetch(richMenuUrl, options);

}