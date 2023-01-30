import * as paillier from 'paillier-bigint'

async function test() {
    console.log('\n' + 'PAILLIER-BIGINT' + '\n')

    console.log('\n' + 'ENCRIPTACIÓ BÀSICA' + '\n')
    
    // CLIENT: generació de clau pública i privada

    const { publicKey, privateKey } = await paillier.generateRandomKeys(3072)

    // SERVIDOR: creació d'un missatge

    const m = 987654321n
    console.log('Missatge original: ' + m)

    // Encriptació
    const c = publicKey.encrypt(m)

    // CLIENT: generació de clau pública i privada
    const d = privateKey.decrypt(c)
    console.log('Missatge decriptat: ' + d)
    
    if (d == m) {
        console.log('        Encriptació correcta')
    } else {
        console.log('        Encriptació incorrecta')
    }

    console.log('\n' + 'ENCRIPTACIÓ HOMOMÒRFICA PER ADDICIÓ' + '\n')

    // SERVIDOR: encriptació dels dos missatges conjunts
    const m2 = 9n
    
    console.log('Missatge original: ' + m + ' + ' + m2)
    const originalAdd = m + m2
    const c2 = publicKey.encrypt(m2)
    
    const add = publicKey.addition(c, c2)

    // CLIENT: decriptació dels missatge

    const decAdd = privateKey.decrypt(add)

    console.log('Missatge decriptat: ' + decAdd)

    if (decAdd == originalAdd) {
        console.log('        Encriptació correcta')
    } else {
        console.log('        Encriptació incorrecta')
    }
  
    console.log('\n' + 'ENCRIPTACIÓ HOMOMÒRFICA PER MULTIPLICACIÓ' + '\n')
    
    // SERVIDOR: encriptació dels dos missatges multiplicats
    const k = 10n
    const originalMul = m * k
    console.log('Missatge original: ' + m + '*' + k)

    const mul = publicKey.multiply(c, k)
    const decMul = privateKey.decrypt(mul)
    console.log('Missatge decriptat: ' + decMul) 

    if (decMul == originalMul) {
        console.log('        Encriptació correcta')
    } else {
        console.log('        Encriptació incorrecta')
    }
}

test()
