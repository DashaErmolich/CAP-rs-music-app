
const cds = require('@sap/cds')

module.exports = function(srv) {
    const { Personalizations } =srv.entities;
    this.before('CREATE', Personalizations, (req) => {
        let min;
        let max;
        try {
            min = Personalizations.elements.iconID['@assert.range'][0];
            max = Personalizations.elements.iconID['@assert.range'][1];
        } catch (error) {
            min = 1;
            max = 11;
        }
        if (!req.data?.iconID) {
            req.data.iconID = Math.floor(Math.random() * (max - min + 1) + min);
        };
        if (!req.data?.username) {
            req.data.username = req.user.id;
        };
    });
}