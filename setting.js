var properties = PropertiesService.getScriptProperties();
var prop = properties.getProperties();

//マスタデータの読み込み
var masterSpreadsheet = SpreadsheetApp.openById(prop.MASTER_SPREADSHEET_ID);
var masterSheet       = masterSpreadsheet.getSheetByName('master');
var logsSheet         = masterSpreadsheet.getSheetByName('logs');
var usersSheet        = masterSpreadsheet.getSheetByName('users');
var readmeMessages    = masterSheet.getRange('A2:C10').getValues();

//ユーザーデータの読み込み
var calendar          = CalendarApp.getCalendarById(prop.CALENDAR_ID);
var carendarUrl       = prop.CALENDAR_URL;
var spreadsheet       = SpreadsheetApp.getActiveSpreadsheet();
var spreadsheetUrl    = spreadsheet.getUrl();
var historySheet      = spreadsheet.getSheetByName('作業履歴');
var userSheet         = spreadsheet.getSheetByName('ユーザー設定');
var categories        = getCategories('B5:B17');
  
//スプレッドシートにログを表示するための関数
function outputLog(text, label ,description){
  logsSheet.appendRow(
    [new Date(), text, label ,description]
  );
  return;
}





//lineReply
//LINE Messagin apiパラメータ
var replyUrl = "https://api.line.me/v2/bot/message/reply";
var replyHeader = {
  "Content-Type" : "application/json",
  "Authorization" : "Bearer " + prop.CHANNEL_ACCESS_TOKEN
}