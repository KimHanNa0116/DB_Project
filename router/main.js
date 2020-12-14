var userid;
var postuserid;
var postuserpw;
module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('FirstPage.html')
    });
    app.get('/FindLocation', function (req, res) {
        res.render('FindLocation.html');
    });
    app.get('/CheckMyNewData', function (req, res) {
        res.render('CheckMyNewData.html');
    });
    app.get('/CheckMyData', function (req, res) {
        res.render('CheckMyData.html');
    });


    app.post("/test1", function (req, res) {
        var body = req.body;

        console.log(req.body);

        callback(req.body.email, req.body.pw)
    });
    app.post("/test2", function (req, res) {
        var body = req.body;

        console.log(req.body);

        callback2(req.body.loc, res);
    });
    app.post("/test3", function (req, res) {
        var body = req.body;

        console.log(req.body);

        callback3(req.body.loc, res);
    });
    app.post("/test4", function (req, res) {
        var body = req.body;

        console.log(req.body);

        callback4(req.body.loc, res);
    });
    app.post("/test5", function (req, res) {
        var body = req.body;

        console.log(req.body);

        callback5(req.body, res)
    });
    app.post("/test6", function (req, res) {
        var body = req.body;

        console.log(req.body);

        callback6(req.body.loc, res);
    });
    app.post("/test7", function (req, res) {
        var body = req.body;

        console.log(req.body);

        callback7(req.body.email, req.body.pw);
    });
    app.post("/test8", function (req, res) {
        var body = req.body;

        console.log(req.body);

        callback8(req.body, res)
    });
    app.post("/test9", function (req, res) {
        var body = req.body;

        console.log(req.body);

        callback9(req.body.loc, res);
    });
}

//신규 유저 이메일, 비밀번호 저장하기 
function callback(id, password) {

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
    userid = id;

    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}

//신규유저를 위한 지역별 관광지 추전해주기
async function callback2(loc, res) {

    var list = new Array();
    console.log(loc);
    console.log("찾아보겠습니다");

    //db열기
    var sqlite3 = await require("sqlite3").verbose();
    let db = await new sqlite3.Database('DATA.db', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the database.');
    })


    await db.serialize(function () {
        db.each("SELECT 관광지명 FROM TABLE_LOCATION_DATA WHERE 소재지지번주소 like '%" + loc + "%' UNION SELECT 관광지명 FROM TABLE_LOCATION_DATA WHERE 소재지도로명주소 like '%" + loc + "%'",
            function (err, row) {
                console.log(row.관광지명);
                var temp = row.관광지명;
                list.push(temp);
            });
    });
    await db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        res.json(list)
    });
}

//관광지 위치를 보기위한, 해당 관광지 지도 업데이트
async function callback3(loc, res) {

    var list = new Array();
    console.log(loc);
    console.log("지도 업데이트");
    if (loc != null) {
        //db열기
        var sqlite3 = await require("sqlite3").verbose();
        let db = await new sqlite3.Database('DATA.db', (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the database.');
        })

        await db.serialize(function () {
            db.each("SELECT * FROM TABLE_LOCATION_DATA WHERE 관광지명 like '%" + loc + "%'",
                function (err, row) {
                    // position = { 'A': row.위도, 'B': row.경도 }
                    var temp = row.위도;
                    var temp2 = row.경도
                    list.push(temp);
                    list.push(temp2);
                });
        });
        await db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
            res.json(list)
        });
    }
    else {
        var temp = 33.450701;
        var temp2 = 126.570667;
        list.push(temp);
        list.push(temp2);
        res.json(list)
    }
}

//선택한 관광지를 리스트에 추가하기
async function callback4(loc, res) {

    var list = new Array();
    console.log(loc);
    if (loc != null) {
        //db열기
        var sqlite3 = await require("sqlite3").verbose();
        let db = await new sqlite3.Database('DATA.db', (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the database.');
        })

        await db.serialize(function () {
            db.run(`INSERT INTO TABLE_JOURNEY_DATA(ID, 관광지명) VALUES('${userid}', '${loc}')`);
        });
        await db.close((err) => {
            if (err) {
                return console.error(err.message);
            }

        });
    }
    else {

    }


}

//신규 유저가 추가한 관광지 확인하기
async function callback5(loc, res) {

    var list = new Array();
    //console.log(loc);
    console.log("찾아보겠습니다");

    list.push(userid);
    //db열기
    var sqlite3 = await require("sqlite3").verbose();
    let db = await new sqlite3.Database('DATA.db', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the database.');
    })
    await db.serialize(function () {
        db.each("SELECT 관광지명 FROM TABLE_JOURNEY_DATA WHERE ID like '%" + userid + "%'",
            function (err, row) {
                console.log(row.관광지명);
                var temp = row.관광지명;
                list.push(temp);
            });
    });
    await db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        res.json(list)
    });
}

//(신규유저)선택한 관광지 지우기
async function callback6(loc, res) {

    var list = new Array();
    console.log(loc);
    console.log("찾아보겠습니다");

    //db열기
    var sqlite3 = await require("sqlite3").verbose();
    let db = await new sqlite3.Database('DATA.db', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the database.');
    })


    await db.serialize(function () {
        db.run("DELETE FROM TABLE_JOURNEY_DATA WHERE ID like '%" + userid + "%' AND 관광지명 like '%" + loc + "%'");

        db.each("SELECT 관광지명 FROM TABLE_JOURNEY_DATA WHERE ID like '%" + userid + "%'",
            function (err, row) {
                console.log(row.관광지명);
                var temp = row.관광지명;
                list.push(temp);
            });
    });

    await db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        res.json(list)
    });
}

//기존 유저의 정보 가져오기
async function callback7(id, password) {

    postuserid = id;
    postuserpw = password;
}
//기존 유저의 관광지 확인하기
async function callback8(loc, res) {

    var list = new Array();
    //console.log(loc);
    console.log("찾아보겠습니다");

    list.push(postuserid);
    //db열기
    var sqlite3 = await require("sqlite3").verbose();
    let db = await new sqlite3.Database('DATA.db', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the database.');
    })
    await db.serialize(function () {
        db.each("SELECT 관광지명 FROM TABLE_JOURNEY_DATA WHERE ID like '%" + postuserid + "%'",
            function (err, row) {
                console.log(row.관광지명);
                var temp = row.관광지명;
                list.push(temp);
            });
    });
    await db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        res.json(list)
    });
}

//(기존 유저)선택한 관광지 지우기
async function callback9(loc, res) {

    var list = new Array();
    console.log(loc);
    console.log("찾아보겠습니다");

    //db열기
    var sqlite3 = await require("sqlite3").verbose();
    let db = await new sqlite3.Database('DATA.db', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the database.');
    })


    await db.serialize(function () {
        db.run("DELETE FROM TABLE_JOURNEY_DATA WHERE ID like '%" + postuserid + "%' AND 관광지명 like '%" + loc + "%'");

        db.each("SELECT 관광지명 FROM TABLE_JOURNEY_DATA WHERE ID like '%" + postuserid + "%'",
            function (err, row) {
                console.log(row.관광지명);
                var temp = row.관광지명;
                list.push(temp);
            });
    });

    await db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        res.json(list)
    });
}