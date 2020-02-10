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

    for(var index in categories){
        var items = [];
        items[index] = {
            "type" : "action",
            "action" :{
            "type" : "message",
            "label" : categories[index],
            "text" : categories[index]
          }
        };
      }

    var message = {
      "replyToken" : replyToken,
      "messages" : [
        {
          "type" : "text",
          "text" : msg,
          "quickReply" :{
             "items" : items
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