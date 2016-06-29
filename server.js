var http=require("http");
var url=require("url");
var fs=require("fs");
var path=require("path");
var mime=require("mime");
var querystring=require("querystring");



http.createServer(function (req,res) {
    var urlObj=url.parse(req.url,true);
    var pathname=urlObj.pathname;
    var query=urlObj.query;
    var method=req.method;
    req.setEncoding('utf8');
    pathname=pathname+(pathname.endsWith("/")?"index.html":"");

    if(pathname=="/users"){
        switch (method){
            case 'GET':fs.readFile("./users.json","utf8", function (err,data) {

                if(err){
                    res.statusCode=500;
                    res.end(JSON.stringify({code:'error',data:err}));
                }else{
                    res.writeHead(200,{"Content-Type":"application/json;charset=utf-8"})
                    res.end(JSON.stringify({code:'ok',data:JSON.parse(data)}));
                }

            })
                break;
            case 'POST':
                var result='';
                req.on('data', function (data) {
                    result+=data;
                });
                req.on('end', function () {
                    var user = querystring.parse(result);
                    fs.readFile("./users.json", 'utf8', function (err, data) {
                        var users = JSON.parse(data);//转成JSON对象
                        user.id = users[users.length - 1].id + 1;
                        users.push(user);


                        fs.writeFile("./users.json",JSON.stringify(users),function(err,result){
                            res.writeHead(200, {
                                'Content-Type': 'application/json;charset=utf-8'
                            });
                            res.end(JSON.stringify({
                                code:'ok',
                                data:user
                            }));
                        })


                    })

                });
                break;

        }

    }else{
    var filename="."+pathname;
    fs.exists(filename, function (exists) {
        if (exists) {
            res.setHeader("Content-Type", mime.lookup(filename));
            fs.createReadStream(filename).pipe(res);
        } else {
            res.statusCode = 404;
            res.end("NOT FOUND BABY")
        }

     })
}}).listen(9987);