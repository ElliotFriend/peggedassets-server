import { sumSingleBalance } from "../helper/generalUtil";
import {
  PeggedIssuanceAdapter,
  Balances,
} from "../peggedAsset.type";
import { ChainApi } from "@defillama/sdk";


const uniPoolsMapping = {
  ethereum: {
    "0xc0d19f4fae83eb51b2adb59eb649c7bc2b19b2f6":
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC-BOB 2
    "0x8fB60298C6Bbafa428494fd2D63d116063Ef32e2":
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC-BOB
    "0x3887E82dBdBE8Ec6Db44E6298a2D48Af572A3b78":
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // BOB (WETH)
    "0x0230dDd838e499865405042560E72AA38324acd1":
      "0xdAC17F958D2ee523a2206206994597C13D831ec7", // BOB-USDT
  },
  polygon: {
    "0x0a63D3910fFC1529190e80E10855c4216407cc45":
      "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC-BOB
    "0xD90d522211f7A887fd833eCECed83A3019E0Fc6c":
      "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // BOB-WMATIC
    "0x3A5329ee48A06671aD1BF295b8a233EE9b9b975E":
      "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", // BOB (WETH)
    "0xab4b63BD6c214Ce8409FA1B31afA50D4E17597F9":
      "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // BOB-USDT
    "0x281a49e2700AEA1a958689718a1a108bD8D3202b":
      "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", // BOB-WBTC
  },
  optimism: {
    "0x6432037739cCd0201987472604826097b55813e9":
      "0x7F5c764cBc14f9669B88837ca1490cCa17c31607", // USDC-BOB
    "0x7f1C919A92BCe8790a85d6360B85cf21b997A6b5":
      "0x4200000000000000000000000000000000000042", // BOB-OP
    "0xDA191eCf1a1b9FA1cc2042A1C15Ce6F093D1549d":
      "0x4200000000000000000000000000000000000006", // BOB (WETH)
  },
  bsc: {
    "0x2a723e6DE06833645f0D0bd06A385A5a44BFecEB":
      "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", // BUSD pool (Kyberswap)
    "0xb3aba0672F392A9Eb3115789f1a57C6a1888F057":
      "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // WBNB pool (Kyberswap)
  },
  arbitrum: {
    "0xdbBc93072295362D38B63ACCd447D9c0B36a1678":
      "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8", // USDC pool (Kyberswap)
  },
} as {
  [chain: string]: {
    [poolAddress: string]: string; // non-BOB token address
  };
};

async function getChainCollateralUsdValue(chain: string) {
  return async function (api: ChainApi) {
    const toa = Object.entries(uniPoolsMapping[chain]).map(([pool, token]) => [token, pool])
    await api.sumTokens({ tokensAndOwners: toa})
    const usdValue = await api.getUSDValue()
    let balances = {} as Balances;
    sumSingleBalance(balances, "peggedUSD", usdValue, "issued", false);
    return balances;
  };
}

const adapter: PeggedIssuanceAdapter = {
  ethereum: {
    minted: getChainCollateralUsdValue("ethereum"),
  },
  polygon: {
    minted: getChainCollateralUsdValue("polygon"),
  },
  optimism: {
    minted: getChainCollateralUsdValue("optimism"),
  },
  bsc: {
    minted: getChainCollateralUsdValue("bsc"),
  },
  arbitrum: {
    minted: getChainCollateralUsdValue("arbitrum"),
  },
};

export default adapter;
