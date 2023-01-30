import * as shamir from 'shamirs-secret-sharing-ts'

async function test() {

    console.log('\n' + 'SHAMIR SECRET SHARING' + '\n')
    
    // Generació del secret
    const secret = Buffer.from('My secret key')
    console.log('Secret: ' + secret)

    // Separació del secret
    const shares = shamir.split(secret, { shares: 10, threshold: 4 })
    
    // Recuperació del secret
    const recovered = shamir.combine(shares.slice(3, 7))
    console.log('Recovered message: ' + recovered.toString())


    const recovered2 = shamir.combine(shares.slice(2, 4))
    console.log('Recovered message: ' + recovered2.toString())
}

test()
