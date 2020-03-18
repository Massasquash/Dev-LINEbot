function doPost(e) {
  //ポストデータがWEBフォームからのものか、LINEからのものか判定
  //パラメータのオブジェクトが空でない（キーの配列の長さが0でない）ならWEBフォームの処理へ
    if(Object.keys(e.parameter).length > 0){
      outputLog("doPost to postCategories", "e.parameter:" ,e.parameter);
      postCategories(e);
      // スプレッドシートのデータ挿入後、元の画面に戻す
      return HtmlService.createTemplateFromFile("form").evaluate();
    }
  
  //LINE botがユーザーからメッセージを受け取った時の処理
  const event = JSON.parse(e.postData.contents).events[0];
  const replyToken = event.replyToken;
  if(typeof replyToken === 'undefined'){
    return;
  }

  try{
    outputLog("post event", "", event);
    if(event.type == "message") {
      getMessage(event, replyToken);
    } else if(event.type == "postback") {
      getPostback(event, replyToken);
    } else if(event.type == "follow"){
      follow(event, replyToken);
    }
  } catch(e) {
    outputLog("error", e.fileName + ":" +　e.lineNumber, e.message);
    reply(replyToken, "なんかおかしいよ。もう一度やってみてね\n");
    return;
  }
}



// メッセージを受け取った時の処理
function getMessage(event, replyToken){
  if(event.message.type != "text"){
    let msg = "／^o^＼";
    reply(replyToken, msg);
    return;
  }

  const messageText = event.message.text;

  const cache = CacheService.getScriptCache();
  const flag = cache.get("flag");
  
  // ユーザーから受け取ったメッセージにより処理を分岐（メニューから選択）
  if(messageText.match("おつかれさま！")){
    // WORK登録処理を進める
    selectDiary(replyToken);
    cache.remove("flag");

  }else if(messageText.match("履歴を見る")){
    selectHistory(replyToken);
    cache.remove("flag");

  }else if(messageText.match("他にできること")){
    selectElse(replyToken);
    cache.remove("flag");

  } else {
    // 適当なメッセージに対する処理
    if(flag == null){
      let msg = "メニューを表示するには左下のボタンをタップしてね ＼(^o^)／";
      reply(replyToken, msg);
      return; 

    } else {
    //WORK登録処理を進める
      switch(flag){
        case "1":
          cache.put("flag", 2)
          cache.put("category", event.message.text);
          let msg1 = "（２）[作業名]を入れてね。\n２行目以降には[作業の詳細]も入れられるよ（無くても問題ないよ）\n（※左下の小さなアイコンをタップしたらキーボードが出るよ！）\n\n↓こんな感じでヨロシク";
          let msg2 = "[作業名]追肥\n[詳細]圃場●●と××\n[詳細]硫安 20kg/10a";
          replyMessages(replyToken, msg1, msg2);
          break;
      
        case "2":
          //タイトル・詳細を取得（ユーザー入力により分岐）
          if(categories.indexOf(messageText) < 0 ){
            if(messageText.match(/(.*?)\n([\s\S]*)/)){
              let [fullText, title, desc] = messageText.match(/(.*?)\n([\s\S]*)/);
              //取得文字数を制限
              title = title.substr(0, 20);
              desc = desc.substr(0, 200);
              cache.putAll({ "title" : title, "desc" : desc});

            } else {
              // (.*)/
              const title = messageText.substr(0, 20);              
              const desc = "";
              cache.putAll({ "title" : title, "desc" : desc});
            }
          }else {
              let msg = "もう一度[作業名][作業詳細]を入力してね";
              reply(replyToken, msg);
              return;
          }
          
          const [title, date, desc] = createDataForCalender(cache);
          const [year, month, day] = [date.getFullYear(), date.getMonth()+1, date.getDate()];
          const displayDate = year + "/" + month + "/" + day;
          let msg = "カレンダーに日報を登録したよ\n◼️日付：${displayDate}\n◼️タイトル：${title}\n◼️詳細：${desc}".replace("${displayDate}", displayDate).replace("${title}", title).replace("${desc}", desc);

          // カレンダー・シートへの登録処理。コーディング時はコメントアウト推奨
          const option = { description: desc };
          const postEvent = calendar.createAllDayEvent(title, date, option);
          const postEventId = postEvent.getId();
          historySheet.appendRow(
            [displayDate, cache.get("category"), cache.get("title"), cache.get("desc"), postEventId.split("@")[0]]
          );
          onCalendarEdit();
          // カレンダー・シートへの登録処理ここまで

          reply(replyToken, msg);
          cache.removeAll(["flag", "date", "category", "title"]);
          break;
      }
    }
  }
}



//ポストバックアクションを受け取った時の処理
function getPostback(event, replyToken){
  const readmeAry = ["action=readme00", "action=readme01", "action=readme02",
                   "action=readme10", "action=readme11", "action=readme12",
                   "action=readme20", "action=readme21", "action=readme22"];

  const cache = CacheService.getScriptCache();
  let date;
  let msg;

  if(event.postback.data == "action=today"){
    date = "0";
    msg = "（1）今日やった作業の[カテゴリ]を選んでね";

  } else if(event.postback.data == "action=settime"){
    date = event.postback.params.date.replace("-", "/").replace("-", "/");
    msg = "（1）${date}にやった作業の[カテゴリ]を選んでね".replace("${date}", date);

  } else if(event.postback.data == "action=cancel"){
    cache.removeAll(["flag", "date", "category", "title"]);
    msg = "操作をキャンセルしたよ";
    reply(replyToken, msg);
    return;

  } else if(event.postback.data == "action=editdiary"){
    msg = "未実装だよ";
    reply(replyToken, msg);
    return; 

  } else if(event.postback.data == "action=deletediary"){
    const lastRow = historySheet.getLastRow();
    const event = historySheet.getRange(lastRow, 1, 1, 4).getValues();
    const [date, title, desc] = [event[0][0], "[" + event[0][1] + "]" + event[0][2], event[0][3]];
    if(date === "日付"){
      msg = "日報がまだないよ。まずは「今日の日報を書く」から日報を登録してみてね！";
      reply(replyToken, msg);
      return;
    }
    msg = "直前に登録した日報はこれだよ。取り消しても大丈夫？\n\n◼️日付：${date}\n◼️タイトル：${title}\n◼️詳細：${desc}".replace("${date}", date).replace("${title}", title).replace("${desc}", desc);
    confirmDeleteDiary(replyToken, msg);
    return;

  } else if(event.postback.data == "action=exe_deletediary"){
    const lastRow = historySheet.getLastRow();
    historySheet.deleteRow(lastRow);
    return;
    
  } else if(event.postback.data == "action=editcalendar"){
    msg = "未実装だよ";
    reply(replyToken, msg);
    return; 

  } else if(event.postback.data == "action=howto"){
    sendHowtoTemplate(replyToken);
    return; 

  } else if(readmeAry.indexOf(event.postback.data) >= 0){
    msg = readmeMessages[readmeAry.indexOf(event.postback.data)][2];
    reply(replyToken, msg);
    return;
  }

  cache.put("flag", 1);
  cache.put("date", date);
  selectCategory(replyToken, msg);
}


//Googleカレンダーに登録する情報を作る処理
function createDataForCalender(cache){
  const [_date, _category, _title, _desc] = [cache.get("date"), cache.get("category"), cache.get("title") , cache.get("desc")];
  let [title, date, desc] = ["", "", _desc];
  title = "[" + _category + "]" + _title;
  if(_date == "0"){
    date = new Date();
  } else {
    date = new Date(_date);
  }
  return [title, date, desc];
}