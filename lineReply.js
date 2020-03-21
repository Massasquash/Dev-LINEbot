// ラインにメッセージを返す処理。
function reply(replyToken, msg){
  const message = {
    "replyToken" : replyToken,
    "notificationDisabled" : true,
    "messages" : [
      {
        "type" : "text",
        "text" : msg
      }
    ]
  };

  const options = {
    "method" : "post",
    "headers" : replyHeader,
    "payload" : JSON.stringify(message)
  };

  UrlFetchApp.fetch(replyUrl, options);
}
  
  
// ラインに二つのメッセージを返す処理。
function replyMessages(replyToken, msg1, msg2){
  const message = {
    "replyToken" : replyToken,
    "notificationDisabled" : true,
    "messages" : [{
        "type" : "text",
        "text" : msg1
      },{
        "type" : "text",
        "text" : msg2
      }
    ]
  };

  const options = {
    "method" : "post",
    "headers" : replyHeader,
    "payload" : JSON.stringify(message)
  };

  UrlFetchApp.fetch(replyUrl, options);
}


// 日誌を入力・編集：カルーセルテンプレートを出す。日時選択アクション含む
function selectDiary(replyToken){
  const message = {
    "replyToken" : replyToken,
    "notificationDisabled" : true,
    "messages" : [
      {
        "type" : "template",
        "altText" : "日報の入力・編集",
        "template" : {
          "type" : "buttons",
          "title" : "日報を入力する",
          "text" : "日報を登録する？もし間違えちゃったら(3)を選んでから、もう一度登録し直してみてね。",
          "actions" :[
            {
              "type": "postback",
              "label": "(1)今日の日報を書く",
              "data": "action=today",
            },{
              "type": "datetimepicker",
              "label": "(2)日付を選んで日報を書く",
              "data": "action=settime",
              "mode": "date"
            },{
              "type": "postback",
              "label": "(3)直前の日報を取り消す",
              "data": "action=deletediary"
            },{
              "type" : "postback",
              "label" : "(4)やっぱりやめる",
              "data" : "action=cancel",
              "displayText": "やっぱりやめる"
            }
          ]
        }
      }
    ]
  };

  const options = {
    "method" : "post",
    "headers" : replyHeader, 
    "payload" : JSON.stringify(message)
  };
  UrlFetchApp.fetch(replyUrl, options);
}


// カテゴリ選択のクイックリプライを送信する処理
function selectCategory(replyToken, msg){
  let items = [];
  for(let index in categories){
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
  
  const message = {
    "replyToken" : replyToken,
    "notificationDisabled" : true,
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

  const options = {
    "method" : "post",
    "headers" : replyHeader,
    "payload" : JSON.stringify(message)
  };

  UrlFetchApp.fetch(replyUrl, options);
}


//直前の投稿を削除する：はい/いいえのクイックリプライを送信する処理
function confirmDeleteDiary(replyToken, msg){
  const message = {
    "replyToken" : replyToken,
    "notificationDisabled" : true,
    "messages" : [
      {
        "type" : "text",
        "text" : msg,
        "quickReply" :{
          "items" : [
            {
              "type" : "action",
              "action" :{
                "type" : "postback",
                "label" : "はい",
                "data" : "action=exe_deletediary",
                "displayText" : "日報を取り消しました！"
              }
            },{
              "type" : "action",
              "action" :{
                "type" : "postback",
                "label" : "いいえ",
                "data" : "action=cancel",
                "displayText" : "やっぱりやめる"
              }
            }
          ]
        }
      }
    ]
  };

  const options = {
    "method" : "post",
    "headers" : replyHeader,
    "payload" : JSON.stringify(message)
  };

  UrlFetchApp.fetch(replyUrl, options);
}


// 履歴を見る：ボタンテンプレートを出してからURLアクションを送る処理
function selectHistory(replyToken){
  const message = {
    "replyToken" : replyToken,
    "notificationDisabled" : true,
    "messages" : [
      {
        "type" : "template",
        "altText" : "履歴を表示",
        "template" : {
          "type" : "buttons",
          "title" : "履歴を表示",
          "text" : "ここから履歴を見ることができるよ。どちらか選んでね！",
          "actions" :[
            {
              "type": "uri",
              "label":"(1)カレンダーで見る",
              "uri": carendarUrl
            },{
              "type": "uri",
              "label": "(2)シートで一覧を見る",
              "uri": spreadsheetUrl
            },{
              "type": "postback",
              "label": "(3)日報を編集・削除したい",
              "data": "action=howtoedit"
            }
          ]
        }
      }
    ]
  };

  const options = {
    "method" : "post",
    "headers" : replyHeader, 
    "payload" : JSON.stringify(message)
  };
  UrlFetchApp.fetch(replyUrl, options);
}


// その他：カテゴリ編集と使い方のカルーセルテンプレート
function selectElse(replyToken){
  const message = {
    "replyToken" : replyToken,
    "notificationDisabled" : true,
    "messages" : [
      {
        "type" : "template",
        "altText" : "その他",
        "template" : {
          "type" : "buttons",
          "title" : "その他",
          "text" : "ここからは「カテゴリの編集」をしたり、「使い方」を見ることができるよ",
          "actions" :[
            {
              "type": "uri",
              "label":"(1)作業カテゴリを編集する",
              "uri": prop.WEB_URL
            },{
              "type": "postback",
              "label": "(2)カレンダーを編集したい",
              "data": "action=editcalendar"
            },{
              "type": "postback",
              "label": "(3)ヘルプを見る",
              "data": "action=howto"
            }
          ]
        }
      }
    ]
  };

  const options = {
    "method" : "post",
    "headers" : replyHeader, 
    "payload" : JSON.stringify(message)
  };
  UrlFetchApp.fetch(replyUrl, options);
}



// カルーセルテンプレートでReadMeを表示する機能
function sendHowtoTemplate(replyToken) {
  const message = {
    "replyToken" : replyToken,
    "notificationDisabled" : true,
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
                  "label" : readmeMessages[0][1],
                  "data": "action=readme00"
                },{
                  "type" : "postback",
                  "label" : readmeMessages[1][1],
                  "data": "action=readme01"
                },{
                  "type" : "postback",
                  "label" : readmeMessages[2][1],
                  "data": "action=readme02"
                }
              ]
            },{
              "title" : "使い方",
              "text" : "履歴を見たい",
              "actions" : [
                {
                  "type" : "postback",
                  "label" : readmeMessages[3][1],
                  "data": "action=readme10"
                },{
                  "type" : "postback",
                  "label" : readmeMessages[4][1],
                  "data": "action=readme11"
                },{
                  "type" : "postback",
                  "label" : readmeMessages[5][1],
                  "data": "action=readme12"
                }
              ]
            }
          ]
        }
      }
    ]
  };

  const options = {
    "method" : "post",
    "headers" : replyHeader, 
    "payload" : JSON.stringify(message)
  };
  UrlFetchApp.fetch(replyUrl, options);
}