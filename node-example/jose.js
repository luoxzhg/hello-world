const jose = require('jose');
const jwk = require('./jwks-火眼').keys[0];

async function main() {
   const publicKey = await jose.importJWK(jwk, 'RS256')
   const publicPem = await jose.exportSPKI(publicKey)

   console.log(publicPem)
}

main()
