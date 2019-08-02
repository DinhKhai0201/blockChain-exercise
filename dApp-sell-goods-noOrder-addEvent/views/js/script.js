$(function() {
	function tempNewGoods(val0, val2, val3, val4, val5) {
		let temp = '';
		temp += `<div class='card edit-goods-card statusGoods${val5} edit-goods${val0}'>
   					<div class='card-body'>
   						<div class='row'>
   							<div class='col s3'>
		                    </div>
		                    <div class='col s9 align-text'>
			                    <p class='card-title chip blue-grey lighten-4'>${val2}</p><br>
			                    <p class='card-text chip  orange lighten-4'>ID: <i class='idGoods${val0}'>${val0}</i> </p><br>
			                    <p class='card-text chip pink lighten-5'>priceEth: <i class='price priceEth${val0}'>${val3}</i> Wei </p><br>
			                    <p class='card-text chip blue lighten-5'>priceErc: <i class='price priceErc${val0}'>${val4}</i> KTC</p>
  							</div>
   						</div>
  					</div>
   					<div class ='edit-goods-icon edit-goods-icon${val0}' data=${val0}><i class='material-icons'>border_color</i></div>
   				</div>`;
   		return temp;
	}
	function tempCart(val0, val1, val2, val3, val4, val5, val6) {
		let temp = '';
		temp += `<div class='card state${val5} acceptGoods${val0}'>
	    			<div class='card-body'>
	    				<div class='row'>
	    					<div class='col s3'>
	    					</div>
	        					<div class='col s9 align-text'>
			                    	<p class = 'card-text chip'>ID goods: <i class = 'orderId${val0}'>${val0}</i></p><br>
			                        <p class = 'card-text chip'>Seller: ${val1} </p><br>
			                        <p class = 'card-text chip'>Name: ${val2} </p><br>`;
	    if (val6 == true) {
	        temp += 				"<p class = 'card-text chip red lighten-4'>priceErc: " + val3 + "</p><br>";
	    } else {
	        temp += 				"<p class = 'card-text chip red lighten-4'>priceEth: " + val4 + "</p><br>";
	    }
	    temp += 					`<a class='waves-effect waves-light btn buyerstate${val5} buyerAccept${val0}'>Accept</a>
	    							<a class='waves-effect waves-light btn buyerstate${val5} buyerReject${val0}'>Reject</a>
	    					</div>
	    				</div>
	       		 </div>
	        </div>`;
	    return temp;
	}
    $('.funcwallet').hide();
    //toast js
    const transitionLength = 700;

    let toastContain = document.createElement('div');
    toastContain.classList.add('toastContain');
    document.body.appendChild(toastContain);

    function toast(str1, str2, time, addClass = 'default') {
        if (!time || time === 'default') {
            time = 2000;
        }
        let toastEl = document.createElement('div');
        toastEl.classList.add('toast', addClass);
        toastEl.innerText = str1 + str2;
        toastContain.prepend(toastEl);
        setTimeout(() => toastEl.classList.add('open'));
        setTimeout(
            () => toastEl.classList.remove('open'),
            time
        );
        setTimeout(
            () => toastContain.removeChild(toastEl),
            time + transitionLength
        );
    }

    // define modal
    $('.modal').modal({
        dismissible: false,
        inDuration: 500,
        outDuration: 500
    });
    //enabel web
    // configure web3
    var metamask = false;
    window.addEventListener('load', async () => {
	if (typeof web3 !== 'undefined') {
		await window.ethereum.enable();
		web3 = new Web3(web3.currentProvider);
	    } else {
		web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/cf658270146645bca881f8a7d4752099"));
	    }
    })
    
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

    var myAccount = web3.eth.accounts[0];
    var filter = web3.eth.filter('latest');

    //display block
    filter.watch(function(error, result) {
        var block = web3.eth.getBlock(result, true, function(error, result) {
            $("#lastblocks-home").prepend('<div class="lastblock chip white-text indigo darken-4"><i class="material-icons">label</i> ' + result.number + '</div>');
            $("#lastblocks-admin").prepend('<div class="lastblock chip white-text red darken-4"><i class="material-icons">label</i> ' + result.number + '</div>');
            $(".blockprogress").hide();
            if (!error) {} else {
                $("#loader").hide();
                console.error(error);
            }
        });
    });

    //connect smart contract
    var smartcontractaddress = "0x3a683f5553e6984d55973bc3521aa7e167d1186e";
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
				"name": "_idGoods",
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
		"inputs": [
			{
				"name": "_amount",
				"type": "uint256"
			}
		],
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
				"name": "_idGoods",
				"type": "uint256"
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
				"name": "_state",
				"type": "uint8"
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
				"indexed": true,
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
				"indexed": true,
				"name": "_user",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_idGoods",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_nameGood",
				"type": "string"
			}
		],
		"name": "AddGoods",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_user",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_idGoods",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_nameGood",
				"type": "string"
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
			},
			{
				"indexed": false,
				"name": "state",
				"type": "uint8"
			}
		],
		"name": "UpdateGoods",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_buyer",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_seller",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_idGoods",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_nameGood",
				"type": "string"
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
			},
			{
				"indexed": false,
				"name": "state",
				"type": "uint8"
			}
		],
		"name": "BuyerSendOrder",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_seller",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_idGoods",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_nameGood",
				"type": "string"
			}
		],
		"name": "SellerAcceptOrder",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_buyer",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_seller",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_accept",
				"type": "bool"
			},
			{
				"indexed": true,
				"name": "_idGoods",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_nameGood",
				"type": "string"
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
			},
			{
				"indexed": false,
				"name": "state",
				"type": "uint8"
			},
			{
				"indexed": false,
				"name": "_paytype",
				"type": "bool"
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
				"indexed": false,
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "Increase",
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
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint8"
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
			},
			{
				"name": "paytype",
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
    //---------------------index.html------------------------
    var dataGoods = new Array();
    // display balance erc
    var contract = web3.eth.contract(abi).at(smartcontractaddress);
    contract.balanceOf.call(myAccount, function(err, balance) {
            if (err) {
                console.log(err);
            } else {
                $('#tokenbalance').html(balance.toNumber() + " KTC");
            }
        })
        //display identify   
    $(".identification").html(myAccount);
    //list goods home 
    contract.sumOfGoods.call(function(err, result) {
            if (err) {
                console.log(err);
            } else {
                for (let i = 1; i <= result; i++) {
                    contract.detailGood.call(i, function(err, value) {
                        if (value[5] == 0) { // khi chua duoc ban
                            var template = "";
                            template += `<div class='card list-goods-home${value[0]}'>
                                			<div class='card-body'>
	                                			<div class='row'>
		                                			<div class='col s3'>
		                                			</div>
		                                			<div class='col s9 align-text'>
			                                			<h5 class='card-title'>Name goods: ${value[2]}</h5>
			                                			<p class='card-text'>ID: <i class='idGoods${value[0]}'>${value[0]}</i> </p>
			                                			<p class='card-text'>Seller: <i class='addressSeller'>${value[1]}</i> </p>
			                                			<p class='card-text'>priceEth: <i class='price priceEth${value[0]}'>${value[4]}</i> Wei \t <b class = 'buy buyEther eth{value[0]}'>Buy</b></p>
			                                			<p class='card-text'>priceErc: <i class='price priceErc${value[0]}'>${value[3]}</i> KTC \t <b class = 'buy buyErc erc${value[0]}'>Buy</b></p>
		                                			</div>
	                                			</div>
                                			</div>
                            			</div>`;
                        }
                        $('.array-goods').append(template);
                        $('.erc' + value[0]).click(function() {
                            console.log("send order erc to " + $('.idGoods' + value[0]).text() + "-" + $('.priceErc' + value[0]).text());
                            var idGoods = $('.idGoods' + value[0]).text();
                            var priceErc = $('.priceErc' + value[0]).text()
                            contract.buyerSendOrderErc(idGoods, priceErc, function(err, data) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("send order erc ok: " + idGoods + "-" + priceErc);
                                }
                            })
                        });
                        $('.eth' + value[0]).click(function() {
                            console.log("send order eth to " + $('.idGoods' + value[0]).text() + "-" + $('.priceEth' + value[0]).text());
                            var idGoods = $('.idGoods' + value[0]).text();
                            var priceEth = $('.priceEth' + value[0]).text()
                                contract.buyerSendOrderEth({from: myAccount, value: priceEth},idGoods, priceEth, function(err, value) {
                                	if (err) {
                                		console.log(err);
                                	} else {
                                		console.log("send order eth ok: " + idGoods + "-" + priceEth);
                                	}
                                })
                        });
                        // console.log(value);
                    })
                }
            }
        })
        //-----cart.html------
    var event = contract.BuyerSendOrder({ _buyer: myAccount }, { fromBlock: 0, toBlock: 'latest' }).get(function(err, result) {
        if (err) {
            console.log(err);
        } else {
            var result = Object.values(result.reduce((acc, cur) => Object.assign(acc, {
                [cur.args._idGoods]: cur
            }), {}));
            for (let i = 0; i < result.length; i++) {
                var id = result[i].args._idGoods;
                contract.detailGood.call(id, function(err, value) {
                    if (err) {
                        console.log(err);
                    } else {
                        var cart = tempCart(value[0], value[1], value[2], value[3], value[4], value[5], value[6]);
                        if (value[5] == 0) {
                            $('#Failed').append(cart);
                        } else if (value[5] == 2) {
                            $('#YourOrders').append(cart);
                        } else if (value[5] == 3) {
                            $('#SellerAccept').append(cart);
                        } else if (value[5] == 4) {
                            $('#Completed').append(cart);
                        } else {}
                        $('.buyerAccept' + value[0]).click(function() {
                            var IDGoods = $('.orderId' + value[0]).text();
                            console.log("complete ", IDGoods);
                            contract.completedOrder(IDGoods, true, function(err, data) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("complete ", IDGoods)
                                }
                            })
                        });
                        $('.buyerReject' + value[0]).click(function() {
                            var IDGoods = $('.orderId' + value[0]).text();
                            console.log("NO complete ", IDGoods)
                            contract.completedOrder(IDGoods, false, function(err, data) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("No complete ", IDGoods)
                                }
                            })
                        });
                    }
                })
            }
        }
    });
    //---------------------------------manage.html------
    $(".contractaddress").html('<a href="https://ropsten.etherscan.io/address/' + smartcontractaddress + '" target="_blank">Click here</a>');
    contract.fundsWallet.call(function(error, contractCreator) {
            if (error) {
                console.log(error);
            } else {
                $(".contractcreator").html('<a href="https://ropsten.etherscan.io/address/' + contractCreator + '" target="_blank">Click here</a>');
            }
        })
        // check register
    contract.checkRegister.call(function(error, result) {
        if (result == false) {
            $('#noRegister').modal('open');

        }
    });
    //add goods
    $('#newGoods').click(function() {
        var newGoodsName = $('#newGoodsName').val();
        var newPrice = $('#newPrice').val();
        contract.addGoods(newGoodsName, newPrice, function(error, value) {
            if (error) {
                console.log("error");
            } else {
                console.log("You just add a goods: " + newGoodsName + "-" + newPrice);
            }
        })

    });
    //transfer erc
    $('#transfer-erc').click(function() {
        var address = $('#address-to').val();
        var amount = $('#amount-erc').val();
        console.log(amount);
        console.log("transfer: " + amount + "-" + address);
        contract.transfer(address, amount, function(error, value) {
            if (error) {
                console.log("error");
            } else {
                console.log("You just transfer: " + amount + " to " + address);
            }
        })
    });

    //get fundswallet
    contract.fundsWallet.call(function(err, fundsWallet) {
        if (err) {
            console.log(err);
        } else {
            if (fundsWallet == myAccount) {
                $('.funcwallet').show();
            }
        }
    })
    // increase token erc
    $('#increase-erc').click(function() {
    	var amountKtc = $('#amountKTC').val();
        contract.increase(amountKtc, function(error, value) {
            if (error) {
                console.log("error");
            } else {
            	console.log(amountKTC);
                console.log("You just increase "+amountKTC+" KTC");
            }
        })
    });
    // register
    $('#registerUser').click(function() {
        console.log("register");
        contract.registerUser(function(error, value) {
            if (error) {
                console.log(error);
            } else {
                console.log("RegisterUser doing");
            }
        })
    });
    strMyAccount = JSON.stringify(myAccount);
    dataGoods[strMyAccount] = new Array(); //0 is new goods user added
    // list seller  goods
    contract.sumOfGoods.call(function(err, count) {
            for (let i = 1; i <= count; i++) {
                contract.detailGood.call(i, function(error, value) {
                    if (myAccount == value[1]) {
                    	dataGoods[strMyAccount].push(value);
                   		var listTempGoods =tempNewGoods(value[0], value[2], value[3], value[4], value[5]);
                    }
                    if (value[5] == 0) {
                        $('#NewGoods').append(listTempGoods);
                        $('.badgeNewGoods').text(dataGoods[strMyAccount].length);
                    } else if (value[5] == 2 || value[5] == 3) {
                        $('#Brought').append(listTempGoods);
                    } else {

                    }
                })
            }
        })

    //update goods
    $('#NewGoods').on('click', '.edit-goods-icon', function() {
        let id = $(this).attr('data');
        dataGoods[strMyAccount].map(item => {
            if (item[0].c[0] == id) {
                let html = `	
				<div class="row">
					<div class="col s3">
					</div>
					<div class="col s9 align-text">
						<input type="hidden" class = "updateId${item[0].c[0]}" value="${item[0].c[0]}"/>
						<br>
						<input type= "text" class = "materialize-textarea nameG${item[0].c[0]}" value="${item[2]}"></input>
						<input class = "priceG${item[0].c[0]}" value="${item[3]}"/>
						<br>
						<input type = "hidden" class = "stateG${item[0].c[0]}" value="${item[5]}"/>
						<a class='waves-effect waves-light btn update${item[0].c[0]}'>Update</a>
						<a class='waves-effect waves-light btn CancelUpdate${item[0].c[0]}'>Cancel</a>
					</div>
				</div>`;
                $('.edit-goods' + id + ' .card-body').html(html);
                $('div.edit-goods-card .edit-goods-icon'+id).hide();
                //when clock button update
                $('.update'+id).click(function(){
                	let name = $('.nameG'+id).val();
                	let price = $('.priceG'+id).val();
                	let state = $('.stateG'+id).val();
                	console.log("update", id);
                	contract.updateGoods(id,name,price,state, function(err, result) {
                		if (err) {
                			console.log(err);
                		} else {
                			console.log("updateGoods success");
                		}
                	})	
                });
                //when click button cancel
                $('.CancelUpdate' + id).click(function() {
                	$('.edit-goods' + id).html(tempNewGoods(id, item[2], item[3], item[4], item[5]));
                });
                 //event update goods
			    contract.UpdateGoods({ _user: myAccount }, { fromBlock: 'latest', toBlock: 'pending' }).watch(function(err, result) {
			        if (err) {
			            console.log(err);
			        } else {
			            console.log(result);
			            $('.edit-goods' + id + ' .card-body').html(tempNewGoods(id, result.args._nameGood, result.args._priceErc, result.args._priceEth,result.args.state));
			        }
			    });
            }
        })
    })
    //list order manage
    contract.BuyerSendOrder({ _seller: myAccount }, { fromBlock: 0, toBlock: 'latest' }).get(function(err, result) {
        if (err) {
            console.log(err);
        } else {
            var result = Object.values(result.reduce((acc, cur) => Object.assign(acc, {
                [cur.args._idGoods]: cur
            }), {}));
            for (let i = 0; i < result.length; i++) {
                var id = result[i].args._idGoods;
                var buyer = result[i].args._buyer;
                contract.detailGood.call(id, function(err, value) {
                    if (err) {
                        console.log(err);
                    } else {
                        var temp = "";
                        temp += `<div class='card state${value[5]} divIdGoods${value[0]}'>
                        			<div class='card-body'>
                        				<div class='row'>
                        					<div class='col s3'>
                        					</div>
                        					<div class='col s9 align-text'>
                        						<p class ='card-text chip purple lighten-5'>ID goods: <i class = 'orderId${value[0]}'>${value[0]}</i></p><br>
                        						<p class ='card-text chip purple lighten-5'>Name: ${value[2]}</p><br>`;
                        temp += 				"<p class ='card-text chip purple lighten-5'>buyer: " + buyer + "</p><br>";
                        if (value[6] == true) {
                            temp += 			"<p class ='card-text chip purple lighten-5'>priceErc: " + value[3] + "</p><br>";
                        } else {
                            temp += 			"<p class ='card-text chip purple lighten-5'>priceEth: " + value[4] + "</p><br>";
                        }
                        temp += 				`<a class='waves-effect waves-light btn sellerstate${value[5]} sellerAccept${value[0]}'>Accept</a>
                        					</div>
                        				</div>
                        			</div>
                        		</div>`;
                        if (value[5] == 2 || value[5] == 3) {
                            $('#Neworder').append(temp);
                        }
                        if (value[6] == 4) {
                            $('#Done').append(temp);
                        }
                        $('.sellerAccept' + value[0]).click(function() {
                            var IDGoods = $('.orderId' + value[0]).text();
                            console.log("id " + IDGoods);
                            contract.sellerAcceptOrder(IDGoods, function(err, res) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("seller ok " + IDGoods);

                                }
                            })
                        }); 
                    }
                })
            }
        }
    });
    // ----event for UI---
    //event register
    contract.RegisterUser({ _user: myAccount }, { fromBlock: 0, toBlock: 'latest' }).watch(function(err, result) {
        if (err) {
            console.log(err);
        } else {
            $('#noRegister').modal('close');
        }
    }); 
    //event transfer erc
    contract.Transfer({ from: myAccount }, { fromBlock: 'latest', toBlock: 'pending' }).watch(function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            let amount = result.args.value;
            let to = result.args.to;
            toast("You just transfer ", amount.toString() + " to " + to, 5000);
            $('#address-to').val("");
        }
    });
    //event increase erc token  
    contract.Increase({ from: myAccount }, { fromBlock: 'latest', toBlock: 'pending' }).watch(function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            let amount = result.args._amount;
            toast("You just increase amount: ",amount.toString(), 5000);
        }
    });
    //event add a goods
    contract.AddGoods({ _user: myAccount }, { fromBlock: 'latest', toBlock: 'pending' }).watch(function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            // var result = Object.values(result.reduce((acc,cur)=>Object.assign(acc,{[cur.args._idGoods]:cur}),{}));
            let id = result.args._idGoods;
            let nameGoods = result.args._nameGood;
            toast("You just addGoods has id " + id.toString(), " name " + nameGoods, 5000);
            $('#newGoodsName').val("");
            $('#newPrice').val("");
        }
    });
    //event buyer send order
    contract.BuyerSendOrder().watch(function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            let id = result.args._idGoods;
            let seller = result.args._seller;
            toast("You just buy goods from " + seller, " has id goods is " + id.toString(), 5000);
            $('.list-goods-home' + id).fadeOut(300);
        }
    });
    //event seller accept order
    contract.SellerAcceptOrder({ _seller: myAccount }, { fromBlock: 'latest', toBlock: 'pending' }).watch(function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            let id = result.args._idGoods;
            toast("You just accept goods from id ", id.toString(), 5000);
            $('.divIdGoods' + id).removeClass("state2").addClass("state3");
            $('.divIdGoods' + id + ' a').removeClass("sellerstate2").addClass("sellerstate3");
        }
    });
    //event complete order when buyer accept receive
    contract.CompletedOrder({ _buyer: myAccount }, { fromBlock: 'latest', toBlock: 'pending' }).watch(function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            let id = result.args._idGoods;
            let seller = result.args._seller;
            let accept = result.args._accept;
            let nameGoods = result.args._nameGood;
            let priceErc = result.args._priceErc;
            let priceEth = result.args._priceEth;
            let state = result.args.state;
            let paytype = result.args._paytype;
            if (accept == true) {
                toast("Accept complete at ", id.toString(), 5000);
                $('#Completed').append(tempCart(id, seller, nameGoods, priceErc, priceEth, state, paytype)); 
            } else {
                toast("Accept false at ", id.toString(), 5000);
                $('#Failed').append(tempCart(id, seller, nameGoods, priceErc, priceEth, state, paytype));
            }
            $('.acceptGoods' + id).fadeOut(300);
        } 
    });
    //--------------info erc token ------------------------
    contract.totalSupply.call(function(err, res) {
    	if(err) {
    		console.log(err);
    	} else {
    		// console.log(res);
    		$('.total').html(res);
    	}
    })
    contract.fundsWallet.call(function(err, res) {
    	if(err) {
    		console.log(err)
    	} else {
    		// console.log(res);
    		$('.fundswallet').html(res);
    	}
    })
    contract.name.call(function(err, res) {
    	if(err) {
    		console.log(err);
    	} else {
    		// console.log(res);
    		$('.name').html(res);
    	}
    })
    contract.symbol.call(function(err, res) {
    	if(err) {
    		console.log(err);
    	} else {
    		// console.log(res);
    		$('.symbol').html(res);
    	}
    })
    contract.decimals.call(function(err, res) {
    	if(err) {
    		console.log(err);
    	} else {
    		// console.log(res);
    		$('.decimals').html(res);
    	}
    })
    console.log(dataGoods);
});
