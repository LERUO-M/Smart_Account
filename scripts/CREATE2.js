const { call } = require("@openzeppelin/upgrades-core");
const {ethers} = require("hardhat");
const { eth } = require("web3");

async function main() {
    // Get signers
    const [leruo, hope] = await ethers.getSigners();
    const leruo_address = await leruo.getAddress();

    // Get account factory - where SCAs are made
    const AccountFactoryFactory = await ethers.getContractFactory("contracts/Account.sol:AccountFactory");
    const accFactory = await AccountFactoryFactory.deploy();

    await accFactory.waitForDeployment();

    const AccFactoryAddress = await accFactory.getAddress();
    console.log("Address deployed to ", AccFactoryAddress);



    // Sender returns the FULL TRANSACTION - then we access the call data and 
    const sender = await accFactory.createAccount(leruo_address);
    await sender.wait();


    console.log("calldata of transaction created as: ", sender.data);

    const newInitCode = AccFactoryAddress + sender.data.slice(2);

    console.log("Final InitCode created as: ", newInitCode);

    // const initCodeHash = ethers.keccak256(newInitCode);


    // // LETS USE CREATE 2 TO GET THE SCA ADDRESS
    // const salt = ethers.id(leruo_address)
    // const predictedAddress = ethers.getCreate2Address(
    //     AccFactoryAddress,
    //     salt,
    //     initCodeHash
    // );

    // console.log("Predicted Smart Account Address:", predictedAddress);



    // DEPLOY ENTRY POINT AND USE IT TO GET SENDER

    let EntryPointAddress;

    const EntryPointFactory = await ethers.getContractFactory("EntryPoint");
    const entrypoint = await EntryPointFactory.deploy();
    await entrypoint.waitForDeployment();

    EntryPointAddress = await entrypoint.getAddress(); 

    console.log("EntryPoint deployed at: ", EntryPointAddress);

    try {
        await entrypoint.getSenderAddress(newInitCode);
    } catch(senderFinal){
        SCA_Address = "0x" + senderFinal.data.data.slice(-40);
        console.log("The sender address is saved as: ", SCA_Address);
    }

    // THIS RUNS THE METHOD AND RETURNS WHAT THE METHOD RETURNS. NOT THE FULL TRANSACTION
    const ACTUAL_SENDER = await accFactory.createAccount.staticCall(leruo_address);
    console.log(ACTUAL_SENDER);

}

main().catch(console.error)