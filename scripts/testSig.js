const { keccak256 } = require("ethers");
const {ethers} = require("hardhat");

async function main() {
    const [deployer, signer1] = await ethers.getSigners(); 

    // Get address of deployer
    const deployer_address = await deployer.getAddress();

    const messageHash = ethers.keccak256(ethers.toUtf8Bytes("hello"));
    console.log("Hash:", messageHash);

    // 2. Convert to Bytes and Sign
    // CRITICAL: Use ethers.getBytes so it signs the 32 bytes, not the 66 characters
    const signature = await deployer.signMessage(ethers.getBytes(messageHash));

    // Deploy Target
    const TestFactory = await ethers.getContractFactory("Test");
    const test = await TestFactory.deploy(signature);

    await test.waitForDeployment();

    console.log(test.runner.address);

} 

main().catch(console.error)