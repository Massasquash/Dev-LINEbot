

function follow(event, replyToken){
  var msg = "【農作業日誌BOT】\nラインで作業日誌を記録してGoogleカレンダーに登録するアプリ。ストレスなく作業の記録を残せるはず。出先でも登録＆確認できるよ！\n使ってみた感想を教えてね\n\nまずは↓の画像マニュアルに従って、自分用の「作業カテゴリ」を登録してみよう";
  var imgId = "1LRS0bOoby9BXl89NNYbuayOpVrlMySJn";
  var imgUrl = "https://drive.google.com/uc?id=" + imgId;
  var tmbId = "1tikY01qfm3G4OYUlG3y5-w4LzBo8u6-K";
  var tmbUrl = "https://drive.google.com/uc?id=" + tmbId;
  replyMessages(replyToken, msg, imgUrl, tmbUrl);
}


function makeMenuObj(){

  var menuObj = {
    "size":{
        "width":1200,
        "height":405
    },
    "selected": true,
    "name": "WorkdiaryMenu",
    "chatBarText": "農作業日誌",
    "areas": [{
      "bounds": {
          "x": 0,
          "y": 0,
          "width": 400,
          "height": 405
      },
      "action": {
          "type": "text",
          "text": "おつかれさま！"
      }
    },{
      "bounds": {
          "x": 400,
          "y": 0,
          "width": 400,
          "height": 405
      },
      "action": {
        "type": "text",
        "text": "履歴を見る"
      }
    },{
      "bounds": {
          "x": 800,
          "y": 0,
          "width": 400,
          "height": 405
      },
      "action": {
        "type": "text",
        "text": "使い方を知りたい"
      }
    }]
  };
}


function postMenuImage(){

  var menuId = "";
  var menuUrl = "https://api-data.line.me/v2/bot/richmenu/" + menuId;
  var menuHeader = {
    "Content-Type" : "image/png",
    "Authorization" : "Bearer " + prop.CHANNEL_ACCESS_TOKEN
  }

  var content = "1OmZ6evpPaIECG5zqpIDbK9TcjN07wCBJ";
   
  var response = UrlFetchApp.fetch(richMenuUrl, {
    'headers': menuHeader,  
    'method': 'post',
    'payload': DriveApp.getFileById(content).getBlob()
  });
}

function setDefoultMenu(){

  var setMenuUrl = "https://api.line.me/v2/bot/user/all/richmenu" + menuId;
  var menuHeader = {
    "Authorization" : "Bearer " + prop.CHANNEL_ACCESS_TOKEN
  }

   
  var response = UrlFetchApp.fetch(richMenuUrl, {
    'headers': menuHeader,  
    'method': 'post',
    'payload': DriveApp.getFileById(content).getBlob()
  });
}