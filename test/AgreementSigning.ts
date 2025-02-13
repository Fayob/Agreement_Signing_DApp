import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("Agreement Signing", () => {
  async function deployAgreement() {
    const agreementContractFactory = await hre.ethers.getContractFactory("AgreementSigning")
    const deployedContract = await agreementContractFactory.deploy("0x0961AAFABCFDF7d5F9BA420702eAb7fF9C44ef76")
    const AGREEMENT_PRICE = hre.ethers.parseEther("10");
    const DEADLINE = Math.floor(Date.now() / 1000) + 86400;
    const [buyer, seller] = await hre.ethers.getSigners()

    return { deployedContract, buyer, seller, AGREEMENT_PRICE, DEADLINE }
  }

  describe("Deployment", () => {
    it("should test the deployer", async () => {
      const {deployedContract, buyer} = await loadFixture(deployAgreement)

      const deployer = deployedContract.runner

      expect(deployer).to.equal(buyer)
    })
  })

  describe("Create Signing", () => {
    it("should be able to create signing", async () => {
      const {deployedContract, seller, AGREEMENT_PRICE, DEADLINE} = await loadFixture(deployAgreement)

      await deployedContract.createAgreement(seller, "name", "description", AGREEMENT_PRICE, DEADLINE)

      expect(await deployedContract.agreementId()).to.equal(1)
    })
  })
})
