var CHANNEL_ACCESS_TOKEN = "rl+DTHhZ8PyTgSFeeiD30an9Ts6VU1OP1v+VNuYfR1tyAT/muNfhmFgLioDvRND+N25Cma6vE9ijuIHvTasPukgEUefYQFy45rR+L941wbMNoginFfWT/+vA0WDWfddN0r99dHqfZhuFY5mqbffXygdB04t89/1O/w1cDnyilFU=";

var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();

// メイン処理。LINE botがユーザーからメッセージを受け取った時
function doPost(e) {
  getMessage(e);
  outputLog(e);
}

function getMessage(e){
  var event = JSON.parse(e.postData.contents).events[0];
  var replyToken = event.replyToken;
  if(typeof replyToken === 'undefined'){
    return;
  };

  var messageText = event.message.text;
  var cache = CacheService.getScriptCache();

  if(messageText.match("おつかれ")){

    

  }else if(messageText.match("履歴")){


  }else{
    message = "【READ ME】\n●「おつかれ」と入れてみてください。日報を入力できます。\n●「履歴」と入れるとカレンダー・シートを送ります。";
    reply(replyToken, message);
  };
}


// ラインにメッセージを返す処理。
function reply(replyToken, message){

  var url = "https://api.line.me/v2/bot/message/reply";
  var message = {
    "replyToken" : replyToken,
    "messages" : [
      {
        "type" : "text",
        "text" : message
      }
    ]
  };

  var options = {
    "method" : "post",
    "headers" : {
      "Content-Type" : "application/json",
      "Authorization" : "Bearer " + CHANNEL_ACCESS_TOKEN
    },
    "payload" : JSON.stringify(message)
  };

  UrlFetchApp.fetch(url, options);

}



//スプレッドシートにログを表示するためのもの
function outputLog(text){
  var sheetName = "logs";
  spreadSheet.getSheetByName(sheetName).appendRow(
    [new Date(), text]
  );
}