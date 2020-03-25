/* global module */
module.exports = class HDWalletProvider {

    constructor(
        mnemonic,       // string | string[],
        provider,       // string | any,
        addressIndex,   // ?: number
        numAddresses,   // ?: number
        shareNonce,     // ?: boolean
        walletHdpath    // ?: string
    ) { }

    send(
        payload,        // JSONRPCRequestPayload,
        callback        // JSONRPCErrorCallback | Callback<JsonRPCResponse>
     ) { }

    sendAsync(
        payload,        // JSONRPCRequestPayload,
        callback,       // JSONRPCErrorCallback | Callback<JsonRPCResponse>
    ) { }

    getAddress(
        idx             // ?: number
    ) { return '0x9213521CC0238331Ac5B9b638b81F367C3D37c6e'; }

    getAddresses() {
        return [ '0x9213521CC0238331Ac5B9b638b81F367C3D37c6e' ];
    }

    static isValidProvider(
        provider    // : string | any
    ) { return true }
};
