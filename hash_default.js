const bcrypt = require('bcrypt')

const output_hash = async () => {
    bcrypt.hash('p@zzw0rd', 10, function (err, hash) {
        console.log(hash)
    })
}

console.log(output_hash())