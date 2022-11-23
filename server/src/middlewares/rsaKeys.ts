import * as bcu from 'bigint-crypto-utils'

export class RsaPublicKey {
    e: bigint
    n: bigint
    constructor (e: bigint, n: bigint) {
        this.e = e
        this.n = n
    }
    encrypt (m: bigint) {
        return bcu.modPow(m,this.e,this.n)
    }
    verify (s: bigint) {
        return bcu.modPow(s,this.e,this.n)
    }
}

export class RsaPrivateKey {
    d: bigint
    n: bigint

    constructor (d: bigint, n: bigint) {
        this.d = d
        this.n = n
    }
    decrypt (c: bigint) {
        return bcu.modPow(c,this.d,this.n)
    }
    sign (m: bigint) {
        return bcu.modPow(m,this.d,this.n)
    }
}

export async function generateRsaKeys(bitlenght: number) {
    let p: bigint, q: bigint, n: bigint, phin: bigint
    const e = 65537n
    do {
        p = await bcu.prime(Math.floor(bitlenght / 2) + 1)
        q = await bcu.prime(Math.floor(bitlenght / 2))
        n = p * q
        phin = (p - 1n) * (q - 1n)
    } while (p == q || bcu.bitLength(n) !==
    bitlenght || phin % e == 0n)

    const d = bcu.modInv(e, phin)

    const publicKey = new RsaPublicKey(e, n)
    const privateKey = new RsaPrivateKey(d, n)

    return {
        publicKey: publicKey,
        privateKey: privateKey
    }
}