* 測試網址： http://ncufresh17.tk/

# 如何開始

`git clone https://gitlab.com/ncufresh/ncufresh17.git`

`cd ncufresh17`

`cp .env.example .env`

`npm install`

on macOS
`DEBUG=myapp:* npm start`

on Windows
`set DEBUG=myapp:* & npm start`


# 推上去說明

### ~~先刪掉專案檔中的node_modules資料夾~~
### 可以用 `git rm -r node_modules/` 一勞永逸

推上去之前記得拉一下 `git pull`

`git add .`

`git commit -m "此次的更動"`

新增並切換至新的branch

`git checkout -b <YourBranchName>`

`git push --set-upstream origin <YourBranchName>`




# ckeditor編輯器用法

### 在自己的js.ejs寫入

`<script src="/javascript/ckeditor/ckeditor.js"></script>`

`<script type="text/javascript">
  CKEDITOR.replace('content',{
    filebrowserUploadUrl: '/uploader',
  });
  CKEDITOR.editorConfig = function (config){
      config.enterMode = CKEDITOR.ENTER_BR;
      config.autoParagraph = false;
  };
</script>
`


### 注意事項

ckeditor會將編輯好的文字存成html

所以要顯示在畫面上

ejs中要用的語法是<%- content%>來去除雙引號

而非<%= content%>

東西會上傳到/public/uploads底下


# 程式碼準則
#### HTML:  
屬性永遠使用雙引號，永遠別用單引號。  
屬性應按照特定順序撰寫，確保程式碼的易讀性。
- class
- id, name
- data-*
- src, for, type, href
- title, alt
- aria-其他, role
- Class 是為了重用的元素而生，應該排第一位。ID 具體得多，應盡量少用（可用場景像是頁內書籤），所以排第二位。  

#### Node.js  
- 程式碼縮排是四個空格長
- Modal 字首大寫、單數
- 資料表字首小寫、複數
- Controller 字首大寫  
- View 的檔案名稱及資料夾名稱應全小寫 