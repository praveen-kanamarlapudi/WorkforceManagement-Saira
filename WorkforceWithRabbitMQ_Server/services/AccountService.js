/**
 * New node file
 */
var myDatabase = require('./dbConnectionsController');
var bcrypt = require('./bCrypt');
//var querystring = require('querystring');
//var cstmError = require('./errorController');


/*
 * To Encrypt Password with Salt * 
 * 
 * */
function encryptPassword(pwd)
{
	//var bcrypt = require('bcryptjs');
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(pwd, salt);	
	return hash;
}

function handle_request(msg, callback){	

	var res = {};

	/*************************************************************Login Validation******************************************************************************/	
	if(msg.requestQueue==="login"){

		var email=msg.email,password=msg.password,role=roleId;
		/************** Create Connection******************************************/
		var dbConn = myDatabase.getDatabaseConnection();
		/*************************************************************************/
		if(dbConn === "empty")
		{
			//console.log("no DB connections available");
			myDatabase.waitQueuePool({name:"createClient", data: msg, callback: callback});
		}
		else 
		{
		var query = mysql.getConnection().query("select * from user where email=? ",email, function(err, rows){	 			
			if(err){
				console.log(err);
				res.error=err;	
			}
			else if(rows.length>0){	 
				if(bcrypt.compareSync(password, rows[0].password.toString())&&  rows[0].roleId==role)
				{
			
					userId=rows[0].userId;
										
							res.fullName=fullName;
							res.userid=userId;
							res.roleId=rows[0].roleId;
							res.code="200";
							//res.lastlogin=new Date();						
							myDatabase.restoreDatabaseconnection(dbConn);
							callback(null, res);
							process.nextTick(function(){myDatabase.waitQueuePool(null);});	
						
				}
				else{
					res.error="Invalid Credentials";
					myDatabase.restoreDatabaseconnection(dbConn);
					callback(null, res);
					process.nextTick(function(){myDatabase.waitQueuePool(null);});	
				}
			}
			else{
				res.error="Invalid User";
				myDatabase.restoreDatabaseconnection(dbConn);
				callback(null, res);
				process.nextTick(function(){myDatabase.waitQueuePool(null);});
			}


			});
		}
	}
	/***********************************************************************************************************************************************************/
}

exports.handle_request = handle_request;