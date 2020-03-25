# @vkonst/infura-wallets
Just a wrapper around **@truffle/hdwallet-provider** to easily use with **Infura**.

@example
```
\\ truffle-config.js:
const getProvider = require('@vkonst/infura-wallets');
...
networks: {
  // env params INFURA_KEY, MNEMONIC or PRIV_KEYS assumed are defined
  live: {network_id: "1", provider: getProvider("mainnet")},
  goerli: {network_id: "5", provider: getProvider("goerli")}

  // variables `infuraKey` and `privKeys` assumed are defined
  ropsten: {network_id: "3", provider: getProvider("ropsten", {infuraKey, privKeys})},

  // env params INFURA_KEY and variable `mnemonic` assumed are defined
  rinkeby: {network_id: "4", provider: getProvider("rinkeby", {mnemonic})},
}
```

### It exports
A function that returns the _factory function_ for the network and the mnemonic specified. 
```
Arguments (may be skipped to read the default values from env params):

{string} network - "rinkeby", "ropsten", "goerli" or "mainnet"

{Object=} options - the following options supported:
  {string=} options.mnemonic - 12 or 24 words, overwrites `privKeys` (note MNEMONIC)
  {string=} options.privKeys - the private key, or a comma-separated list of keys
  (ignored if `mnemonic` provided, note PRIV_KEYS)
  {string=} options.infuraKey - Infura key (token) (note INFURA_KEY)
  {string=} options.wss - "yes" for `wss` protocol, `https` otherwise (note INFURA_WSS)
```

The _factory function_ creates (or retrieves the cached one) and returns the initialized HDWalletProvider singleton.
```
{function(): HDWalletProvider}
```

### Environmental params
Optional environmental params set default values (function arguments may reassign them).
```
  - INFURA_KEY - the Infura token
  - INFURA_WSS - "yes" if 'wss' protocol shall be used instead of default 'https'
  - MNEMONIC - 12 or 24 words mnemonic, overwrites PRIV_KEYS
  - PRIV_KEYS - single key or comma-delimited keys list, ignored if `MNEMONIC` provided
```
