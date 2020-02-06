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
    outputLog("doPost", event);
    getMessage(event, replyToken);
  } catch(e) {
    outputLog("doPost", e.message);
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
      cache.put("flag", 1)
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
    // WORK登録処理中にユーザーが「キャンセル」と入力した場合
    if(messageText === "キャンセル"){
      cache.remove("flag");
      msg = "日報登録をキャンセルしたよ";
      reply(replyToken, msg);
      return;
    }

    //cacheのflagの値によってWORK登録処理を分岐
    switch(flag){
      case "1":
        cache.put("flag", 2);
        cache.put("date", event.postback.params.date)
        msg = "次にカテゴリを選んでね。「キャンセル」でキャンセルします。";
        quickReply(replyToken, msg);
        break;
      case "2":
        cache.put("flag", 3);
        cache.put("category", event.postback.data );
        msg = "次に内容をチャットで入力してね。「キャンセル」でキャンセルします。";
        reply(replyToken, msg);
        break;
    }

  }
}





// ボタンテンプレートを出してから日時選択アクションを送る処理
function datetimePicker(replyToken){
  var message = {
    "replyToken" : replyToken,
    "messages" : [
      {
        "type" : "template",
        "altText" : "日報登録"
        "template" : {
          "type" : "buttons",
          "title" : "日報登録",
          "text" : "今日も一日お疲れ様でした！"
          },
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

function getWork(event,replyToken){
  var date = event.postback.params.date;
  var message = "${date}日の作業カテゴリを選択してください".replace("${date}", date);
  outputLog("5", date);
  reply(replyToken, message);
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


//   //デバッグ用ログテンプレ
//   outputLog("0", e.postData.contents);
//   outputLog("1", JSON.parse(e.postData.contents));
//   outputLog("2", JSON.parse(e.postData.contents).events[0]);
//   outputLog("3", JSON.parse(e.postData.contents).events[0].message.text);
//   outputLog("4", JSON.parse(e.postData.getDataAsString()));
//   outputLog("5", JSON.parse(e.postData.getDataAsString()).events[0]);
//   outputLog("6", JSON.parse(e.postData.getDataAsString()).events[0].postback.params);
//   outputLog("7", JSON.parse(e.postData.contents).events[0].postback.params);