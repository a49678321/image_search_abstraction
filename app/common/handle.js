'use strict';

module.exports = function (app, db){
    app.route('/:urlDbNum')
        .get(function(req,res){
           var url = process.env.APP_URL + req.params.urlDbNum;
           if(url !== process.env.APP_URL + 'favicon.ico'){
               //go and find if the url is exist
               findUrlExist(url,db,res);
           }
        });
    app.route('/direct_to/:url*')
        .get(function(req,res){
            //post_redirect(req,res);
            var correct_url = req.url.slice(11);
            var obj = {};
            if(checkUrl(correct_url)){
                obj = {
                    original_url: correct_url,
                    short_url: process.env.APP_URL + randomNum()
                }
                res.send(JSON.stringify(obj));
                saveInDb(obj,db);
            }else{
                obj = {
                    error: "make sure you have the correct format"
                }
                res.send(JSON.stringify(obj));
            }
        });
    function saveInDb(obj, db){
        var sites = db.collection('pickup');
        sites.save(obj, function(err, data){
           if(err) throw err;
           console.log('we just saved: '+ data);
        });
    }
    
    function checkUrl(url){
        // regular epression from https://gist.github.com/dperini/729294
        var regex =  /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
        return regex.test(url);
    }
        
    //function post_redirect(req,res){
        
    //}
    
    function randomNum(){
        var num =  Math.random()*90000 + 10000;
        return num.toFixed(0).toString();
    }
    
    function findUrlExist(url,db,res){
        var sites = db.collection('pickup');
        sites.findOne({'short_url': url}, function(err, data){
           if(err) throw err;
           if(data){
               console.log('we have the site: '+ data);
               res.redirect(data.original_url);
           }else{
               res.send({'error':'Sorry, We do not have the site in the database.'});
           }
        });
    }
    
}