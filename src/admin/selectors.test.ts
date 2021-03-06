/**
 * @file Tests for the Redux selectors
 * @author François Nguyen <https://github.com/lith-light-g>
 */
/// <reference path="../test.d.ts" />
import { should } from "chai";
import {
    getCurrentUser,
    getError,
    getHasRendered,
    getProductions,
    getProduction,
    getMedias,
    getSources,
    getSelectedMedia,
    getSelectedSource,
    getSourcesFromSelectedMedia,
    getUploadQueue,
    getUpdatedMedias,
    getActiveUploadQueue,
    getFile
} from "./selectors";
import { users, productions } from "../sampleData/testDb";
import sessionReducer from "../common/modules/session";
import renderingReducer from "../common/modules/rendering";
import errorReducer from "../common/modules/error";
import productionIndexReducer from "../common/modules/productionIndex";
import productionEditReducer from "./modules/productionEdit";
import mediaEditReducer from "./modules/mediaEdit";
import sourceEditReducer from "./modules/sourceEdit";
import uploadQueueReducer from "./modules/uploadQueue";
import { ActionTypes as ObjectURLActions, default as objectURLReducer } from "./modules/objectURL";
import { v4 } from "uuid";
should();

import Models = Ropeho.Models;
import IErrorResponse = Ropeho.IErrorResponse;
import UploadEntry = Ropeho.Socket.UploadEntry;

describe("Redux selectors", () => {
    it("Should get the current user", () => {
        const [user]: Models.User[] = users;
        getCurrentUser({
            session: sessionReducer({
                user
            } as any, { type: "" })
        }).should.deep.equal(user);
    });
    it("Should get the rendering state", () => {
        getHasRendered({
            rendering: renderingReducer({
                hasRendered: true
            } as any, { type: "" })
        }).should.deep.equal(true);
        getHasRendered({
            rendering: renderingReducer({
                hasRendered: false
            } as any, { type: "" })
        }).should.deep.equal(false);
    });
    it("Should get the current error", () => {
        const error: IErrorResponse = {
            developerMessage: "A nice error",
            errorCode: 0,
            status: 400,
            userMessage: "A nice error"
        };
        getError({
            error: errorReducer({
                error
            } as any, { type: "" })
        }).should.deep.equal(error);
    });
    it("Should get all productions", () => {
        const [prodA, prodB]: Models.Production[] = productions;
        getProductions({
            productionIndex: productionIndexReducer({
                order: [prodA._id, prodB._id],
                productions: {
                    [prodA._id]: prodA,
                    [prodB._id]: prodB
                }
            } as any, { type: "" })
        }).should.deep.equal([prodA, prodB]);
    });
    it("Should get the production being edited", () => {
        getProduction({
            productionEdit: productionEditReducer({ production: productions[0] } as any, { type: "" })
        }).should.deep.equal(productions[0]);
    });
    it("Should get all medias", () => {
        const [mediaA, mediaB]: Models.Media[] = productions[0].medias;
        getMedias({
            mediaEdit: mediaEditReducer({
                order: [mediaA._id, mediaB._id],
                medias: {
                    [mediaA._id]: mediaA,
                    [mediaB._id]: mediaB
                }
            } as any, { type: "" })
        }).should.deep.equal([mediaA, mediaB]);
    });
    it("Should get all sources", () => {
        const [media]: Models.Media[] = productions[0].medias;
        const [sourceA]: Models.Source[] = media.sources;
        getSources({
            sourceEdit: sourceEditReducer({
                sources: {
                    [sourceA._id]: sourceA
                }
            } as any, { type: "" })
        }).should.deep.equal([sourceA]);
    });
    it("Should get the medias with the updated sources", () => {
        const [mediaA, mediaB]: Models.Media[] = productions[0].medias;
        const newSourceA: Models.Source = {
            _id: v4()
        };
        const newSourceB: Models.Source = {
            _id: v4()
        };
        getUpdatedMedias({
            mediaEdit: mediaEditReducer({
                order: [mediaA._id, mediaB._id],
                medias: {
                    [mediaA._id]: mediaA,
                    [mediaB._id]: mediaB
                },
                sources: {
                    [mediaA._id]: [newSourceA._id],
                    [mediaB._id]: [newSourceB._id]
                },
            } as any, { type: "" }),
            sourceEdit: sourceEditReducer({
                sources: {
                    [newSourceA._id]: newSourceA,
                    [newSourceB._id]: newSourceB
                }
            } as any, { type: "" })
        }).should.deep.equal([{
            ...mediaA,
            sources: [newSourceA]
        }, {
            ...mediaB,
            sources: [newSourceB]
        }]);
    });
    it("Should get the selected media", () => {
        const [media]: Models.Media[] = productions[0].medias;
        getSelectedMedia({
            mediaEdit: mediaEditReducer({
                order: [media._id],
                medias: { [media._id]: media },
                selected: media._id
            } as any, { type: "" })
        }).should.deep.equal(media);
    });
    it("Should get undefined if the selected media does not exist", () => {
        const [media]: Models.Media[] = productions[0].medias;
        should().not.exist(getSelectedMedia({
            mediaEdit: mediaEditReducer({
                order: [],
                medias: {},
                selected: media._id
            } as any, { type: "" })
        }));
    });
    it("Should get undefined if there is no selected media", () => {
        const [media]: Models.Media[] = productions[0].medias;
        should().not.exist(getSelectedMedia({
            mediaEdit: mediaEditReducer({
                order: [media._id],
                medias: { [media._id]: media },
                selected: undefined
            } as any, { type: "" })
        }));
    });
    it("Should get the selected source", () => {
        const [source]: Models.Source[] = productions[0].banner.sources;
        getSelectedSource({
            sourceEdit: sourceEditReducer({
                order: [source._id],
                sources: { [source._id]: source },
                selected: source._id
            } as any, { type: "" })
        }).should.deep.equal(source);
    });
    it("Should get undefined if the selected source does not exist", () => {
        const [source]: Models.Source[] = productions[0].banner.sources;
        should().not.exist(getSelectedSource({
            sourceEdit: sourceEditReducer({
                order: [],
                sources: {},
                selected: source._id
            } as any, { type: "" })
        }));
    });
    it("Should get undefined if there is no selected source", () => {
        const [source]: Models.Source[] = productions[0].banner.sources;
        should().not.exist(getSelectedSource({
            sourceEdit: sourceEditReducer({
                order: [source._id],
                sources: { [source._id]: source },
                selected: undefined
            } as any, { type: "" })
        }));
    });
    it("Should get sources from the selected media", () => {
        const media: Models.Media = productions[0].banner;
        const [source]: Models.Source[] = media.sources;
        getSourcesFromSelectedMedia({
            sourceEdit: sourceEditReducer({
                sources: { [source._id]: source }
            } as any, { type: "" }),
            mediaEdit: mediaEditReducer({
                sources: { [media._id]: [source._id] },
                selected: media._id
            } as any, { type: "" })
        }).should.deep.equal([source]);
    });
    it("Should get the upload queue", () => {
        const [entryA, entryB, entryC]: UploadEntry[] = [{
            id: v4(),
            bytesSent: 0,
            max: 0,
            target: {
                mainId: v4(),
                mediaId: v4(),
                sourceId: v4()
            },
            active: true,
            objectURL: ""
        }, {
            id: v4(),
            bytesSent: 0,
            max: 0,
            target: {
                mainId: v4(),
                mediaId: v4(),
                sourceId: v4()
            },
            active: false,
            objectURL: ""
        }, {
            id: v4(),
            bytesSent: 0,
            max: 0,
            target: {
                mainId: v4(),
                mediaId: v4(),
                sourceId: v4()
            },
            active: true,
            objectURL: ""
        }];
        getUploadQueue({
            uploadQueue: uploadQueueReducer({
                order: [entryA.id, entryC.id, entryB.id],
                uploadQueue: {
                    [entryA.id]: entryA,
                    [entryB.id]: entryB,
                    [entryC.id]: entryC
                }
            } as any, { type: "" })
        }).should.deep.equal([entryA, entryC, entryB]);
    });
    it("Should get only the active items from the upload queue", () => {
        const [entryA, entryB, entryC]: UploadEntry[] = [{
            id: v4(),
            bytesSent: 0,
            max: 0,
            target: {
                mainId: v4(),
                mediaId: v4(),
                sourceId: v4()
            },
            active: true,
            objectURL: ""
        }, {
            id: v4(),
            bytesSent: 0,
            max: 0,
            target: {
                mainId: v4(),
                mediaId: v4(),
                sourceId: v4()
            },
            active: false,
            objectURL: ""
        }, {
            id: v4(),
            bytesSent: 0,
            max: 0,
            target: {
                mainId: v4(),
                mediaId: v4(),
                sourceId: v4()
            },
            active: true,
            objectURL: ""
        }];
        getActiveUploadQueue({
            uploadQueue: uploadQueueReducer({
                order: [entryA.id, entryC.id, entryB.id],
                uploadQueue: {
                    [entryA.id]: entryA,
                    [entryB.id]: entryB,
                    [entryC.id]: entryC
                }
            } as any, { type: "" })
        }).should.deep.equal([entryA, entryC]);
    });
    it("Should get the associated filename from an objectURL", () => {
        const objectURL: string = "blob:http://localhost/aNiceFile";
        const file: File = new File([new ArrayBuffer(100)], "file.webp");
        getFile({
            objectURL: objectURLReducer({
                objectURLs: {}
            } as any, {
                    type: ObjectURLActions.SET_FILE,
                    objectURL,
                    file
                })
        }, objectURL).should.equal(file);
    });
});
