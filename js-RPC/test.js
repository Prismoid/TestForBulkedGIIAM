/*** 外部ライブラリの読み込み ***/
// 関数呼び出し用
var BigNumber = require('bignumber.js'); // npm install bignumber, https://www.npmjs.com/package/bignumber.js
var leftPad = require('left-pad'); // npm install left-pad, https://www.npmjs.com/package/left-padのサイトとかにある
var web3utils = require('web3-utils'); // npm install web3-utils, https://www.npmjs.com/package/web3-utilsなど
// Web3のインスタンスの作成
var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
web3.eth.defaultAccount = web3.eth.accounts[1];
// AVLTreeのクラス定義
var AVLTree = require("avl"); // install, https://www.npmjs.com/package/avl

// コントラクトのインスタンスを作成
var contract_json = require('../build/contracts/Test.json');
var addr = contract_json.networks[1].address;
var abi = contract_json.abi;
var test = web3.eth.contract(abi).at(addr);


var keyTgt = new BigNumber("0x1001000000001e33333333", 16); // 56bit(TLDc + SLDc) + 32bit(target)
// var div = new BigNumber("0x10000000", 16);
// var tmp = key.divToInt(div);
// console.log(key);
// console.log(tmp);

var t = new AVLTree();

var keyInput = new BigNumber("0x1001000000001e00000000ffffffff", 16);
var strInput = "Hello";
var n = t.insert(keyInput, strInput);

var n4 = t.find64(keyTgt);
console.log("ROOT");
console.log(n4);
console.log("TEST");

// console.log(t.keys());


var event = test.Set();
test.Set({}, { fromBlock: 0, toBlock: 'latest' }).get((error, results) => {
    console.log(results[0]);
    console.log(results[1]);
});
//イベント監視
event.watch(function (error, result) {
 console.log('watching "Set" event!');
  if (!error)
    console.log(result);
});

/*
getEvent.get((error, results) => {
    console.log(JSON.stringify(results));
});
*/
