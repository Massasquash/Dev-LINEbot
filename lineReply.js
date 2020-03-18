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


// // ラインにテキストメッセージと画像を送る処理。
// function replyTextPicture(replyToken, msg, imgUrl, tmbUrl){
//   const message = {
//     "replyToken" : replyToken,
//     "notificationDisabled" : true,
//     "messages" : [{
//         "type" : "text",
//         "text" : msg
//       },{
//         "type": "image",
//         "originalContentUrl": imgUrl,
//         "previewImageUrl": tmbUrl
//       }
//     ]
//   };

//   const options = {
//     "method" : "post",
//     "headers" : replyHeader,
//     "payload" : JSON.stringify(message)
//   };

//   UrlFetchApp.fetch(replyUrl, options);
// }



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
          "type" : "carousel",
          "columns" : [
            {
              "title" : "日報を入力する",
              "text" : "今日も一日お疲れさま！\n操作を選んでね",
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
            },{
              "title" : "日報を編集する",
              "text" : "修正する？",
              "actions" :[
                {
                  "type": "postback",
                  "label":"さっきの日報を修正する",
                  "data": "action=editdiary"
                },{
                  "type": "postback",
                  "label":"さっきの日報を取り消す",
                  "data": "action=deletediary"
                },{
                  "type": "postback",
                  "label" : "過去の記録を編集する",
                  "data": "action=editcalendar"
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


// クイックリプライを送信する処理
function quickReply(replyToken, msg){
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
          "text" : "どちらか選んでね！",
          "actions" :[
            {
              "type": "uri",
              "label":"カレンダーで見る",
              "uri": carendarUrl
            },{
              "type": "uri",
              "label": "シートで一覧を見る",
              "uri": spreadsheetUrl
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
              "label":"作業カテゴリを編集する",
              "uri": prop.WEB_URL
            },{
              "type": "postback",
              "label": "使い方を見る",
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