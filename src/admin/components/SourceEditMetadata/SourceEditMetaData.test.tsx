/**
 * @file Tests for the SourceEditMetaData component
 * @author François Nguyen <https://github.com/lith-light-g>
 */
/// <reference path="../../../test.d.ts" />
import { should, use } from "chai";
import { spy } from "sinon";
import * as sinonChai from "sinon-chai";
import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import hook from "../../../common/helpers/cssModulesHook";
hook();
import { SourceEditMetaData, SourceEditMetaDataProps } from "./SourceEditMetaData";
import { Input, Button } from "react-toolbox";
should();
use(sinonChai);

describe("Source Edit Metadata component", () => {
    const source: Ropeho.Models.Source = {
        _id: "sourceId",
        posX: 0,
        posY: 0,
        zoom: 0
    };
    const setSourceSpy: sinon.SinonSpy = spy();
    const removeSourceSpy: sinon.SinonSpy = spy();
    const props: SourceEditMetaDataProps = {
        source,
        setSource: setSourceSpy,
        removeSource: removeSourceSpy
    };
    afterEach(() => setSourceSpy.reset());
    it("Should have an input for the X axis value", () => {
        const wrapper: ShallowWrapper<SourceEditMetaDataProps, {}> = shallow(<SourceEditMetaData {...props} />);
        const instance: SourceEditMetaData = wrapper.instance() as SourceEditMetaData;
        const input: ShallowWrapper<any, {}> = wrapper.find(Input).find({ label: "X" });
        input.should.have.lengthOf(1);
        input.prop("onChange").should.equal(instance.setPosX);
    });
    it("Should have an input for the Y axis value", () => {
        const wrapper: ShallowWrapper<SourceEditMetaDataProps, {}> = shallow(<SourceEditMetaData {...props} />);
        const instance: SourceEditMetaData = wrapper.instance() as SourceEditMetaData;
        const input: ShallowWrapper<any, {}> = wrapper.find(Input).find({ label: "Y" });
        input.should.have.lengthOf(1);
        input.prop("onChange").should.equal(instance.setPosY);
    });
    it("Should have an input for the zoom", () => {
        const wrapper: ShallowWrapper<SourceEditMetaDataProps, {}> = shallow(<SourceEditMetaData {...props} />);
        const instance: SourceEditMetaData = wrapper.instance() as SourceEditMetaData;
        const input: ShallowWrapper<any, {}> = wrapper.find(Input).find({ label: "Zoom" });
        input.should.have.lengthOf(1);
        input.prop("onChange").should.equal(instance.setZoom);
    });
    it("Should have a button to remove the source", () => {
        const wrapper: ShallowWrapper<SourceEditMetaDataProps, {}> = shallow(<SourceEditMetaData {...props} />);
        const instance: SourceEditMetaData = wrapper.instance() as SourceEditMetaData;
        const button: ShallowWrapper<any, {}> = wrapper.find(Button).find({ onClick: instance.removeSource });
        button.should.have.lengthOf(1);
    });
    it("Should set the production with the updated X axis value", () => {
        const wrapper: ShallowWrapper<SourceEditMetaDataProps, {}> = shallow(<SourceEditMetaData {...props} />);
        const instance: SourceEditMetaData = wrapper.instance() as SourceEditMetaData;
        const posX: string = "10";
        instance.setPosX(posX);
        setSourceSpy.should.have.been.calledWith({
            ...source,
            posX: 10
        });
    });
    it("Should set the production with the updated Y axis value", () => {
        const wrapper: ShallowWrapper<SourceEditMetaDataProps, {}> = shallow(<SourceEditMetaData {...props} />);
        const instance: SourceEditMetaData = wrapper.instance() as SourceEditMetaData;
        const posY: string = "10";
        instance.setPosY(posY);
        setSourceSpy.should.have.been.calledWith({
            ...source,
            posY: 10
        });
    });
    it("Should set the production with the updated zoom", () => {
        const wrapper: ShallowWrapper<SourceEditMetaDataProps, {}> = shallow(<SourceEditMetaData {...props} />);
        const instance: SourceEditMetaData = wrapper.instance() as SourceEditMetaData;
        const zoom: string = "10";
        instance.setZoom(zoom);
        setSourceSpy.should.have.been.calledWith({
            ...source,
            zoom: 10
        });
    });
    it("Should remove the source", () => {
        const wrapper: ShallowWrapper<SourceEditMetaDataProps, {}> = shallow(<SourceEditMetaData {...props} />);
        const instance: SourceEditMetaData = wrapper.instance() as SourceEditMetaData;
        instance.removeSource();
        removeSourceSpy.should.have.been.calledWith(source._id);
    });
});
