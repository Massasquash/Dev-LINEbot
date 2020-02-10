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