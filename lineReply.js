//LINE Messagin apiパラメータ
var replyUrl = "https://api.line.me/v2/bot/message/reply";
var header = {
  "Content-Type" : "application/json",
  "Authorization" : "Bearer " + prop.CHANNEL_ACCESS_TOKEN
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

  var items = [];
  for(var index in categories){
    items.push(
      {
        "type" : "action",
        "action" :{
          "type" : "message",
          "label" : categories[index],
          "text" : categories[index]
        }
      }
    );
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
  };

  var options = {
    "method" : "post",
    "headers" : header,
    "payload" : JSON.stringify(message)
  };

  UrlFetchApp.fetch(replyUrl, options);
}

// カルーセルテンプレートでReadMeを表示する機能
function carouselTemplate(replyToken) {

  var message = {
    "replyToken" : replyToken,
    "messages" : [
      {
        "type" : "template",
        "altText" : "使い方",
        "template" : {
          "type" : "carousel",
          "columns" : [
            {
              "title" : "使い方",
              "text" : "日報を入力したい",
              "actions" : [
                {
                  "type" : "postback",
                  "label" : "基本操作",
                  "data": "action=readme00"
                },{
                  "type" : "postback",
                  "label" : "入力項目について",
                  "data": "action=readme01"
                },{
                  "type" : "postback",
                  "label" : "キーボードが表示されない",
                  "data": "action=readme02"
                }
              ]
            },{
              "title" : "使い方",
              "text" : "履歴を見たい",
              "actions" : [
                {
                  "type" : "postback",
                  "label" : "基本操作",
                  "data": "action=readme10"
                },{
                  "type" : "postback",
                  "label" : "googleカレンダについて",
                  "data": "action=readme11"
                },{
                  "type" : "postback",
                  "label" : "スプレッドシートについて",
                  "data": "action=readme12"
                }
              ]
            },{
              "title" : "使い方",
              "text" : "その他",
              "actions" : [
                {
                  "type" : "postback",
                  "label" : "作業カテゴリを編集したい",
                  "data": "action=readme20"
                },{
                  "type" : "postback",
                  "label" : "日報の編集・削除について",
                  "data": "action=readme21"
                },{
                  "type" : "postback",
                  "label" : "制作者コメント",
                  "data": "action=readme22"
                }
              ]
            }
          ]
        }
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