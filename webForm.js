function doGet(){
  return HtmlService.createTemplateFromFile("form").evaluate();
} 

function postCategories(e) {
  // 「e.parameter.フォーム名(inputタグの名前)」 でフォームから送信されたパラメータをオブジェクトで取得できる
  var entryForm = ["category1", "category2", "category3", "category4", "category5", "category6", "category7", "category8", "category9", "category10", "category11", "category12" ,"category13"]
  
  for(var i=0; i<13; i++){
    userSheet.getRange(i+5,2).setValue(e.parameter[entryForm[i]]);
  }
  return
}