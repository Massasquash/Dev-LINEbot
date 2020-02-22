//フォローイベント
//今後リッチメニューの実装もこちらに

function follow(event, replyToken){
    var userId = event.sourse.userId;
    usersSheet.appendRow(userId);

    msg1 = "ラインで作業日誌を記録してGoogleカレンダーに登録する、というアプリ。シンプルに作業の記録を取れるはず。\n使ってみた感想を教えてね\n\nまずは↓の画像マニュアルに従って、自分用の「作業カテゴリ」を登録してみてね";
    imgId = "1LRS0bOoby9BXl89NNYbuayOpVrlMySJn"
    imgUrl = "https://drive.google.com/uc?export=view&id=" + imgID
    replyMessages(replyToken, msg, imgUrl);
  }