const { readFileSync } = require('fs');
const { machineIdSync } = require('node-machine-id');

const machineId = machineIdSync()
console.log('machineId: ', machineId)

const DMI_UUID_FILE = "/sys/class/dmi/id/product_uuid"
const productId = readFileSync(DMI_UUID_FILE, 'ascii')
console.log('productId', productId)