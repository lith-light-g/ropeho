/**
 * @file Tests for the category index module
 * @author François Nguyen <https://github.com/lith-light-g>
 */
/// <reference path="../../test.d.ts" />
import { should } from "chai";
import { default as mockStore, IStore } from "redux-mock-store";
import { CategoryIndexState, defaultState, fetchCategories, ActionTypes, default as reducer } from "./categoryIndex";
import { ActionTypes as ErrorTypes } from "./error";
import reduxThunk from "redux-thunk";
import * as nock from "nock";
import { ADMIN_END_POINT } from "../helpers/resolveEndPoint";
import { categories } from "../../sampleData/testDb";
import { head } from "lodash";
import "isomorphic-fetch";
import { is, fromJS } from "immutable";
should();

describe("Category index module", () => {
    let store: IStore<CategoryIndexState>;
    before(() => {
        store = mockStore<CategoryIndexState>([reduxThunk.withExtraArgument({
            host: ADMIN_END_POINT,
            init: {
                credentials: "include"
            },
            error: {
                type: ErrorTypes.SET_ERROR
            }
        })])(defaultState);
    });
    afterEach(() => {
        store.clearActions();
        nock.cleanAll();
    });
    describe("Actions", () => {
        it("Should fetch categories from the API server", async () => {
            const scope: nock.Scope = nock(ADMIN_END_POINT)
                .get("/api/categories")
                .reply(200, categories);
            await store.dispatch(fetchCategories());
            head(store.getActions()).should.deep.equal({
                type: ActionTypes.SET_CATEGORIES,
                categories
            });
            scope.done();
        });
        it("Should handle HTTP errors", async () => {
            const error: Ropeho.IErrorResponse = {
                developerMessage: "A nice error",
                errorCode: 0,
                status: 500,
                userMessage: "A nice error"
            };
            const scope: nock.Scope = nock(ADMIN_END_POINT)
                .get("/api/categories")
                .reply(500, error);
            await store.dispatch(fetchCategories());
            head(store.getActions()).should.deep.equal({
                type: ErrorTypes.SET_ERROR,
                error
            });
            scope.done();
        });
    });
    describe("Reducer", () => {
        it("Should set categories with an immutable state", () => {
            is(reducer(undefined, {
                type: ActionTypes.SET_CATEGORIES,
                categories
            }), fromJS({
                categories
            })).should.be.true;
        });
    });
});
