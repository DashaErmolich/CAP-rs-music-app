
const cds = require('@sap/cds')

module.exports = cds.service.impl(async function() {
    this.on('like', (req) => {
        const type = req.data.typeID === 0 ? 'Track' : req.data.typeID === 1 ? 'Playlist' : 'Radio'
        console.log(`${type} liked!!`);
    });
});