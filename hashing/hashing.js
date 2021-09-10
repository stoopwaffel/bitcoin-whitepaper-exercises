"use strict";

var crypto = require("crypto");

const blockTemplate = {
	index: 0,
	hash: "000000",
	data: "",
	timestamp: Date.now(),
};

// The Power of a Smile
// by Tupac Shakur
var poem = [
	"The power of a gun can kill",
	"and the power of fire can burn",
	"the power of wind can chill",
	"and the power of a mind can learn",
	"the power of anger can rage",
	"inside until it tears u apart",
	"but the power of a smile",
	"especially yours can heal a frozen heart",
];

var Blockchain = {
	blocks: [],
};

// Genesis block
Blockchain.blocks.push(blockTemplate);

// TODO: insert each line into blockchain
for (let line of poem) {
	createBlock(line);
}

console.log(`Blockchain is valid: ${verifyChain(Blockchain)}`);


// **********************************

function blockHash(bl) {
	return crypto.createHash("sha256").update(
		bl
	).digest("hex");
}

function createBlock(text) {
	let prevBlock = {}
	let prevBlockSlice = Blockchain.blocks.slice(-1);
	if (prevBlockSlice.length > 0) {
		prevBlock = prevBlockSlice[0];
	} else {
		throw 'no previous block!';
	}
	let index = prevBlock.index + 1;
	let timestamp = Date.now();
	let prevHash = prevBlock.hash;
	let newBlock = {
		hash: blockHash([index, prevHash, text, timestamp].join('|')),
	    prevHash: prevHash,
		data: text,
		timestamp: timestamp,
		index: index
	}

	Blockchain.blocks.push(newBlock);
	// takes text for its data
	// creates object for the block
	// computes its hash
	// insert into the array
}

function verifyChain(blockchain) {
	let blocks = blockchain.blocks;
	let prevBlock = blocks[0];
	blocks.forEach(function (block, index) {
		if (block.index === 0) {
			if (block.hash !== '000000') {
				return false;
			}
		} else {
			prevBlock = blocks[block.index - 1];
			if (!verifyBlock(block, prevBlock)) {
				return false;
			}
		}
	});
	return true;
}

function verifyBlock(block, prevBlock) {
	let neededFields = ['data', 'prevHash'];
    neededFields.forEach(function (neededField, index) {
		if (typeof(block[neededField]) === 'undefined' || !block[neededField] || block[neededField].length < 1) {
			console.log(`fail: ${neededField} empty`);
			return false;
		}
	});
	let hashElements = [block.index, prevBlock.hash, block.data, block.timestamp].join('|');
	let currentHash = blockHash(hashElements);
	if (currentHash !== block.hash) {
		console.log(`fail: ${currentHash} is not equal to ${block.hash}`);
		return false;
	}
	console.log(`block ${block.index} is verified`);
    return true;
}