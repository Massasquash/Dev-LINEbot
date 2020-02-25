//初期設定について：
//initiallize()関数を実行してrichmenuを作成する（初期設定時に一度のみ）
//取得したrichmenuIdがRICH_MENU_IDとしてスクリプトプロパティに自動記入されていることを確認




function follow(event, replyToken){
    var userId = event.source.userId;
    usersSheet.appendRow([userId]);

    var msg1 = "【農作業記録アシスタント】\n今日の作業をラインで入力！作業日誌を簡単に入力してGoogleカレンダーに登録するアプリ。\n使ってみた感想を教えてね\n\nまずは↓のページを開いて、自分用の「作業カテゴリ」を登録してみよう\n\n登録が終わったら画面一番下の「メニュー」を開いて「日報を入力」をタップしてみよう";
    var msg2 = "https://script.google.com/macros/s/AKfycbyt4pwDsRxNAzGL3xlWHDA1q4CafuaGctw3d4OzzwZ-giKzgxQ/exec"
    replyMessages(replyToken, msg1, msg2);
}






//以下、リッチメニュー に関する処理








//以下、初期設定用
function initiallize(){
  postRichMenuImage();
  setDefaultRichMenu();
  outputLog("initiallize", "プロパティ登録状況", prop.RICH_MENU_ID);
}


//デフォルトメニューに設定する関数（フォロー時に実行される）
function setDefaultRichMenu(){

  var richMenuUrl = "https://api.line.me/v2/bot/user/all/richmenu/" + prop.RICH_MENU_ID ;
  var richMenuHeader = {
    "Authorization" : "Bearer " + prop.CHANNEL_ACCESS_TOKEN
  };

  var options = {
    'headers': richMenuHeader,
    'method': 'post',
  };

  UrlFetchApp.fetch(richMenuUrl, options);  
}





function postRichMenuImage(){

  var richMenuUrl = "https://api-data.line.me/v2/bot/richmenu/" + prop.RICH_MENU_ID + "/content";

  var content = "1QSrUQ3WJqhZvjoOq0rTB1WKEuW2hKjJR";
  var contentType = "image/png";

  var blob = DriveApp.getFileById(content).getBlob();

  var richMenuHeader = {
    "Content-Type" : contentType,
    "Authorization" : "Bearer " + prop.CHANNEL_ACCESS_TOKEN
  };
  
  var options = {
    'headers': richMenuHeader,  
    'method': 'post',
    'payload': blob
  };

  var response = UrlFetchApp.fetch(richMenuUrl, options);
  outputLog("postRichMenuImage", "Initialize", response);
    
  return;
}

function getRichMenuId(){
  var richMenuUrl = "https://api.line.me/v2/bot/richmenu";
  var richMenuHeader = {
  "Content-Type" : "application/json",
  "Authorization" : "Bearer " + prop.CHANNEL_ACCESS_TOKEN
  };

  var richMenuObject = {
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
    'headers': richMenuHeader,  
    'method': 'post',
    'payload' : JSON.stringify(richMenuObject)
  };

  var response = UrlFetchApp.fetch(richMenuUrl, options);
  
  var richMenuId = JSON.parse(response).richMenuId;
  PropertiesService.getScriptProperties().setProperty("RICH_MENU_ID", richMenuId); 
  outputLog("getRichMenuId", "Initialize", richMenuId);

  return;
}