/**
 * @module @vkonst/infura-wallets
 * @description Factory that creates HDWalletProvider singleton(s) with Infura for specified network(s) and keys.
 */

// Optional env params (function call args may reassign them)
const {
    INFURA_KEY,
    MNEMONIC,       // 12 or 24 words mnemonic, overwrites PRIV_KEYS
    PRIV_KEYS,      // single key or comma-delimited keys list
    INFURA_WSS,     // "yes" if 'wss' protocol shall be used instead of default 'https'
    TRUFFLE_TEST    // assign non-empty value to it to avoid Infura usage with `truffle test`
} = process.env;

const cachedProviders = {};

/**
 * Returns a factory function for the network and the mnemonic (or private keys) specified.<br/>
 * The factory function creates (or retrieves from cache) and returns the HDWalletProvider singleton.
 * @param {string} network - "rinkeby", "ropsten", "goerli" or "mainnet"
 * @param {Object=} options - the following options supported:
 * @param {string=} options.mnemonic - 12 or 24 words, overwrites `privKeys`
 *  (note {@link process.env|MNEMONIC env param})
 * @param {string=} options.privKeys - the private key, or a comma-separated list of keys</br>
 * (ignored if `mnemonic` provided, note {@link process.env|PRIV_KEYS env param})
 * @param {string=} options.infuraKey - Infura key (token) (note {@link process.env|INFURA_KEY env param})
 * @param {string=} options.wss - "yes" for `wss` protocol, `https` otherwise
 * (note {@link process.env|INFURA_WSS env param})
 * @return {function(): HDWalletProvider} The function that returns an HDWalletProvider singleton
 */
module.exports = function getHDWalletProviderFactory(network, options = {}) {

    if (!(network || "").match(/rinkeby|ropsten|goerli|mainnet/)) {
        throw new Error("Unknown network (supported: rinkeby|ropsten|goerli|mainnet)");
    }

    const {mnemonic, privKeys, infuraKey, wss} = options;

    const mnemonicOrPKs = mnemonic || privKeys
        ? mnemonic || privKeys
        : MNEMONIC || (PRIV_KEYS || "").split(',');

    const token = infuraKey || INFURA_KEY;
    const {proto, route} = (wss || INFURA_WSS || "").toLowerCase() === "yes"
        ? { proto: "wss", route: `ws/v3/${token}` }
        : { proto: "https", route: `v3/${token}` };

    const uri = `${proto}://${network}.infura.io/${route}`;

    const hash = (`${mnemonicOrPKs}${uri}`)
        .split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a
        }, 0)
        .toString();

    console.debug(`Infura HDWalletProvider pre-set: ${uri.replace(/\/[^\/]+$/g, "")}`);

    return getHDWalletProviderSingleton;

    function getHDWalletProviderSingleton() {
        return cachedProviders[hash]
            ? cachedProviders[hash]
            : (() => {
                if (TRUFFLE_TEST) {
                    throw new Error('Forbidden to use Infura in TRUFFLE_TEST environment');
                }
                const HDWalletProvider = require("@truffle/hdwallet-provider");
                cachedProviders[hash] = new HDWalletProvider(mnemonicOrPKs, uri);

                console.debug("Infura HDWalletProvider initialized:");
                console.debug("URI: ", uri.replace(/[^\/]+$/g, "xxx"));
                console.debug("PKs: ", mnemonicOrPKs.toString().replace(/\w|\s/g, "x"));

                return cachedProviders[hash];
            })();
    }
};
