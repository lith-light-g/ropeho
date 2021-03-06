/**
 * @file Tests for the MediaPreviewImage component
 * @author François Nguyen <https://github.com/lith-light-g>
 */
/// <reference path="../../../test.d.ts" />
import { should, use } from "chai";
import { stub, spy } from "sinon";
import * as sinonChai from "sinon-chai";
import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { MediaPreviewImage } from "./MediaPreviewImage";
import { MediaPreviewProps } from "../MediaPreviewCore";
import { image } from "../../../sampleData/testMedias";
should();
use(sinonChai);

describe("MediaPreviewImage component", () => {
    describe("Source handler", () => {
        it("Should set a source's dimensions", (done: MochaDone) => {
            const setDimensionsSpy: sinon.SinonSpy = spy(() => done());
            const wrapper: ShallowWrapper<MediaPreviewProps, {}> = shallow(<MediaPreviewImage
                source={{ _id: "sourceId", posX: 0, posY: 0, zoom: 0, preview: `data:image/png;base64, ${image}` }}
                setDimensions={setDimensionsSpy}
            />);
            const instance: MediaPreviewImage = wrapper.instance() as MediaPreviewImage;
            instance.imageElement = document.createElement("img");
            instance.loadSource();
        });
    });
    describe("Lifecycle", () => {
        it("Should set source dimensions after mounting", () => {
            const wrapper: ShallowWrapper<MediaPreviewProps, {}> = shallow(<MediaPreviewImage />);
            const instance: MediaPreviewImage = wrapper.instance() as MediaPreviewImage;
            const loadSourceStub: sinon.SinonStub = stub(instance, "loadSource");
            instance.componentDidMount();
            loadSourceStub.should.have.been.calledOnce;
        });
        it("Should set source dimensions when receiving a new source", () => {
            const wrapper: ShallowWrapper<MediaPreviewProps, {}> = shallow(<MediaPreviewImage source={{ _id: "sourceId" }} />);
            const instance: MediaPreviewImage = wrapper.instance() as MediaPreviewImage;
            const loadSourceStub: sinon.SinonStub = stub(instance, "loadSource");
            instance.componentWillReceiveProps({ source: { _id: "anotherSourceId", posX: 0, posY: 0, preview: "", zoom: 1 } });
            loadSourceStub.should.have.been.calledOnce;
        });
        it("Should disable auto zoom when mounting with noFit", () => {
            const shouldFitSpy: sinon.SinonSpy = spy();
            shallow(<MediaPreviewImage shouldFit={shouldFitSpy} noFit />);
            shouldFitSpy.should.have.been.calledOnce;
            shouldFitSpy.should.have.been.calledWith(false);
        });
        it("Should set auto zoom when updating with a new noFit value", () => {
            const shouldFitSpy: sinon.SinonSpy = spy();
            const wrapper: ShallowWrapper<MediaPreviewProps, {}> = shallow(<MediaPreviewImage shouldFit={shouldFitSpy} source={{ _id: "sourceId" }} />);
            const instance: MediaPreviewImage = wrapper.instance() as MediaPreviewImage;
            instance.componentWillReceiveProps({ noFit: true, source: {} });
            shouldFitSpy.should.have.been.calledOnce;
            shouldFitSpy.should.have.been.calledWith(false);
        });
        it("Should set the element zoom when mounting", () => {
            const setScaleSpy: sinon.SinonSpy = spy();
            shallow(<MediaPreviewImage setScale={setScaleSpy} scale={0.5} />);
            setScaleSpy.should.have.been.calledOnce;
            setScaleSpy.should.have.been.calledWith(0.5);
        });
        it("Should set the element zoom value when updating with a new scale value", () => {
            const setScaleSpy: sinon.SinonSpy = spy();
            const wrapper: ShallowWrapper<MediaPreviewProps, {}> = shallow(<MediaPreviewImage setScale={setScaleSpy} source={{ _id: "sourceId" }} />);
            const instance: MediaPreviewImage = wrapper.instance() as MediaPreviewImage;
            instance.componentWillReceiveProps({ scale: 0.5, source: {} });
            setScaleSpy.should.have.been.calledOnce;
            setScaleSpy.should.have.been.calledWith(0.5);
        });
    });
});
