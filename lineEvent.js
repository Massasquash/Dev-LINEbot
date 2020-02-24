//var richmenuId = "";



function follow(event, replyToken){
    setDefaultRichmenu();

    var userId = event.source.userId;
    usersSheet.appendRow([userId]);

    var msg = "【農作業日誌BOT】\nラインで作業日誌を記録してGoogleカレンダーに登録するアプリ。ストレスなく作業の記録を残せるはず。出先でも登録＆確認できるよ！\n使ってみた感想を教えてね\n\nまずは↓の画像マニュアルに従って、自分用の「作業カテゴリ」を登録してみよう";
    var imgId   = "1LRS0bOoby9BXl89NNYbuayOpVrlMySJn";
    var imgUrl  = "https://drive.google.com/uc?id=" + imgId;
    var tmbId   = "1tikY01qfm3G4OYUlG3y5-w4LzBo8u6-K";
    var tmbUrl  = "https://drive.google.com/uc?id=" + tmbId;
    replyMessages(replyToken, msg, imgUrl, tmbUrl);
  }


//以下、リッチメニュー に関する処理
//デフォルトメニューに設定する関数（フォロー時に実行される）
function setDefaultRichmenu(){

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


//次のpostRichMenuImage関数を実行してrichmenuを作成する（初期設定時に一度のみ）
//取得したrichmenuIdをファイル上部に記入
function postRichMenuImage(){

  var richmenuId = getRichmenuId();
  var richmenuUrl = "https://api-data.line.me/v2/bot/richmenu/" + richmenuId + "/content";

  var content = "1QSrUQ3WJqhZvjoOq0rTB1WKEuW2hKjJR";
  var contentType = "image/png";

  var blob = DriveApp.getFileById(content).getBlob();

  var richmenuHeader = {
    "Content-Type" : contentType,
    "Authorization" : "Bearer " + prop.CHANNEL_ACCESS_TOKEN
  };
  
  var options = {
    'headers': richmenuHeader,  
    'method': 'post',
    'payload': blob
  };

  UrlFetchApp.fetch(richmenuUrl, options);

}

function getRichmenuId(){
  var richmenuUrl = "https://api.line.me/v2/bot/richmenu";
  var richmenuHeader = {
  "Content-Type" : "application/json",
  "Authorization" : "Bearer " + prop.CHANNEL_ACCESS_TOKEN
  };

  var richmenuObject = {
    "size" : {
      "width" : 1200,
      "height" : 405
    },
    "selected" : true,
    "name" : "workdiaryMenu",
    "chatBarText" : "メニュー",
    "areas" : [
      {
        "bounds" : {
            "x" : 0,
            "y" : 0,
            "width" : 400,
            "height" : 405
        },
        "action":{
            "type" : "message",
            "text" : "おつかれさま！"
        }
      },{
        "bounds" : {
            "x" :400,
            "y" : 0,
            "width" : 400,
            "height" : 405
        },
        "action":{
            "type" : "message",
            "text" : "履歴を見る"
        }
      },{
        "bounds" : {
            "x" : 800,
            "y" : 0,
            "width" : 400,
            "height" : 405
        },
        "action":{
            "type" : "message",
            "text" : "使い方を知りたい！"
        }
      }
    ]
  };

  var options = {
    'headers': richmenuHeader,  
    'method': 'post',
    'payload' : JSON.stringify(richmenuObject)
  };

  richmenuId = UrlFetchApp.fetch(richmenuUrl, options);

  outputLog("getRichmenuId", "Initialize", richmenuId);

  return richmenuId;

}