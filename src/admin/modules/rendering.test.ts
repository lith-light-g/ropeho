/**
 * @file Tests for the rendering module
 * @author François Nguyen <https://github.com/lith-light-g>
 */
/// <reference path="../../test.d.ts" />
import { should } from "chai";
import { default as mockStore, IStore } from "redux-mock-store";
import { RenderingState, setRendered, ActionTypes, default as reducer } from "./rendering";
import { middlewares } from "../store";
import { is } from "immutable";
should();

describe("Rendering module", () => {
    let store: IStore<RenderingState>;
    before(() => store = mockStore<RenderingState>(middlewares)(new RenderingState()));
    afterEach(() => store.clearActions());
    it("Should dispatch an action with boolean", () => {
        store.dispatch(setRendered(true));
        store.dispatch(setRendered(false));
        store.getActions().should.deep.equal([
            { type: ActionTypes.SET_RENDERED, hasRendered: true },
            { type: ActionTypes.SET_RENDERED, hasRendered: false }
        ]);
    });
    it("Should create a new state with changes", () => {
        is(reducer(
            new RenderingState({
                hasRendered: false
            }), {
                type: ActionTypes.SET_RENDERED,
                hasRendered: true
            }), new RenderingState({
                hasRendered: true
            }));
    });
});
