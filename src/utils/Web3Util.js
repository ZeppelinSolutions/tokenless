import * as EthUtil from 'ethereumjs-util';
import * as dateUtil from './DateUtil';

export let currentSimulatedDateUnix = dateUtil.dateToUnix(new Date());

export function getCurrentTime(web3) {
  return web3.eth.getBlock('latest').timestamp;
}

export function getBlockNumber(web3) {
  return new Promise(resolve => {
    web3.eth.getBlockNumber((err, blockNumber) => {
      resolve(blockNumber);
    });
  });
}

export function getBalanceInEther(address, web3) {
  return new Promise(resolve => {
    return +web3.eth.getBalance(address, function(error, result) {
      if(error) {
        console.log('error getting balance');
      }
      else {
        resolve( +web3.fromWei(result.toNumber(), 'ether'));
      }
    });
  });
}

export function getNetworkId(web3) {
  return new Promise((resolve, reject) => {
    web3.version.getNetwork((err, netId) => {
      if(err) reject();
      else {
        resolve(netId);
      }
    });
  });
}

export function skipTime(seconds, web3) {
  // console.log('skipping time:', seconds);
  return new Promise(async (resolve, reject) => {
    web3.currentProvider.sendAsync(
      {
        jsonrpc: "2.0",
        method: "evm_increaseTime",
        params: [seconds],
        id: 0
      },
      async (error, result) => {
        if(error) {
          // console.log('error skipping time');
          reject();
        }
        else {
          // console.log('time skipped');
          await skipBlocks(1, web3);
          currentSimulatedDateUnix += seconds; // keep track of when now is for concurent tests
          resolve();
        }
      }
    );
  });

  // Console snippet:
  // web3.currentProvider.send({jsonrpc: "2.0", method: "evm_increaseTime", params: [1000], id: 0});
}

export async function skipBlocks(numBlocks, web3) {
  // console.log('skipping blocks:', numBlocks);
  return new Promise(async resolve => {
    for(let i = 0; i < numBlocks; i++) {
      await skipBlock(web3);
    }
    resolve();
  });
}

export async function skipBlock(web3) {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync(
      {
        jsonrpc: '2.0',
        method: 'evm_mine'
      },
      (error, result) => {
        if(error) {
          // console.log('error skipping block');
          reject();
        }
        else {
          // console.log('block skipped');
          resolve();
        }
      }
    );
  });

  // Console snippet:
  // web3.currentProvider.send({jsonrpc: "2.0", method: "evm_mine", id: 0});
}

export function getTimestamp(web3) {
  return new Promise(async resolve => {
    const blockNumber = await getBlockNumber(web3);
    web3.eth.getBlock(blockNumber, function(error, result) {
      if(error) {
        console.log('error getting timestamp');
      }
      else {
        resolve(result.timestamp);
      }
    });
  });
  // Console snippet:
  // web3.eth.getBlock(web3.eth.blockNumber).timestamp;
}

export function sendDummyTransaction(web3, address) {
  console.log('sendDummyTransaction', address);
  web3.eth.sendTransaction({
      from: address
    },
    (err, res) => {}
  );
}

export async function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export function privateKeyToAddress(privateKeyHex) {
  const privateKeyBytes = hexToBytes(privateKeyHex);
  const addressBytes =  EthUtil.privateToAddress(privateKeyBytes);
  return '0x' + addressBytes.toString('hex');
};

export function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c+=2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
};
