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

// コントラクトのインスタンスを作成
var contract_json = require('../build/contracts/BulkedGIIAM.json');
var addr = contract_json.networks[1].address;
var abi = contract_json.abi;
var test = web3.eth.contract(abi).at(addr);

/*** 使わなくなった外部ライブラリ ***/
// (sha3withsizeはdefaultなどともできる)
// var sha3 = require('solidity-sha3').sha3withsize; 


/*** ディジタル署名の実行 ***/
// string型で作成した場合(Solidity側でもStringで受ける必要がある)
var x1 = new BigNumber('0x271000'); // 2560000ブロックまで有効
var _keyIDSpaceAndRange = '0x1001000000001e00000000ffffffff';
var _validateBlockHeight = "0x" + leftPad(web3.toHex(x1).slice(2).toString(16), 16, 0); // 16*4=64bit
var _middleOfRange = ["0x1fffffff", "0x2fffffff", "0x3fffffff", "0x4fffffff", "0x5fffffff", "0x6fffffff", "0x7fffffff", "0x8fffffff", 
		      "0x9fffffff", "0xafffffff", "0xbfffffff", "0xcfffffff", "0xdfffffff", "0xefffffff", "0xfffffffe"]; // 16個に分割
var _toPlace = ["0x00", "0x01"];
var _to = [web3.eth.accounts[0], web3.eth.accounts[2]];
var _v = new Array(0);
var _r = new Array(0);
var _s = new Array(0);

// ！！！！デバック完了！！！！
// https://github.com/ethereumjs/ethereumjs-abi/issues/27!!!に記述あり！下記のコードはうまく動く
console.log("--- 署名するメッセージのテストを行う ---");
// uint256[]で入ることに注意する！！！
var hash = web3utils.soliditySha3({t: 'uint120', v: _keyIDSpaceAndRange}, {t: 'uint64', v: _validateBlockHeight}, 
				  {t: 'uint256[]', v: _middleOfRange}, {t: 'uint256[]', v: _toPlace}, {t: 'uint256[]', v: _to});
console.log("署名するメッセージ(ローカル): " + hash);
console.log();

console.log("--- String Digital Sign ---");
// 署名一つ目
console.log(web3.eth.accounts[0] + " による署名 ");
var sig1 = web3.eth.sign(web3.eth.accounts[0], web3utils.soliditySha3({t: 'uint120', v: _keyIDSpaceAndRange}, {t: 'uint64', v: _validateBlockHeight}, 
								      {t: 'uint256[]', v: _middleOfRange}, {t: 'uint256[]', v: _toPlace}, {t: 'uint256[]', v: _to}));
console.log("sig1: " + sig1);
// r, s, vを各々定義する
var v1 = Number(sig1.slice(130,132)) + 27; // これだけ数値型
var r1 = sig1.slice(0,66);
var s1 = '0x' + sig1.slice(66,130);

// 署名二つ目
var sig2 = web3.eth.sign(web3.eth.accounts[2], web3utils.soliditySha3({t: 'uint120', v: _keyIDSpaceAndRange}, {t: 'uint64', v: _validateBlockHeight}, 
								      {t: 'uint256[]', v: _middleOfRange}, {t: 'uint256[]', v: _toPlace}, {t: 'uint256[]', v: _to}));
console.log("sig2: " + sig2);
// r, s, vを各々定義する
var v2 = Number(sig2.slice(130,132)) + 27; // これだけ数値型
var r2 = sig2.slice(0,66);
var s2 = '0x' + sig2.slice(66,130);

_v = [v1, v2];
_r = [r1, r2];
_s = [s1, s2];
console.log(_v);
console.log(_r);
console.log(_s);

var decision = test.transferIDSpace64.call(_keyIDSpaceAndRange, _validateBlockHeight, _middleOfRange, _toPlace, _to, _v, _r, _s, {gas: 4700000});
console.log(decision);
var decision = test.transferIDSpace64.sendTransaction(_keyIDSpaceAndRange, _validateBlockHeight, _middleOfRange, _toPlace, _to, _v, _r, _s, {gas: 4700000});
console.log(decision);
