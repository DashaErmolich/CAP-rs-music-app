const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');
const { getDestination } = require('@sap-cloud-sdk/connectivity');

const cds = require('@sap/cds');

module.exports = async function (srv) {
    const { Personalizations } = srv.entities;

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
    this.before('READ', 'Personalizations/favorites', () => {
    });
    this.after('READ', 'Personalizations/favorites', async (data) => {
        const detailsInfo = data.map(({ itemID, itemType }) => ({ id: itemID, type: itemType.name }));
        let promises = [];

        detailsInfo.forEach((item) => {
            const url = `/${item.type.toLowerCase()}/${item.id}`;
            const promise = executeHttpRequest({
                destinationName: 'DeezerAPI',
            }, {
                method: 'GET',
                url: url,
            });
            promises = [...promises, promise];
        })

        const response = await Promise.allSettled(promises);

        data.forEach((item, i) => item.details = {
            image: response[i].value.data.picture_small || response[i].value.data.cover_small || response[i].value.data.album?.cover_small || undefined,
            description: response[i].value.data.description || 'None',
            itemID: data[i].itemID,
            itemType_id: data[i].itemType_id
        });
    });
    this.before('READ', 'Personalizations/customPlaylists', () => {
    });
    this.after('READ', 'Personalizations/customPlaylists/tracks', async (data) => {
        const detailsInfo = [...data];
        let promises = [];

        detailsInfo.forEach((item) => {
            const url = `/track/${item.trackID}`;
            const promise = executeHttpRequest({
                destinationName: 'DeezerAPI',
            }, {
                method: 'GET',
                url: url,
            });
            promises = [...promises, promise];
        })

        const response = await Promise.allSettled(promises);

        data.forEach((item, i) => item.details = {
            trackID: data[i].trackID,
            parent_ID: data[i].parent_ID,
            image: response[i].value.data.artist.picture_small || undefined,
            title: response[i].value.data.title,
            artist: response[i].value.data.artist.name,
            releaseDate: response[i].value.data.release_date,
        });
    });
}