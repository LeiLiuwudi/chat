var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'exercise'
})
// 登录
module.exports.login = function(req,res){
    body = ""
    req.on('data',function(chunk){
        body += chunk;
    });
    req.on('end',function(){
        body = JSON.parse(body);
        connection.query("select username,password from user where username='" + body.username + "'",(err, data) => {
            if (err) {
                console.log("error!", err);
            } else {
                if(data.length==0){
                    result = {
                        code:"200",
                        msg:"userNull"
                    }
                    res.json(result)
                }
                else{
                    if(body.password == data[0].password){
                        result= {
                            code:"200",
                            msg:"OK"
                        }
                        res.json(result)
                    }
                    else{
                        result= {
                            code:"200",
                            msg:"passwordError"
                        }
                        res.json(result)
                    }
                }
            }
        });
     });
    
}
// 注册
module.exports.register = function(req,res){
    body = ""
    req.on('data',function(chunk){
        body += chunk;
    });
    req.on('end',function(){
        body = JSON.parse(body);
        connection.query("select username,password from user where username='" + body.username + "'",(err, data) => {
            if (err) {
                console.log("error!", err);
            } else {
                if(data.length==0){
                    connection.query("insert into user(username,password) values(?,?)",[body.username,body.password],function(err1,result){
                        if(err1){
                            console.log("error!", err1);
                        }
                        else{
                            result = {
                                code:"200",
                                msg:"registerSuccess"
                            }
                            res.json(result)
                        }
                    })
                }
                else{
                    result = {
                        code:"200",
                        msg:"userExist"
                    }
                    res.json(result)
                }
            }
        });
     });
    
}
// 修改密码
module.exports.changePassword = function(req,res){
    body = ""
    req.on('data',function(chunk){
        body += chunk;
    });
    req.on('end',function(){
        body = JSON.parse(body);
        connection.query("select username,password from user where username='" + body.username + "'",(err, data) => {
            if (err) {
                console.log("error!", err);
            } else {
                if(data[0].password != body.originalPassword){
                    result = {
                        code:"200",
                        msg:"originalError"
                    }
                    res.json(result)
                }
                else{
                    connection.query("update user set password=? where username=?",[body.newPassword,body.username],function(err1,result){
                        if(err1){
                            console.log("error",err1)
                        }
                        else{
                            result={
                                code:"200",
                                msg:"changeSuccess"
                            }
                            res.json(result)
                        }
                    })
                }
            }
        });
     });
    
}
// 获取好友列表
module.exports.getFriends = function(req,res){
    body = ""
    req.on('data',function(chunk){
        body += chunk;
    });
    req.on('end',function(){
        body = JSON.parse(body);
        connection.query("select friends from user where username='" + body.username + "'",(err, data) => {
            if (err) {
                console.log("error!", err);
            } else {
                connection.query("select username from user where id in ("+data[0].friends+')',function(err1,result){
                    if(err1){
                        console.log("error!",err1)
                    }
                    else{
                        res.json(result)
                    }
                })
                
            }
        });
     });
    
}
// 添加好友
module.exports.addFriend = function(req,res){
    body = ""
    req.on('data',function(chunk){
        body += chunk;
    });
    req.on('end',function(){
        body = JSON.parse(body);
        connection.query("select id from user where username='" + body.newFriend + "'",(err, data) => {
            if (err) {
                console.log("error!", err);
            } else {
                if(data.length == 0){
                    response = {
                        code:"200",
                        msg:"friendNotExist"
                    }
                    res.json(response)
                }
                else{
                    connection.query("select friends from user where username=?",[body.username],function(err1,result){
                        if(err1){
                            console.log("error!",err1)
                        }
                        else{
                            result = data[0].id + "," + result[0].friends 
                            connection.query("update user set friends = ? where username = ?",[result,body.username],function(err2,result1){
                                if(err2){
                                    console.log("error!",err2)
                                }
                                else{
                                    response = {
                                        code:"200",
                                        msg:"addSuccess"
                                    }
                                    res.json(response)
                                }
                            })
                        }
                    })
                }
                
            }
        });
     });
    
}