/**
 * @file Tests for the production edit module
 * @author François Nguyen <https://github.com/lith-light-g>
 */
/// <reference path="../../test.d.ts" />
import { should } from "chai";
import { default as mockStore, IStore } from "redux-mock-store";
import { ProductionEditState, fetchProductionById, updateProduction, deleteProduction, ActionTypes, default as reducer } from "./productionEdit";
import { ActionTypes as ErrorTypes } from "./error";
import { middlewares } from "../store";
import * as nock from "nock";
import { API_END_POINT } from "../helpers/resolveEndPoint";
import { productions } from "../../sampleData/testDb";
import { head } from "lodash";
import "isomorphic-fetch";
import { is } from "immutable";
should();

import Models = Ropeho.Models;

describe("Production edit module", () => {
    let store: IStore<ProductionEditState>;
    const [production]: Models.Production[] = productions;
    before(() => {
        store = mockStore<ProductionEditState>(middlewares)(new ProductionEditState());
    });
    afterEach(() => {
        store.clearActions();
        nock.cleanAll();
    });
    describe("Fetch action", () => {
        it("Should fetch a production from the API server", async () => {
            const scope: nock.Scope = nock(API_END_POINT)
                .get(`/api/productions/${production._id}`)
                .reply(200, production);
            await store.dispatch(fetchProductionById(production._id));
            head(store.getActions()).should.deep.equal({
                type: ActionTypes.SET_PRODUCTION,
                production
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
            const scope: nock.Scope = nock(API_END_POINT)
                .get(`/api/productions/${production._id}`)
                .reply(500, error);
            await store.dispatch(fetchProductionById(production._id));
            head(store.getActions()).should.deep.equal({
                type: ErrorTypes.SET_ERROR,
                error
            });
            scope.done();
        });
    });
    describe("Update action", () => {
        it("Should update a production to the API server", async () => {
            const scope: nock.Scope = nock(API_END_POINT)
                .put(`/api/productions/${production._id}`, production)
                .reply(200, production);
            await store.dispatch(updateProduction(production));
            head(store.getActions()).should.deep.equal({
                type: ActionTypes.SET_PRODUCTION,
                production
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
            const scope: nock.Scope = nock(API_END_POINT)
                .put(`/api/productions/${production._id}`, production)
                .reply(500, error);
            await store.dispatch(updateProduction(production));
            head(store.getActions()).should.deep.equal({
                type: ErrorTypes.SET_ERROR,
                error
            });
            scope.done();
        });
    });
    describe("Delete action", () => {
        it("Should delete a production from the API server", async () => {
            const scope: nock.Scope = nock(API_END_POINT)
                .delete(`/api/productions/${production._id}`)
                .reply(200, {});
            await store.dispatch(deleteProduction(production._id));
            head(store.getActions()).should.deep.equal({
                type: ActionTypes.SET_PRODUCTION,
                production: undefined
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
            const scope: nock.Scope = nock(API_END_POINT)
                .delete(`/api/productions/${production._id}`)
                .reply(500, error);
            await store.dispatch(deleteProduction(production._id));
            head(store.getActions()).should.deep.equal({
                type: ErrorTypes.SET_ERROR,
                error
            });
            scope.done();
        });
    });
    describe("Reducer", () => {
        it("Should set productions with an immutable state", () => {
            is(reducer(new ProductionEditState(), {
                type: ActionTypes.SET_PRODUCTION,
                production
            }), new ProductionEditState({
                production
            })).should.be.true;
        });
    });
});
