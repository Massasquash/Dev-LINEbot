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
    switch(flag){
      case "1":
        cache.put("flag", 2)
        cache.put("category", event.message.text);
        outputLog("getMessage(category)", event.message.text); 
        var msg = "作業名を入力してください（例：播種、追肥、防除…）"
        reply(replyToken, msg);
        break;
    
      case "2":
        cache.remove("flag");
        outputLog("getMessage(title)", event.message.text);

        var date = cache.get("date");
        var title = cache.get("category");
        title = title + " " + event.message.text;
        reply(replyToken, "Googleカレンダーに予定を追加しました");

        // calendar.createAllDayEvent(title, date);
        break;
    }
  }
}

//ポストバックアクションを受け取った時の処理
function getPostback(event, replyToken){
  var cache = CacheService.getScriptCache();
  var flag = cache.get("flag");

  //ボタンテンプレートの入力により分岐を処理
  if(event.postback.data == "action=today"){
    var date = new Date();
  } else if(event.postback.data == "action=settime"){
    var date = event.postback.params.date;
  } else if(event.postback.data == "action=cancel"){
    cache.removeAll(["flag", "date", "category"]);
    msg = "日報登録をキャンセルしたよ";
    reply(replyToken, msg);
    return;
  }
  cache.put("flag", 1)
  cache.put("date", date);
  outputLog("getPostback(date)", date);
  outputLog("getPostback(typeof(date))", typeof(date));
  var msg = "${date}日の作業カテゴリを選択してください".replace("${date}", date);
  quickReply(replyToken, msg);

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
                "type" : "message",
                "label" : "敷地内作業",
                "text" : "敷地内選択"
              }
            },{
              "type" : "action",
              "action" :{
                "type" : "message",
                "label" : "小麦",
                "text" : "小麦"
              }
            },{
              "type" : "action",
              "action" :{
                "type" : "message",
                "label" : "ビート",
                "text" : "ビート"
              }
            },{
              "type" : "action",
              "action" :{
                "type" : "message",
                "label" : "馬鈴薯",
                "text" : "馬鈴薯"
              }
            },{
              "type" : "action",
              "action" :{
                "type" : "message",
                "label" : "大豆",
                "text" : "大豆"
              }
            },{
              "type" : "action",
              "action" :{
                "type" : "message",
                "label" : "長芋",
                "text" : "長芋"
              }
            },{
              "type" : "action",
              "action" :{
                "type" : "message",
                "label" : "他",
                "text" : "他"
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