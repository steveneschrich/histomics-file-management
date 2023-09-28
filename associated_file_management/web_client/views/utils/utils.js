import { restRequest } from "@girder/core/rest";
import events from "../../events";

const groupBy = (key) => (array) =>
    array.reduce((objectsByKeyValue, obj) => {
        const value = obj[key];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
    }, {});

const getFolderInformationById = (folderId) => {
    return restRequest({
        url: `folder/${folderId}`,
    });
};

/**
 *
 * API call to get the content of the item with the json structure
 * @param {*} itemId
 * @return {*}
 */
export const getPDFContent = (itemId) => {
    restRequest({
        url: `item/${itemId}/download?contentDisposition=inline`,
    }).then((response) => {
        events.trigger("query:download-item-id", response);
    });
};

/**
 *
 * Function to get the list of files per metadata key
 * @param metadata image metadata
 * @param key key to be retrieved
 * @return {*} Promise void
 */
export const getFilesPerMetaKey = (metadata, key = "patientId") => {
    if (!metadata) return;
    if (!metadata[key]) {
        return;
    }

    const files = [];
    restRequest({
        url: `histomicsui/query_metadata?key=${key}&value=${JSON.stringify(
            metadata[key]
        )}&limit=50&sort=name&sortdir=1`,
    })
        .then((data) => {
            const folderPromises = [];
            data.forEach((item) => {
                folderPromises.push(getFolderInformationById(item.folderId));
                files.push({
                    itemId: item._id,
                    name: item.name,
                    folderId: item.folderId,
                });
            });

            return Promise.all(folderPromises);
        })
        .then((folders) => {
            const groupByFolderId = groupBy("folderId");
            const groupById = groupBy("_id");
            const resultData = groupByFolderId(files);
            const groupedFolders = groupById(folders);

            Object.entries(groupedFolders).forEach(([key, value]) => {
                const temp = resultData[key];
                resultData[key] = {};
                resultData[key].data = temp;
                resultData[key].folderName = value[0].name;
            });

            events.trigger("query:files-per-key", resultData);
            return resultData;
        });
};
