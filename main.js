//スクリプトプロパティの読み込み
var prop = PropertiesService.getScriptProperties().getProperties();

//Googleサービス読み混み
var ssForLogs = SpreadsheetApp.getActiveSpreadsheet();
var calendar = CalendarApp.getCalendarById(prop.CALENDAR_ID);
var spreadsheet = SpreadsheetApp.openById(prop.SPREADSHEET_ID);

//LINE Messagin api
var replyUrl = "https://api.line.me/v2/bot/message/reply";
var header = {
  "Content-Type" : "application/json",
  "Authorization" : "Bearer " + prop.CHANNEL_ACCESS_TOKEN
}



// メイン処理。LINE botがユーザーからメッセージを受け取った時
function doPost(e) {
  var event = JSON.parse(e.postData.contents).events[0];
  var replyToken = event.replyToken;
  if(typeof replyToken === 'undefined'){
    outputLog("doPost", "replyToken is udefined");
    return;
  }

  try{
    outputLog("doPost(event)", event);
    if(event.type == "message") {
      getMessage(event, replyToken);
    } else if(event.type == "postback") {
      getPostback(event, replyToken);
    }
  } catch(e) {
    outputLog("error:" + e.lineNumber , e.message);
  }

};

// メッセージを受け取った時の処理
function getMessage(event, replyToken){
  var messageText = event.message.text;

  var cache = CacheService.getScriptCache();
  var flag = cache.get("flag");
  
  if(flag == null){
    // ユーザーから受け取ったメッセージにより部分一致で処理を分岐（WORK登録処理が進んでない場合）
    if(messageText.match("おつ")||messageText.match("疲")){
      // WORK登録処理を進める
      datetimePicker(replyToken);
    }else if(messageText.match("履歴")){
      var msg1 = "カレンダー\n" + prop.CALENDAR_URL;
      var msg2 = "シート\n" + prop.SPREADSHEET_URL;
      replyMessages(replyToken, msg1, msg2);
    }else{
      var msg = "【READ ME】\n●「おつかれ/お疲れ」と入れてみてください。日報を入力できます。\n●「履歴」と入れるとカレンダー・シートを送ります。";
      reply(replyToken, msg);
    }

  } else {

    cache.put("flag", 3)
    cache.put("title", event.message)
    outputLog("getPostback(title)", "作業タイトル入力完了。カレンダーに登録して確認リプライを送ります。");
    outputLog("getPostback(title)", event.message); 

  }
}

//ポストバックアクションを受け取った時の処理
function getPostback(event, replyToken){
  var cache = CacheService.getScriptCache();
  var flag = cache.get("flag");

  if(flag == null){
    if(event.postback.data == "action=today"){
      var date = new Date();
    } else if(event.postback.data == "action=settime"){
      var date = event.postback.params.date;
    }
    cache.put("flag", 1)
    cache.put("date", date);
    outputLog("getPostback(date)", "日付入力完了。次にカテゴリをクイックリプライで選択してもらう。");
    outputLog("getPostback(date)", date);
    var msg = "${date}日の作業カテゴリを選択してください".replace("${date}", date);
    quickReply(replyToken, msg);

  } else {
    cache.put("flag", 2);
    cache.put("category", event.postback.data);
    outputLog("getPostback(category)", "カテゴリ入力完了。次に作業名をユーザーに入力してもらう。");
    outputLog("getPostback(category)", event.postback.data); 
    var msg = "作業名を入力してください（例：播種、追肥、防除…）"
    reply(replyToken, msg);
  }
}





// ラインにメッセージを返す処理。
function reply(replyToken, msg){
  var message = {
    "replyToken" : replyToken,
    "messages" : [
      {
        "type" : "text",
        "text" : msg
      }
    ]
  };

  var options = {
    "method" : "post",
    "headers" : header,
    "payload" : JSON.stringify(message)
  };

  UrlFetchApp.fetch(replyUrl, options);
}


// ラインに二つのメッセージを返す処理。
function replyMessages(replyToken, msg1, msg2){
  var message = {
    "replyToken" : replyToken,
    "messages" : [{
        "type" : "text",
        "text" : msg1
      },{
        "type" : "text",
        "text" : msg2
      }
    ]
  };

  var options = {
    "method" : "post",
    "headers" : header,
    "payload" : JSON.stringify(message)
  };

  UrlFetchApp.fetch(replyUrl, options);
}


// ボタンテンプレートを出してから日時選択アクションを送る処理
function datetimePicker(replyToken){
  var message = {
    "replyToken" : replyToken,
    "messages" : [
      {
        "type" : "template",
        "altText" : "日報登録",
        "template" : {
          "type" : "buttons",
          "title" : "日報登録",
          "text" : "今日も一日お疲れ様でした！",
          "actions" :[
            {
              "type": "postback",
              "label":"今日の日報を書く",
              "data": "action=today",
              "displayText": "今日の日報を書く"
            },{
              "type": "datetimepicker",
              "label": "日付を選んで日報を書く",
              "data": "action=settime",
              "mode": "date"
            },{
              "type" : "postback",
              "label" : "やっぱりやめる",
              "data" : "action=cancel",
              "displayText": "やっぱりやめる"
            }
          ]
        }
      }
    ]
//  "notificationDisabled" : false // trueだとユーザーに通知されない
  };

  var options = {
    "method" : "post",
    "headers" : header, 
    "payload" : JSON.stringify(message)
  };
  UrlFetchApp.fetch(replyUrl, options);
}


// クイックリプライを送信する処理
function quickReply(replyToken, msg){
  var message = {
    "replyToken" : replyToken,
    "messages" : [
      {
        "type" : "text",
        "text" : msg,
        "quickReply" :{
           "items" :[
            {
              "type" : "action",
              "action" :{
                "type" : "postback",
                "label" : "敷地内作業",
                "data" : "action=setdata1",
                "displayText" : "【WORK登録】敷地内選択"
              }
            },{
              "type" : "action",
              "action" :{
                "type" : "message",
                "label" : "QR2",
                "text" : "QR2が選択されました。"
              }
            },{
              "type" : "action",
              "action" :{
                "type" : "message",
                "label" : "QR3",
                "text" : "QR3が選択されました。"
              }
            },{
              "type" : "action",
              "action" :{
                "type" : "message",
                "label" : "QR4",
                "text" : "QR4が選択されました。"
              }
            },{
              "type" : "action",
              "action" :{
                "type" : "message",
                "label" : "QR5",
                "text" : "QR5が選択されました。"
              }
            },{
              "type" : "action",
              "action" :{
                "type" : "message",
                "label" : "QR6",
                "text" : "QR6が選択されました。"
              }
            }
          ]
        }
      }
    ]
//    "notificationDisabled" : false // trueだとユーザーに通知されない
  };

  var options = {
    "method" : "post",
    "headers" : header,
    "payload" : JSON.stringify(message)
  };

  UrlFetchApp.fetch(replyUrl, options);
}


//スプレッドシートにログを表示するためのもの
function outputLog(label, text){
  var sheetName = "logs";
  ssForLogs.getSheetByName(sheetName).appendRow(
    [new Date(), label, text]
  );
  return;
}