pragma solidity ^0.4.15;
contract Test {
  // ブロックチェーンの基本データを代入
  uint public blockNumber;
  bytes32 public blockHashNow;
  bytes32 public blockHashPrevious;
  // ディフィカルティの計算
  uint32 public diff;
  uint256 public coefficient;
  uint256 public exponent;
  uint256 public target;
  uint256 public hash;

  function Test() {
    blockNumber = block.number;
    blockHashNow = block.blockhash(blockNumber);
    blockHashPrevious = block.blockhash(blockNumber - 1);
    diff = 0x20ffffff;
  }

  // blockHashを獲得する関数
  function getBlockHash(uint32 _prevNum) public returns(bytes32){
    return block.blockhash(blockNumber - _prevNum);
  }

  // Sha3を実行する
  // uintを用いて連鎖させたsha3を行うこと！！
  function Sha3(uint8[] test) public returns(bytes32){
    if (test.length == 1) {
      return sha3(test[0]);
    } else if (test.length == 2) {
      return sha3(test[0], test[1]);
    } else if (test.length == 3) {
      return sha3(test[0], test[1], test[2]);
    } else { 
      return sha3(1); // test.length > 3 の場合, sha3の引数は3つまでなのでエラー
    }      
    // return sha3(test1, test2); // augument2: string test1, string test2, app.Sha3.call('0x706173', '73776f726465'), this works
    // return sha3(test); // augument: string test(= '0x70617373776f726465'), this works
    // return sha3("0x70617373776f726465"); // this works
  }
  // Sha3_2パターン目のテスト
  function Sha3_2(uint72 IDSpace, uint128 blockHeight) public returns(bytes32){
    return sha3(IDSpace, blockHeight);
  }
  // Sha3_3パターン目のテスト
  function Sha3_3(uint a) public returns(bytes32){
    return sha3(a);
  }
  // Sha3_4
  function Sha3_4(address[] test) public returns(bytes32){
    return sha3(test);
  }
  
  function Sha3_51(bytes20 a, bool b) public returns(bytes32){
    if (b == true) {
      return sha3(uint160(a));
    } else {
      return sha3(a);
    }
  }
  function Sha3_51(uint160 a, bool b) public returns(bytes32){
    if (b == true) {
      return sha3(bytes20(a));
    } else {
      return sha3(a);
    }
  }
  // 変換群
  function bytesConvert(uint160 a) public returns(bytes20){
    return bytes20(a);
  }
  function uint160Convert1(bytes20 a) public returns(uint160){
    return uint160(a);
  }
  function addrConvert(address a) public returns(uint160){
    return uint160(a);
  }
  function uint160Convert2(uint160 a) public returns(address){
    return address(a);
  }
  function addressArrayToBytes(address[2] a) public returns(address[2]){
    return [a[0], a[1]];
  }
    
  // PoWを実行する(1度)
  function PoW(uint72 IDSpace, uint256 blockHash, uint32 nonce) public returns(bytes32){
    return sha3(IDSpace, blockHash, nonce);
  }
  // PoWを実行し、difficultyの条件を満たしているか確認する
  // PoWを用いたスマートコントラクトのコインhttps://ethereum.org/token#proof-of-work
  function verifyPoW(uint72 IDSpace, uint256 blockHash, uint32 nonce, uint32 diff32) public returns(bool){
    coefficient = uint256(uint24(diff32));
    exponent = uint256((diff32 >> 24));
    target = coefficient << (8 * (exponent - 3));
    hash = uint256(sha3(IDSpace, blockHash, nonce)); 
    if (hash > target) {
      return false;
    } else {
      return true;
    }
  }

  function getDiffData(uint32 _diff) public returns(bytes32){
    if (_diff == 0x20ffffff) {
      coefficient = uint256(uint24(_diff));
      exponent = uint256((_diff >> 24));
      target = coefficient << (8 * (exponent - 3));
    } else {
      coefficient = uint256(uint24(diff));
      exponent = uint256((diff >> 24));
      target = coefficient << (8 * (exponent - 3));
    }
      return bytes32(target);
  }

  function verifyECSign(bytes32 _hashToSign, uint8 _v, bytes32 _r, bytes32 _s) constant returns(address) {
    return ecrecover(_hashToSign, _v, _r, _s);
  }

}
