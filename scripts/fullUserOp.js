const {ethers} = require("hardhat");

async function main() {
    const [deployer, signer1] = await ethers.getSigners();
    const deployer_address = await deployer.getAddress();

    console.log("Deployer's address: ", deployer_address);

    const AccountFactoryFactory = await ethers.getContractFactory("contracts/Account.sol:AccountFactory");
    const accountFactory = await AccountFactoryFactory.deploy(AccountFactoryFactory);
    await accountFactory.waitForDeployment();

    const accountFactoryAddress = await accountFactory.getAddress();
    console.log("Account Factory deployed to: ", accountFactoryAddress);

    const EntryPointFactory = await ethers.getContractFactory("EntryPoint");
    const entrypoint = await EntryPointFactory.deploy();
    await entrypoint.waitForDeployment();

    console.log("Entry point deployed to: ", await entrypoint.getAddress());



    // Get fields to build UserOp object
    console.log("Creating an account using public address: ", deployer_address);


    // sender 
    const senderAddress = await accountFactory.createAccount.staticCall(deployer_address);
    console.log("Created SCA at address: ", senderAddress);

    // Init code
    const tx = await accountFactory.createAccount(deployer_address);
    await tx.wait();
    const InitCode = accountFactoryAddress + tx.data.slice(2);

    console.log("InitCode: ", InitCode);

    //Calldata
    console.log("Getting the callData now...");
    const Account_Factory = await ethers.getContractFactory("contracts/Account.sol:Account");

    const call1 = {
        target: senderAddress,
        value: 0,
        data: Account_Factory.interface.encodeFunctionData("addNums", [2,5])
    }

    const call2 = {
        target: senderAddress,
        value: 0,
        data: Account_Factory.interface.encodeFunctionData("MultNum", [2,5])       
    }

    const call3 = {
        target: senderAddress,
        value: 0,
        data: Account_Factory.interface.encodeFunctionData("execute", [5])
    }

        // encode these calls into executeBatch
    const batchCallData = Account_Factory.interface.encodeFunctionData("executeBatch", [
        [call1.target, call2.target, call3.target],
        [call1.value, call2.value, call3.value],
        [call1.data, call2.data, call3.data] 
    ]);

    console.log("The batch call data encoded hex: ", batchCallData);

    console.log("STARTING TO CONSTRUCT THE USEROP...");

    let userOp = {
        sender: senderAddress,
        nonce: await entrypoint.getNonce(senderAddress, 0),
        initCode: InitCode,
        callData: batchCallData,

        paymasterAndData: "0x",
        signature: "0x"
    };

    // Getting the gas Numbers for the sections
        // These 3 limits come from on the same method "eth_estimateUserOperationGas"
            // callGasLimit: 200000,    // from Bundler estimation
            // verificationGasLimit: 150000,
            // preVerificationGas: 50000,
        // 
    // maxFeePerGas: 20000000000,
    // maxPriorityFeePerGas: 20000000000,

    console.log("Getting gas estimations...");

    // ethers.provider.send("eth_estimateUserOperationGas")


    // Signature
    console.log("Getting Signature of the UserOpHash");

    // Get userOpHash bytes as you cannot sign an object directly. Convert it to 32-bytes
    const userOpHash = await entrypoint.getUserOpHash.staticCall(userOp);

    // Sign the 32-byte hash then store it back into the field
    const signature = await deployer.signMessage(ethers.toBeArray(userOpHash));
    userOp.signature = signature;

    console.log("Signature of UserOpHash: ", signature);
    console.log(userOp);

    // Get the gas estimates here then update UserOp.




    // Paymaster



    
} main().catch(console.error)