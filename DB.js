// json 파일을 읽어서 db에 넣기
// 1. json파일을 읽어서 변수
// 2. 만든 변수를 db에 넣는 작업
// 2-1 db파일 생성
// 2-2 Table을 먼저 json파일을 읽어온 field로 채운다.
// 2-3 insert문을 실행
// 2-4 select문으로 확인 
var express = require('express');
var app = express();

var bodyParser = require('body-parser'); 
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.json());
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
var router = require('./router/main')(app);
var server = app.listen(8080, function(){
    console.log("Express server has started on port 8080")
})

// json local에서는 읽어지는데
// index.html로 웹뷰로 실행시키면 안읽어지게 하기
var TABLE_DATA_NAME = "TABLE_LOCATION_DATA";
var DATA_1 = "관광지명"; //..

var fs = require('fs');
// 파일이 존재하는지 확인
// 있으면 넘어가고 없으면 새로 생성
var file = "DATA.db";
var exists = fs.existsSync(file);
if (!exists) {
  console.log("Creating DB file.");
  fs.openSync(file, "w");
}
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);
// 파일 최초 생성시 table도 생성
// 예제 : db.run('CREATE TABLE student(id integer primary key, name text not null, email text unique)');

//db.run 명령어 쓰려면
db.serialize(function () {
  if (!exists) {
    //사용할 table만 넣기
    db.run('CREATE TABLE TABLE_LOCATION_DATA(관광지명 text NOT NULL PRIMARY KEY, 소재지도로명주소 text, 소재지지번주소 text,위도 text,경도 text,면적 text,공공편익시설정보 text,숙박시설정보 text,운동및오락시설정보 text,휴양및문화시설정보 text, 지정일자 text,수용인원수 text,주차가능수 text,관광지소개 text,관리기관전화번호 text,관리기관명 text,데이터기준일자 text)')
    db.run('CREATE TABLE TABLE_USERINFO_DATA(ID text NOT NULL PRIMARY KEY, PW text, 관광지 text, FOREIGN KEY(관광지) REFERENCES TABLE_LOCATION_DATA(관광지명))');
    var jsonData = require('./HNdata.json');
    var records = jsonData.records;
    var result = "";
    records.forEach(element => {
      result = result.concat('"', element['관광지명'], '"', ',', '"', element['소재지도로명주소'], '"', ',', '"', element['소재지지번주소'], '"', ',', '"', element['위도'], '"', ',', '"', element['경도'], '"', ',', '"', element['면적'], '"', ',', '"', element['공공편익시설정보'], '"', ',', '"', element['숙박시설정보'], '"', ',', '"', element['운동및오락시설정보'], '"', ',', '"', element['휴양및문화시설정보'], '"', ',', '"', element['지정일자'], '"', ',', '"', element['수용인원수'], '"', ',', '"', element['주자가능수'], '"', ',', '"', element['관광지소개'], '"', ',', '"', element['관리기관전화번호'], '"', ',', '"', element['관리기관명'], '"', ',', '"', element['데이터기준일자'], '"');
      db.run('INSERT OR IGNORE INTO TABLE_LOCATION_DATA (' + "관광지명" + ',' + "소재지도로명주소" + ',' + "소재지지번주소" + ',' + "위도" + ',' + "경도" + ',' + "면적" + ',' + "공공편익시설정보" + ',' + "숙박시설정보" + ',' + "운동및오락시설정보" + ',' + "휴양및문화시설정보" + ',' + "지정일자" + ',' + "수용인원수" + ',' + "주차가능수" + ',' + "관광지소개" + ',' + "관리기관전화번호" + ',' + "관리기관명" + ',' + "데이터기준일자" + ') VALUES (' + result + ')')
      result = "";
    });
  }
})

db.close();