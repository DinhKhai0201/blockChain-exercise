$(function() {
	$('.modal').modal({
			dismissible: false, 
			inDuration: 500, 
			outDuration: 500
			});

	if (typeof web3 !== 'undefined') {
	    web3 = new Web3(web3.currentProvider); 
	} else {
		web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/cf658270146645bca881f8a7d4752099")); 
	}           
	web3.version.getNetwork((err, netId) => {
	switch (netId) {
		case "1":
			$("#network").html('Mainnet!');						  
			break
		case "2":
			$("#network").html('Deprecated Morden test network');						  
			break
		case "3":
			$("#network").html('Ropsten test network');						                            
			break
		case "4":
			$("#network").html('Rinkeby test network');						                            
			break
		case "42":
			$("#network").html('Kovan test network');						  
			break
		default:
			$("#network").html('Unknown network');						  
		}
	});
	var myAccount;
	var filter = web3.eth.filter('latest');
	filter.watch(function(error, result) {
		var block = web3.eth.getBlock(result, true, function(error, result) {                       
				$("#lastblocks-home").prepend('<div class="lastblock chip white-text indigo darken-4"><i class="material-icons">label</i> '+result.number+'</div>');
				$("#lastblocks-admin").prepend('<div class="lastblock chip white-text red darken-4"><i class="material-icons">label</i> '+result.number+'</div>');
				$(".blockprogress").hide();
		if (!error) {
		} else {
				$("#loader").hide();
				console.error(error);
		}		
		});             
	});
	var smartcontractaddress = "0xdd0008b5dc986f95b41f9477072b466b08755ad0";    
	var abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_nameGood",
				"type": "string"
			},
			{
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "addGoods",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_spender",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "burn",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_from",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "burnFrom",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_id",
				"type": "uint256"
			},
			{
				"name": "_ercCoin",
				"type": "uint256"
			}
		],
		"name": "buyerSendOrderErc",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_id",
				"type": "uint256"
			},
			{
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "buyerSendOrderEth",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_idOrder",
				"type": "uint256"
			},
			{
				"name": "_accept",
				"type": "bool"
			}
		],
		"name": "completedOrder",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "increase",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "registerUser",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_idOrder",
				"type": "uint256"
			},
			{
				"name": "_accept",
				"type": "bool"
			}
		],
		"name": "sellerAcceptOrder",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_to",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_from",
				"type": "address"
			},
			{
				"name": "_to",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_id",
				"type": "uint256"
			},
			{
				"name": "_nameGood",
				"type": "string"
			},
			{
				"name": "_price",
				"type": "uint256"
			},
			{
				"name": "_status",
				"type": "bool"
			}
		],
		"name": "updateGoods",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_user",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_check",
				"type": "bool"
			}
		],
		"name": "RegisterUser",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_user",
				"type": "address"
			}
		],
		"name": "AddGoods",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_user",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_idGoods",
				"type": "uint256"
			}
		],
		"name": "UpdateGoods",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_idGoods",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_priceEth",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_priceErc",
				"type": "uint256"
			}
		],
		"name": "BuyerSendOrder",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_seller",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_accept",
				"type": "bool"
			},
			{
				"indexed": false,
				"name": "_idOder",
				"type": "uint256"
			}
		],
		"name": "SellerAcceptOrder",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_accept",
				"type": "bool"
			},
			{
				"indexed": false,
				"name": "_idOder",
				"type": "uint256"
			}
		],
		"name": "CompletedOrder",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_owner",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_spender",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Burn",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "checkRegister",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "detailGood",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "fundsWallet",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "goods",
		"outputs": [
			{
				"name": "id",
				"type": "uint256"
			},
			{
				"name": "owner",
				"type": "address"
			},
			{
				"name": "nameGoods",
				"type": "string"
			},
			{
				"name": "price",
				"type": "uint256"
			},
			{
				"name": "status",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "goodsAdr",
		"outputs": [
			{
				"name": "id",
				"type": "uint256"
			},
			{
				"name": "owner",
				"type": "address"
			},
			{
				"name": "nameGoods",
				"type": "string"
			},
			{
				"name": "price",
				"type": "uint256"
			},
			{
				"name": "status",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "initialSupply",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "orders",
		"outputs": [
			{
				"name": "orderId",
				"type": "uint256"
			},
			{
				"name": "goodId",
				"type": "uint256"
			},
			{
				"name": "buyer",
				"type": "address"
			},
			{
				"name": "seller",
				"type": "address"
			},
			{
				"name": "priceErc",
				"type": "uint256"
			},
			{
				"name": "priceEth",
				"type": "uint256"
			},
			{
				"name": "state",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "ordersAdr",
		"outputs": [
			{
				"name": "orderId",
				"type": "uint256"
			},
			{
				"name": "goodId",
				"type": "uint256"
			},
			{
				"name": "buyer",
				"type": "address"
			},
			{
				"name": "seller",
				"type": "address"
			},
			{
				"name": "priceErc",
				"type": "uint256"
			},
			{
				"name": "priceEth",
				"type": "uint256"
			},
			{
				"name": "state",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "ownerToten",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "sumOfGoods",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "sumOfOrders",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_user",
				"type": "address"
			}
		],
		"name": "sumUserGoods",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_user",
				"type": "address"
			}
		],
		"name": "sumUserOrders",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "users",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];
			
    var contract = web3.eth.contract(abi).at(smartcontractaddress);	     
	web3.eth.getCoinbase(function(error, accounts) {
		myAccount = accounts;
        $(".identification").html(myAccount);	
        contract.balanceOf.call(myAccount, function(err, balance) {
			if (err) {
				console.log(err);
			} else {
				$('#tokenbalance').html(balance.toNumber()+ " KTC");
			}
		})
		//cart
		contract.sumOfOrders.call(function (err, countOrders) { 
			if (err) {
				console.log(err);
			} else {
				for (let i = 0; i < countOrders; i++) {
					contract.orders.call(i, function(error, value) {
				    	if (error) {
				    		console.log(error);
				    	} else {
				    		var temp ="";
				    		if (myAccount == value[2]) {
				    			temp +="<div class = state" + value[6] + ">";
				    			temp +="<p>ID order: <i class = 'orderId"+value[0]+"'>" + value[0] + "</i></p>";
					    		temp +="<p>ID goods: " + value[1] + "</p>";
					    		temp +="<p>Seller: " + value[3] + "</p>";
					    		temp +="<p>priceErc: " + value[4] + "</p>";
					    		temp +="<p>priceEth: " + value[5] + "</p>";
					    		temp +="<a class='waves-effect waves-light btn buyerstate"+value[6]+" buyerAccept"+value[0]+"'>Accept</a>";
					    		temp +="<a class='waves-effect waves-light btn buyerstate"+value[6]+" buyerReject"+value[0]+"'>Reject</a>";
					    		temp +="</div>";
				    		}
				    		if (value[6] == 0) {
				    			$('#Failed').append(temp);
				    		} else if ( value[6] == 1) {
				    			$('#YourOrders').append(temp);
				    		} else if (value[6] == 2) {
				    			$('#SellerAccept').append(temp);
				    		} else if (value[6] == 3) {
				    			$('#Completed').append(temp);
				    		} else {
				    			console.log("Not in here!")
				    		}
				    		$('.buyerAccept'+value[0]).click(function() {
				    			var id = $('.orderId'+value[0]).text();
				    			console.log("complete ",id)
				    			contract.completedOrder(id, true, function(err, value) {
				    				if (err) {
				    					console.log(err);
				    				} else {
				    					console.log("complete ",id)
				    				}
				    			})
				    		});
				    		$('.buyerReject'+value[0]).click(function() {
				    			var id = $('.orderId'+value[0]).text();
				    			console.log("complete ",id)
				    			contract.completedOrder(id, false, function(err, value) {
				    				if (err) {
				    					console.log(err);
				    				} else {
				    					console.log("No complete ",id)
				    				}
				    			})
				    		});
				    	}
				    })
				}
			}
		})
	});    
	//list goods home 
	contract.sumOfGoods.call(function (err, result) { 
		if (err) {
			console.log(err);
		} else {
				if(!err) { 	
					for (let i = 1; i <= result; i++) {
						contract.detailGood.call(i, function (err, value) { 
							if (value[4] == true) { // khi chua duoc ban
								var template = "";
		                        template += "<div class='card'>";
		                        template += 	"<div class='card-body'>";
		                        template += 		"<div class='row'>";
		                        template += 			"<div class='col s3'>";
		                        template +=				"</div>";
		                        template += 			"<div class='col s9 align-text'>";
		                        template += 				"<h5 class='card-title'>Name goods: "+ value[2] +"</h5>";
		                        template += 				"<p class='card-text'>ID: <i class='idGoods"+value[0]+"'>"+ value[0]+"</i> </p>";
		                        template += 				"<p class='card-text'>Seller: <i class='addressSeller'>"+ value[1]+"</i> </p>";
		                        template += 				"<p class='card-text'>priceEth: <i class='price priceEth"+value[0]+"'>"+ value[3]+"</i> Wei \t <b class = 'buy buyEther eth"+value[0]+"'>Buy</b></p>";
		                        template += 				"<p class='card-text'>priceErc: <i class='price priceErc"+value[0]+"'>"+ value[3]+"</i> KTC \t <b class = 'buy buyErc erc"+value[0]+"'>Buy</b></p>";
		                        template += 			"</div>";
		                        template += 		"</div>";
		                        template += 	"</div>";
		                        template += "</div>";
							} 
							$('.array-goods').append(template);

							$('.erc'+value[0]).click(function() {
								console.log("send order erc to " + $('.idGoods'+value[0]).text() + "-"+ $('.priceErc'+value[0]).text());
								var idGoods = $('.idGoods'+value[0]).text();
								var priceErc = $('.priceErc'+value[0]).text()
								contract.buyerSendOrderErc(idGoods, priceErc, function(err, value) {
									if (err) {
										console.log(err);
									} else {
										console.log("send order erc ok: " + idGoods + "-" + priceErc);
									}
								})
							});
							$('.eth'+value[0]).click(function() {
							console.log("send order erc to " + $('.idGoods'+value[0]).text() + "-"+ $('.priceEth'+value[0]).text());
							var idGoods = $('.idGoods'+value[0]).text();
							var priceEth = $('.priceEth'+value[0]).text()
							// contract.buyerSendOrderEth(idGoods, priceEth, function(err, value) {
							// 	if (err) {
							// 		console.log(err);
							// 	} else {
							// 		console.log("send order eth ok: " + idGoods + "-" + priceEth);
							// 	}
							// })

							});
							// console.log(value);
							})		

						
					}
				} else console.error(err);		              
		}			              
	})
	//---------------------------------manage------
	$(".contractaddress").html('<a href="https://ropsten.etherscan.io/address/' + smartcontractaddress + '" target="_blank"><i class="material-icons right">call_made</i>Click here</a>');
	contract.fundsWallet.call(function (error, contractCreator) {
		if (error) {
			console.log(error);
		} else {
			$(".contractcreator").html('<a href="https://ropsten.etherscan.io/address/' + contractCreator + '" target="_blank"><i class="material-icons right">call_made</i>Click here</a>');
		}
	})
	// check register
	contract.checkRegister.call(function (error, result) { 
        if (result == false) {
            $('#noRegister').modal('open');

        } 
    });
	//add goods
    $('#newGoods').click(function() {
    	var newGoodsName = $('#newGoodsName').val();
    	var newPrice = $('#newPrice').val();
    	console.log("goods: " + newGoodsName + "-" + newPrice);
    	contract.addGoods(newGoodsName, newPrice, function(error, value){
    		if (error) {
    			console.log("error");
    		} else {
    			console.log("You just add a goods: " + newGoodsName + "-" + newPrice);
    		}
    	})
    	$('#newGoodsName').val("");
    	$('#newPrice').val("");
    });
    // register
    $('#registerUser').click(function() {
    	console.log("register");
    	contract.registerUser(function(error, value) {
    		if (error) {
    			console.log(error);
    		} else {
    			console.log("RegisterUser doing");
    			console.log(value);
    		}
    	})
    });
    // list seller  goods
    web3.eth.getCoinbase(function(err, account) {
    	contract.sumOfGoods.call(function(err, value) {
    		for (let i = 1;i <= value; i++) {
    			contract.detailGood.call(i, function(error,value) {
    				var temp = "";
    				if (account == value[1]) {
    					temp += "<div class='card statusGoods"+value[4]+"'>";
	                    temp += 	"<div class='card-body'>";
	                    temp += 		"<div class='row'>";
	                    temp += 			"<div class='col s3'>";
	                    temp +=				"</div>";
	                    temp += 			"<div class='col s9 align-text'>";
	                    temp += 				"<h5 class='card-title'>"+ value[2] +"</h5>";
	                    temp += 				"<p class='card-text'>ID: <i class='idGoods"+value[0]+"'>"+ value[0]+"</i> </p>";
	                    temp += 				"<p class='card-text'>priceEth: <i class='price priceEth"+value[0]+"'>"+ value[3]+"</i> Wei </p>";
	                    temp += 				"<p class='card-text'>priceErc: <i class='price priceErc"+value[0]+"'>"+ value[3]+"</i> KTC</p>";
	                    temp += 			"</div>";
	                    temp += 		"</div>";
	                    temp += 	"</div>";
	                    temp += "</div>";
    				}
	    			if (value[4] == true) {	
	                    $('#NewGoods').append(temp); 
	    			} else {
	                    $('#Brought').append(temp); 
	    			}     
    			})
    		}	
    	})
    	//list seller orders
    	contract.sumOfOrders.call(function (err, countOrders) { 
			if (err) {
				console.log(err);
			} else {
				for (let i = 0; i < countOrders; i++) {
					contract.orders.call(i, function(error, value) {
				    	var temp ="";
				    	if (error) {
				    		console.log(error);
				    	} else {
				    		if (myAccount == value[3]) {
				    			temp +="<div class = state" + value[6] + ">";
				    			temp +="<p>ID order: <i class ='orderId"+value[0]+"'>" + value[0] + "</i></p>";
					    		temp +="<p>ID goods: " + value[1] + "</p>";
					    		temp +="<p>buyer: " + value[2] + "</p>";
					    		temp +="<p>priceErc: " + value[4] + "</p>";
					    		temp +="<p>priceEth: " + value[5] + "</p>";
					    		temp +="<a class='waves-effect waves-light btn sellerstate"+value[6]+" sellerAccept"+value[0]+"'>Accept</a>";
					    		temp +="<a class='waves-effect waves-light btn sellerstate"+value[6]+" sellerReject"+value[0]+"'>Reject</a>";
					    		temp +="</div>";
					    		if (value[6] == 1) {
					    			$('#Neworder').append(temp);
					    		}
					    		if (value[6] == 3) {
					    			$('#Done').append(temp);
					    		}
				    		}
				    		$('.sellerAccept'+value[0]).click(function() {
				    			var id = $('.orderId'+ value[0]).text();
				    			console.log("id "+id);
				    			contract.sellerAcceptOrder(id, true, function(err, value) {
				    				if (err) {
				    					console.log(err);
				    				} else {
				    					console.log("seller ok "+ id);
				    				}
				    			})
				    		});
				    		$('.sellerReject'+value[0]).click(function() {
				    			var id = $('.orderId'+ value[0]).text();
				    			console.log("id "+id);
				    			contract.sellerAcceptOrder(id, false, function(err, value) {
				    				if (err) {
				    					console.log(err);
				    				} else {
				    					console.log("seller reject "+ id);
				    				}
				    			})
				    		});
				    	}
				    })
				}
			}
		})

    })

});