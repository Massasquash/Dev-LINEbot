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


//ユーザーカテゴリー取得
function getCategories(range){
  const _categories = userSheet.getRange(range).getValues();
  const categories = [];
  for(let i in _categories){
    if(_categories[i][0] == "") {
    break;
    } else {
    categories[i] = _categories[i][0];
    }
  }
  return categories;
}
  
  
//スプレッドシートにログを表示するためのもの
function outputLog(text, label ,description){
  logsSheet.appendRow(
    [new Date(), text, label ,description]
  );
  return;
}