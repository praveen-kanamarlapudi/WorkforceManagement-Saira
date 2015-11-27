
/*
 * GET home page.
 */
var ejs       = require("ejs");
var express   = require('express');
var cstmError = require('./errorController');
var reqHandler= require('../rpc/RequestHandler');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.home = function(req, res){
	  res.render('home');
	};


	exports.authValidate = function(req, res) {
		var pwd=req.param("pswd");	
		var email=req.param("email");

		if ((pwd !== undefined && email !== undefined) && (pwd !== "" && email !== "")) 
		{		
			var msg_payload={								
					"email":email,
					"password":pwd,
					requestQueue:"login"
			};				
			reqHandler.makeRequest('_accountQueue',msg_payload, function(err,resData){
				if(err){					
					res.send(resData.error);	
				}
				else{	

					if(resData.error)
					{
						res.render('index',{"error":resData.error});

					}
					else if(resData.code==200){						
						req.session.loginStatus=true;
						req.session.username=resData.fullName;
						req.session.userid=resData.userid;			
						res.redirect('/index');
					}
				}
			});		
		}
		else{
			res.redirect("/");
		}
	};