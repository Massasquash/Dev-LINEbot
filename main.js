//プロパティ・Googleサービスの読み込み
var prop = PropertiesService.getScriptProperties().getProperties();

var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
var calendar = CalendarApp.getCalendarById(prop.CALENDAR_ID);
// var spreadsheet = SpreadsheetApp.openById(prop.SPREADSHEET_ID);

//カテゴリ一覧
var categories =["圃場外", "小麦", "ビート", "馬鈴薯", "大豆", "長芋", "他"];

//シート・データを取得
var historySheet = spreadsheet.getSheetByName('作業履歴');
var masterSheet = spreadsheet.getSheetByName('master');
var readmeMessages = masterSheet.getRange('A2:C10').getValues();

//パラメータ
var eventExp =  /(.*?)\n([\s\S]*)/;


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
    reply(replyToken, "なんかおかしいよ。エラーを確認してね\n" + e.message);
    return;
  }

};



// メッセージを受け取った時の処理
function getMessage(event, replyToken){
  var messageText = event.message.text;

  var cache = CacheService.getScriptCache();
  var flag = cache.get("flag");
  
  // ユーザーから受け取ったメッセージにより処理を分岐（メニューから選択）
  if(messageText.match("おつかれさま！")){
    // WORK登録処理を進める
    datetimePicker(replyToken);
    cache.remove("flag");

  }else if(messageText.match("履歴を見る")){
    var msg1 = "カレンダー\n" + prop.CALENDAR_URL;
    var msg2 = "シート\n" + prop.SPREADSHEET_URL;
    replyMessages(replyToken, msg1, msg2);
    cache.remove("flag");

  }else if(messageText.match("使い方を知りたい")){
    carouselTemplate(replyToken);
    cache.remove("flag");

  } else {
    
    if(flag == null){
      var msg = "＼(^o^)／";
      reply(replyToken, msg);
      return;

    } else {
    //WORK登録処理を進める
      switch(flag){
        case "1":
          cache.put("flag", 2)
          cache.put("category", event.message.text);
          var msg1 = "（２）[作業名]を入れてね。\n２行目以降には[作業の詳細]も入れられるよ（無くても問題ないよ）\n左下のマークをタップしたらキーボードが出るよ。\n↓こんな感じでよろしく";
          var msg2 = "追肥\n圃場●●と××\n硫安 20kg/10a";
          replyMessages(replyToken, msg1, msg2);
          break;
      
        case "2":
          //タイトル・詳細を取得（ユーザー入力により分岐）
          if(messageText.match(eventExp)){
            var [fullText, title, desc] = messageText.match(eventExp);
            //取得文字数を制限
            title = title.substr(0, 20);
            desc = desc.substr(0, 200);
            cache.put("title", title);

          } else if(messageText.match(/(.*)/)){
            cache.put("title", messageText);
            var desc = "";

          } else {
            msg = "もう一度入力してね";
            reply(replyToken, msg);
            return;
          }

          var [title, date] = createDataForCalender(cache);
          var [year, month, day] = [date.getFullYear(), date.getMonth()+1, date.getDate()];
          var displayDate = year + "/" + month + "/" + day;

          var lastRow = historySheet.getLastRow();
          var workId = historySheet.getRange(lastRow, 1).getValue() + 1;

          var msg = "カレンダーに日報を登録したよ\n◼️日付：${displayDate}\n◼️タイトル：${title}\n◼️詳細：${desc}".replace("${displayDate}", displayDate).replace("${title}", title).replace("${desc}", desc);

          // カレンダー・シートへの登録処理。コーディング時はコメントアウト推奨
          historySheet.appendRow(
            [workId, displayDate, cache.get("category"), cache.get("title"), desc]
          );
          var option = { description: desc + "\nID: " + workId };
          calendar.createAllDayEvent(title, date, option);
          // カレンダー・シートへの登録処理ここまで

          reply(replyToken, msg);
          cache.removeAll(["flag", "date", "category", "title"]);
          break;
      }
    }
  }
}



//ポストバックアクションを受け取った時の処理
function getPostback(event, replyToken){
  var cache = CacheService.getScriptCache();

  //日報入力ボタンテンプレートの入力により分岐を処理
  if(event.postback.data == "action=today"){
    //今日の日付を選んだ場合はdateは"0"を入れる
    var date = "0";
    var msg = "（1）今日の作業カテゴリを選んでね";

  } else if(event.postback.data == "action=settime"){
    //日時選択アクションで取得した日付はstring型でdateに入る
    var date = event.postback.params.date;
    date = date.replace("-", "/").replace("-", "/");
    var msg = "（1）${date}日の[作業カテゴリ]を選んでね".replace("${date}", date);

  } else if(event.postback.data == "action=cancel"){
    cache.removeAll(["flag", "date", "category", "title"]);
    msg = "日報登録をキャンセルしたよ";
    reply(replyToken, msg);
    return;

  //使い方カルーセルテンプレートの入力により分岐を処理
  } else if(event.postback.data == "action=readme00"){
    msg = readmeMessages[0][2];
    reply(replyToken, msg);
    return;

  } else if(event.postback.data == "action=readme01"){
    msg = readmeMessages[1][2];
    reply(replyToken, msg);
    return;

  } else if(event.postback.data == "action=readme02"){
    msg = readmeMessages[2][2];
    reply(replyToken, msg);
    return;

  } else if(event.postback.data == "action=readme10"){
    msg = readmeMessages[3][2];
    reply(replyToken, msg);
    return;

  } else if(event.postback.data == "action=readme11"){
    msg = readmeMessages[4][2];
    reply(replyToken, msg);
    return;

  } else if(event.postback.data == "action=readme12"){
    msg = readmeMessages[5][2];
    reply(replyToken, msg);
    return;

  } else if(event.postback.data == "action=readme20"){
    msg = readmeMessages[6][2];
    reply(replyToken, msg);
    return;

  } else if(event.postback.data == "action=readme21"){
    msg = readmeMessages[7][2];
    reply(replyToken, msg);
    return;

  } else if(event.postback.data == "action=readme22"){
    msg = readmeMessages[8][2];
    reply(replyToken, msg);
    return;

  }

  cache.put("flag", 1)
  cache.put("date", date);
  quickReply(replyToken, msg);
}

//Googleカレンダーに登録する情報を作る処理
function createDataForCalender(cache){
  var _date = cache.get("date");
  var _category = cache.get("category");
  var _title = cache.get("title");

  if(_date == "0"){
    var date = new Date();
  } else {
    var date = new Date(_date);
  }
  var title = "[" + _category + "]" + _title

  return [title, date];
}








  //スプレッドシートにログを表示するためのもの
  function outputLog(label, text){
    spreadsheet.getSheetByName("logs").appendRow(
      [new Date(), label, text]
    );
    return;
  }