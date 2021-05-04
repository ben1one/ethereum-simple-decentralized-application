"use strict";
const fs = require('fs');

const UserA = "0x0d4f5888e0763C190701bA521fcDF08e3aE19009";
const UserB = "0x610B55Ab1E72D81Aa8F4d72035Be8aBA7Aef777A";

const Web3 = require('web3');
const connection = new Web3('http://127.0.0.1:8545');
connection.eth.getAccounts().then(console.log);
connection.eth.getBalance(UserA).then(console.log);

const abi = JSON.parse(fs.readFileSync('SmartContract_sol_SmartContract.abi'));
const contract = new connection.eth.Contract(abi);
const listOfPosts = [
    'A Beginner’s Guide to Ethereum',
    'How Does Ethereum Work?',
    'The Year in Ethereum',
    'What is Ethereum 2.0?',
    'Ethereum is a Dark Forest'
];

contract.deploy({
  data: fs.readFileSync('SmartContract_sol_SmartContract.bin').toString(),
  arguments: [listOfPosts.map((name) =>
    connection.utils.asciiToHex(name))]
  }).send({
    from: UserA,
    gasPrice: connection.utils.toWei('0.000000000003', 'ether'),
    gas: 1500000  // User defined Gas Limit
  }).then((deployedContract) => {
    contract.options.address = deployedContract.options.address;
    console.log('deployedContract.options.address:', deployedContract.options.address);

    contract.methods.likePost(connection.utils.asciiToHex('How Does Ethereum Work?')).send({from: UserB}).then((response) => console.log(response));
    contract.methods.totalLikesFor(connection.utils.asciiToHex('How Does Ethereum Work?')).call(console.log);
});

connection.eth.getBalance(UserA).then(console.log);
connection.eth.getBalance(UserB).then(console.log);