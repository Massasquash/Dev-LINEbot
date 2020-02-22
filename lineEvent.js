//フォローイベント
//今後リッチメニューの実装もこちらに

function follow(event, replyToken){
    var userId = event.source.userId;
    usersSheet.appendRow([userId]);

    var msg = "【農作業日誌BOT】\nラインで作業日誌を記録してGoogleカレンダーに登録するアプリ。ストレスなく作業の記録を残せるはず。出先でも登録＆確認できるよ！\n使ってみた感想を教えてね\n\nまずは↓の画像マニュアルに従って、自分用の「作業カテゴリ」を登録してみよう";
    var imgId = "1LRS0bOoby9BXl89NNYbuayOpVrlMySJn";
    var imgUrl = "https://drive.google.com/uc?id=" + imgId;
    var tmbId = "1tikY01qfm3G4OYUlG3y5-w4LzBo8u6-K";
    var tmbUrl = "https://drive.google.com/uc?id=" + tmbId;
    replyMessages(replyToken, msg, imgUrl, tmbUrl);
  }