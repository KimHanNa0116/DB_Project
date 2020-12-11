module.exports = function(app)
{
     app.get('/',function(req,res){
        res.render('FirstPage.html')
     });
     app.get('/FindLocation',function(req,res){
        res.render('FindLocation.html');
    });

	app.post("/test1", function (req, res) {
  		var body = req.body;

  		console.log('in');
  		console.log(req.body);

  		callback(req.body.email, req.body.pw)
    });
    app.post("/test2", function (req, res) {
        var body = req.body;

        console.log('in');
        console.log(req.body);

        callback2(req.body.loc);
  });
}

function callback(id, password){

    console.log(id, password);
    console.log("저장되었습니다.");

    //db열기
    var sqlite3 = require("sqlite3").verbose();
    let db = new sqlite3.Database('DATA.db', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the database.');
    })
    db.run(`INSERT INTO TABLE_USERINFO_DATA(ID, PW) VALUES('${id}', '${password}')`);

    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}

function callback2(loc){

    console.log(loc);
    console.log("찾아보겠습니다");

    //db열기
    var sqlite3 = require("sqlite3").verbose();
    let db = new sqlite3.Database('DATA.db', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the database.');
    })
 
    var list= new Array();
    var i=0;
    db.serialize(function() {
        db.each("SELECT 관광지명 FROM TABLE_LOCATION_DATA WHERE 소재지지번주소 like '%" + loc +"%' UNION SELECT 관광지명 FROM TABLE_LOCATION_DATA WHERE 소재지도로명주소 like '%" + loc +"%'",
        function(err, row){
         console.log(row.관광지명);
        });
    });
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
   
}