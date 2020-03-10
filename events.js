//初期設定について：
//initiallize()関数を実行してrichmenuを作成する（初期設定時に一度のみ）
//取得したrichmenuIdがRICH_MENU_IDとしてスクリプトプロパティに自動記入されていることを確認
//最後にwebUrlをスクリプトプロパティ「WEB_URL」に記入する（手動）


//webフォームからの入力に関する処理
function doGet(){
  return HtmlService.createTemplateFromFile("form").evaluate();
} 

function postCategories(e) {
  // 「e.parameter.フォーム名(inputタグの名前)」 でフォームから送信されたパラメータをオブジェクトで取得できる
  var entryForm = ["category1", "category2", "category3", "category4", "category5", "category6", "category7", "category8", "category9", "category10", "category11", "category12" ,"category13"]
  
  for(var i=0; i<13; i++){
    userSheet.getRange(i+5,2).setValue(e.parameter[entryForm[i]]);
  }
  return
}


//LINE フォロー時の処理
function follow(event, replyToken){
    var userId = event.source.userId;
    usersSheet.appendRow([userId]);

    var msg1 = "【農作業記録アシスタント】\n今日の作業をラインで入力！作業日誌を簡単に入力してGoogleカレンダーに登録するアプリ。\n使ってみた感想を教えてね\n\nまずは↓のページを開いて、自分用の「作業カテゴリ」を登録してみよう\n\n登録が終わったら画面一番下の「メニュー」を開いて「日報を入力」をタップしてみよう";
    replyMessages(replyToken, msg1, prop.WEB_URL);
}









//以下、初期設定用
//LINE messaging API リッチメニューに関する操作
function initiallize(){
  outputLog("initiallize", "Start!", "");
  var richMenuId = getRichMenuId();
  postRichMenuImage(richMenuId);
  setDefaultRichMenu(richMenuId);
  PropertiesService.getScriptProperties().setProperty("RICH_MENU_ID", richMenuId);
  outputLog("initiallize", "Finish!");
}


//デフォルトメニューに設定する関数
function setDefaultRichMenu(richMenuId){

  var richMenuUrl = "https://api.line.me/v2/bot/user/all/richmenu/" + richMenuId ;
  var richMenuHeader = {
    "Authorization" : "Bearer " + prop.CHANNEL_ACCESS_TOKEN
  };

  var options = {
    'headers': richMenuHeader,
    'method': 'post',
  };

  UrlFetchApp.fetch(richMenuUrl, options); 
  
  outputLog("setDefaultRichMenu", "OK", richMenuId);
}





function postRichMenuImage(richMenuId){

  var richMenuUrl = "https://api-data.line.me/v2/bot/richmenu/" + richMenuId + "/content";

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
  outputLog("postRichMenuImage", "OK", response);
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
            "text" : "他にできることを教えて"
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
  outputLog("getRichMenuId", "OK", richMenuId);

  return richMenuId;
}