# 如何開始

`git clone https://gitlab.com/ncufresh/ncufresh17.git`

`cd ncufresh17`

`npm install`

on macOS
`DEBUG=myapp:* npm start`

on Windows
`set DEBUG=myapp:* & npm start`

# ckeditor編輯器用法

### 在自己的js.ejs寫入

`<script src="/javascript/ckeditor/ckeditor.js"></script>`

`<script type="text/javascript">
    UPLOADCARE_PUBLIC_KEY = "demopublickey";
    CKEDITOR.replace('!這裡指定textarea的name!',{
    extraPlugins: 'uploadcare',
    uploadcare: {
        multiple: true
    }
    });
    //一些相關設定
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

### 如果東西沒有跑出來

plugins沒有載入

前往這裡：
<https://github.com/uploadcare/uploadcare-ckeditor>

將這專案裡的東西放在

public/javascript/ckeditor/plugins/uploadcare/

接著重新載入頁面 看ckeditor有沒有跑出來
