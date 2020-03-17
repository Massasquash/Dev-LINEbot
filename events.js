//初期設定について：
//initiallize()関数を実行してrichmenuを作成する（初期設定時に一度のみ）
//取得したrichmenuIdがRICH_MENU_IDとしてスクリプトプロパティに自動記入されていることを確認
//最後にwebUrlをスクリプトプロパティ「WEB_URL」に記入する（手動）


//webフォームからの入力に関する処理
function doGet(){
  return HtmlService.createTemplateFromFile("form").evaluate();
}

function postCategories(e) {
  const entryForm = ["category1", "category2", "category3", "category4", "category5", "category6", "category7", "category8", "category9", "category10", "category11", "category12" ,"category13"]
  
  for(let i=0; i<13; i++){
    userSheet.getRange(i+5,2).setValue(e.parameter[entryForm[i]]);
  }
  return
}


//LINE フォロー時の処理
function follow(event, replyToken){
    const userId = event.source.userId;
    usersSheet.appendRow([userId]);

    let msg1 = "【農作業記録アシスタント】\n今日の作業をラインで入力！作業日誌を簡単に入力してGoogleカレンダーに登録するアプリ。\n使ってみた感想を教えてね\n\nまずは↓のページを開いて、自分用の「作業カテゴリ」を登録してみよう\n\n登録が終わったら画面一番下の「メニュー」を開いて「日報を入力」をタップしてみよう";
    replyMessages(replyToken, msg1, prop.WEB_URL);
}



// 初期化処理
//カレンダーイベント情報を保持するため
function initialSync(){
  const events = Calendar.Events.list(prop.CALENDAR_ID);
  const nextSyncToken = events.nextSyncToken;
  properties.setProperty("SYNC_TOKEN", nextSyncToken)
}

//カレンダーイベント編集
function onCalendarEdit(){
  let nextSyncToken = properties.getProperty("SYNC_TOKEN");
  const optionalArgs = {
    syncToken: nextSyncToken
  };
  const events = Calendar.Events.list(prop.CALENDAR_ID, optionalArgs);
  const event = events.items[0];

  outputLog("onCalendarEdit", "events.items[0]" , event);

  nextSyncToken = events["nextSyncToken"];
  properties.setProperty("SYNC_TOKEN", nextSyncToken);

  updateSpreadsheet(event);
}



function updateSpreadsheet(event){
  const eventId = event.id;

  let eventRow = getEventRow(eventId);

  outputLog("eventRow", "" , eventRow);

  switch(event.status){
    case "confirmed":
      const inputData = [event.start.date, event.summary, event.description, event.id];
      const [date, category, title, desc, id] = createDataForSpreadheet(inputData);
      //イベント新規作成時
      if(eventRow == 0){
        historySheet.appendRow(
          [date, category, title, desc, id]
        );
        return;
      } else {
        //イベント編集時
        historySheet.getRange(eventRow + 1, 1, 1, 5).setValues([
          [date, category, title, desc, id]
        ]);
        return;
      }
    case "cancelled":
      //イベント削除時
      historySheet.deleteRow(eventRow + 1);
      break;
  }
}


function getEventRow(eventId){
  const lastRow = historySheet.getLastRow();
  const dat = historySheet.getRange(1, 5, lastRow).getValues();
  for(let i=1; i<lastRow; i++){
    if(dat[i][0] === eventId){
      return i;
    }
  }
  return 0;
}


function createDataForSpreadheet(inputData){
  const [_date, _title, _desc, _id] = inputData;
  outputLog("1", "" , " ");
  let [date, category, title, desc, id] = ["", "", "", _desc, _id];
  outputLog("2", "" , " ");
  date = _date.replace("-", "/").replace("-", "/");
  if(_title.match("]")){
    category = _title.split("]")[0].replace("[","");
    title = _title.split("]")[1];
  } else {
    title = _title;
  }
  outputLog("3", "" , " ");
  return [date, category, title, desc, id];
}






//以下、初期設定用
//LINE messaging API リッチメニューに関する操作
function initiallize(){
  outputLog("initiallize", "Start!", "");
  const richMenuId = getRichMenuId();
  postRichMenuImage(richMenuId);
  setDefaultRichMenu(richMenuId);
  properties.setProperty("RICH_MENU_ID", richMenuId);
  outputLog("initiallize", "Finish!");
}


//デフォルトメニューに設定する関数
function setDefaultRichMenu(richMenuId){
  const richMenuUrl = "https://api.line.me/v2/bot/user/all/richmenu/" + richMenuId ;
  const richMenuHeader = {
    "Authorization" : "Bearer " + prop.CHANNEL_ACCESS_TOKEN
  };
  const options = {
    'headers': richMenuHeader,
    'method': 'post',
  };
  UrlFetchApp.fetch(richMenuUrl, options); 
  outputLog("setDefaultRichMenu", "OK", richMenuId);
}





function postRichMenuImage(richMenuId){
  const richMenuUrl = "https://api-data.line.me/v2/bot/richmenu/" + richMenuId + "/content";
  const content = "1QSrUQ3WJqhZvjoOq0rTB1WKEuW2hKjJR";
  const contentType = "image/png";
  const blob = DriveApp.getFileById(content).getBlob();
  const richMenuHeader = {
    "Content-Type" : contentType,
    "Authorization" : "Bearer " + prop.CHANNEL_ACCESS_TOKEN
  };
  const options = {
    'headers': richMenuHeader,  
    'method': 'post',
    'payload': blob
  };
  const response = UrlFetchApp.fetch(richMenuUrl, options);
  outputLog("postRichMenuImage", "OK", response);
}



function getRichMenuId(){
  const richMenuUrl = "https://api.line.me/v2/bot/richmenu";
  const richMenuHeader = {
  "Content-Type" : "application/json",
  "Authorization" : "Bearer " + prop.CHANNEL_ACCESS_TOKEN
  };
  const richMenuObject = {
    "size" : {
      "width" : 1200,
      "height" : 405
    },
    "selected" : true,
    "name" : "workdiaryMenu",
    "chatBarText" : "メニュー",
    "areas" : [
      {
        "bounds" : {
            "x" : 0,
            "y" : 0,
            "width" : 400,
            "height" : 405
        },
        "action":{
            "type" : "message",
            "text" : "おつかれさま！"
        }
      },{
        "bounds" : {
            "x" :400,
            "y" : 0,
            "width" : 400,
            "height" : 405
        },
        "action":{
            "type" : "message",
            "text" : "履歴を見る"
        }
      },{
        "bounds" : {
            "x" : 800,
            "y" : 0,
            "width" : 400,
            "height" : 405
        },
        "action":{
            "type" : "message",
            "text" : "他にできることを教えて"
        }
      }
    ]
  };
  const options = {
    'headers': richMenuHeader,  
    'method': 'post',
    'payload' : JSON.stringify(richMenuObject)
  };
  const response = UrlFetchApp.fetch(richMenuUrl, options);
  const richMenuId = JSON.parse(response).richMenuId;
  outputLog("getRichMenuId", "OK", richMenuId);
  return richMenuId;
}