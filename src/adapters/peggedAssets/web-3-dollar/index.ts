const chainContracts = {
  ethereum: {
    issued: ["0x0d86883FAf4FfD7aEb116390af37746F45b6f378"],
  },
  base: {
    bridgedFromETH: ["0xEFb97aaF77993922aC4be4Da8Fbc9A2425322677"],
  },
};

import { addChainExports } from "../helper/getSupply";
const adapter = addChainExports(chainContracts);
export default adapter;
