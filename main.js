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