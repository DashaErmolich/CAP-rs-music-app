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
    this.after('READ', 'Personalizations/favorites', async (data) => {
        const myData = data.map(({ itemID, itemType }) => ({ id: itemID, type: itemType.name }));
        console.log(myData);
        let promises = [];

        for (let i = 0; i < myData.length; i++) {
            const myUrl = `/${myData[i].type.toLowerCase()}/${myData[i].id}`;
            const promise = executeHttpRequest({
                destinationName: 'DeezerAPI',
            }, {
                method: 'GET',
                url: myUrl,
            });
            promises = [...promises, promise];
        }

        // myData.fofEach((data) => {
        //     const myUrl = `/${data.itemType.name.toLowerCase()}/${data.itemID}`;
        //     const response = executeHttpRequest({
        //         destinationName: 'DeezerAPI',
        //     }, {
        //         method: 'GET',
        //         url: myUrl,
        //     });
        //     promises = [...promises, response];
        // });

        const response = await Promise.allSettled(promises);
        const newData = response.map((item, i) => {
            const res = item.value.data;

            const result = {
                image: undefined,
                description: 'None',
                itemID: data[i].itemID,
                itemType_id: data[i].itemType_id,
            };

            if (res.picture_small) {
                result.image = res.picture_small;
            }

            if (res.description) {
                result.description = res.description;
            }

            return result;
        });

        data.forEach((item, i) => {
            return item.details = newData[i];
        });

        console.log(1)


        //data = detailed;

        

        // return data;

        //return data;

        //console.log(a)
        //return await Promise.allSettled(promises);
    })
    this.before('READ', 'Personalizations/favorites', (a, b) => {
    })
}