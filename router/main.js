module.exports = function(app)
{
     app.get('/',function(req,res){
        res.render('FirstPage.html')
     });
     app.get('/about',function(req,res){
        res.render('about.html');
    });

	app.post("/test1", function (req, res) {
  		var body = req.body;

  		console.log('in');
  		console.log(req.body);

  		callback(req.body.email, req.body.pw)
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
        console.log('Connected to the chinook database.');
    })
    // var id=1;
    // var password=2;
    db.run(`INSERT INTO TABLE_USERINFO_DATA(ID, PW) VALUES('${id}', '${password}')`);

    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });

}