const sdk = require("@defillama/sdk");
import { sumSingleBalance } from "../helper/generalUtil";
import {
  Balances,
  ChainBlocks,
  PeggedIssuanceAdapter,  ChainContracts,
} from "../peggedAsset.type";
import { getTotalSupply as stellarGetTotalSupply } from "../helper/stellar";

const chainContracts: ChainContracts = {
  stellar: {
    issued: ["EURC:GAQRF3UGHBT6JYQZ7YSUYCIYWAF4T2SAA5237Q5LIQYJOHHFAWDXZ7NM"],
  },
};

async function stellarMinted(assetID: string) {
  return async function (
    _timestamp: number,
    _ethBlock: number,
    _chainBlocks: ChainBlocks
  ) {
    let balances = {} as Balances;
    const totalSupply = await stellarGetTotalSupply(assetID);
    sumSingleBalance(balances, "peggedEUR", totalSupply, "issued", false);
    return balances;
  };
}

const adapter: PeggedIssuanceAdapter = {
  stellar: {
    minted: stellarMinted(chainContracts.stellar.issued[0]),
  },
};

export default adapter;
