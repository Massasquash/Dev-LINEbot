//スクリプトプロパティの読み込み
var prop = PropertiesService.getScriptProperties().getProperties();

//Googleサービス読み混み
var ssForLogs = SpreadsheetApp.getActiveSpreadsheet();
var calendar = CalendarApp.getCalendarById(prop.CALENDAR_ID);
var spreadsheet = SpreadsheetApp.openById(prop.SPREADSHEET_ID);



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
    if(event.type == "message"){
      outputLog("doPost", event.type);
      getMessage(event, replyToken);
    } else if(event.type == "postback"){
      outputLog("doPost", event.type);
      getWork(event, replyToken);
    }
  } catch(e) {
    outputLog("例外処理", e.message);
  }

};

// メッセージを受け取った時の処理
function getMessage(event, replyToken){
  var messageText = event.message.text;
  
  // ユーザーから受け取ったメッセージを部分一致で処理を分岐
  if(messageText.match("おつ")||messageText.match("疲")){
    datetimePicker(replyToken);

  }else if(messageText.match("履歴")){
    var message1 = "カレンダー\n" + prop.CALENDAR_URL;
    var message2 = "シート\n" + prop.SPREADSHEET_URL;
    replyMessages(replyToken, message1, message2);

  }else{
    var message = "【READ ME】\n●「おつかれ/お疲れ」と入れてみてください。日報を入力できます。\n●「履歴」と入れるとカレンダー・シートを送ります。";
    reply(replyToken, message);
  };
}


// ボタンテンプレートを出してから日時選択アクションを送る処理
function datetimePicker(replyToken){
  var url = "https://api.line.me/v2/bot/message/reply";

  var message = {
    "replyToken" : replyToken,
    "messages" : [
      {
        "type" : "template",
        "altText" : "日報を入力する？",
        "text" : "日報登録",
        "template" : {
          "type" : "buttons",
          "title" : "日報登録",
          "text" : "選んでね",
          "defaultAction" : {
            "type": "datetimepicker",
            "label": "はい",
            "data": "action=settime",
            "mode": "date"
          },
          "actions" :[
            {
              "type": "datetimepicker",
              "label": "はい",
              "data": "action=settime",
              "mode": "date"
            },{
              "type" : "postback",
              "label" : "やっぱりやめる",
              "data" : "action=cancel"
            }
          ]
        }
      }
    ]
//  "notificationDisabled" : false // trueだとユーザーに通知されない
  };

  var options = {
    "method" : "post",
    "headers" : {
      "Content-Type" : "application/json",
      "Authorization" : "Bearer " + prop.CHANNEL_ACCESS_TOKEN
    }, 
    "payload" : JSON.stringify(message)
  };
  UrlFetchApp.fetch(url, options);
}

function getWork(event,replyToken){
  var date = event.postback.params.date;
  var message = "${date}日の作業カテゴリを選択してください".replace("${date}", date);
  outputLog("5", date);
  reply(replyToken, message);
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
      "Authorization" : "Bearer " + prop.CHANNEL_ACCESS_TOKEN
    },
    "payload" : JSON.stringify(message)
  };

  UrlFetchApp.fetch(url, options);
}


// ラインに二つのメッセージを返す処理。
function replyMessages(replyToken, message1, message2){
  var url = "https://api.line.me/v2/bot/message/reply";
  var message = {
    "replyToken" : replyToken,
    "messages" : [{
        "type" : "text",
        "text" : message1
      },{
        "type" : "text",
        "text" : message2
      }
    ]
  };

  var options = {
    "method" : "post",
    "headers" : {
      "Content-Type" : "application/json",
      "Authorization" : "Bearer " + prop.CHANNEL_ACCESS_TOKEN
    },
    "payload" : JSON.stringify(message)
  };

  UrlFetchApp.fetch(url, options);
}





// // クイックリプライを送信する処理
// function quickReply(replyToken, quickReplymessage){
//   var url = "https://api.line.me/v2/bot/message/reply";

//   var message = {
//     "replyToken" : replyToken,
//     "messages" : [
//       {
//         "type" : "text",
//         "text" : quickReplymessage,
//         "quickReply" :{
//            "items" :[
//             {
//               "type" : "action",
//               "action" :{
//                 "type" : "postback",
//                 "label" : "敷地内作業",
//                 "data" : "action=setdata1",
//                 "displayText" : "【WORK登録】敷地内選択"
//               }
//             },{
//               "type" : "action",
//               "action" :{
//                 "type" : "message",
//                 "label" : "QR2",
//                 "text" : "QR2が選択されました。"
//               }
//             },{
//               "type" : "action",
//               "action" :{
//                 "type" : "message",
//                 "label" : "QR3",
//                 "text" : "QR3が選択されました。"
//               }
//             },{
//               "type" : "action",
//               "action" :{
//                 "type" : "message",
//                 "label" : "QR4",
//                 "text" : "QR4が選択されました。"
//               }
//             },{
//               "type" : "action",
//               "action" :{
//                 "type" : "message",
//                 "label" : "QR5",
//                 "text" : "QR5が選択されました。"
//               }
//             },{
//               "type" : "action",
//               "action" :{
//                 "type" : "message",
//                 "label" : "QR6",
//                 "text" : "QR6が選択されました。"
//               }
//             }
//           ]
//         }
//       }
//     ]
// //    "notificationDisabled" : false // trueだとユーザーに通知されない
//   };

//   var options = {
//     "method" : "post",
//     "headers" : {
//       "Content-Type" : "application/json",
//       "Authorization" : "Bearer " + prop.CHANNEL_ACCESS_TOKEN
//     },
//     "payload" : JSON.stringify(message)
//   };

//   UrlFetchApp.fetch(url, options);

// }


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