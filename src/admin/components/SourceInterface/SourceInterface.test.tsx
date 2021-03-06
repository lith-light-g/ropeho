/**
 * @file Tests for the SourceInterface component
 * @author François Nguyen <https://github.com/lith-light-g>
 */
/// <reference path="../../../test.d.ts" />
import { should, use } from "chai";
import { spy } from "sinon";
import * as sinonChai from "sinon-chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import hook from "../../../common/helpers/cssModulesHook";
hook();
import { SourceInterfaceProps, default as SourceInterface } from "./SourceInterface";
import SourceInterfaceButtons from "../SourceInterfaceButtons";
import MediaPreviewImage from "../../../common/components/MediaPreviewImage";
import MediaPreviewVideo from "../../../common/components/MediaPreviewVideo";
should();
use(sinonChai);

describe("Source interface component", () => {
    describe("Main element", () => {
        it("Should display the image source passed as props", () => {
            const wrapper: ShallowWrapper<SourceInterfaceProps, {}> = shallow(<SourceInterface source={{ _id: "sourceId" }} />);
            wrapper.find(MediaPreviewImage).should.have.lengthOf(1);
        });
        it("Should display the video source passed as props", () => {
            const wrapper: ShallowWrapper<SourceInterfaceProps, {}> = shallow(<SourceInterface source={{ _id: "sourceId" }} isVideo />);
            wrapper.find(MediaPreviewVideo).should.have.lengthOf(1);
        });
        it("Should have a file input", () => {
            const wrapper: ShallowWrapper<SourceInterfaceProps, {}> = shallow(<SourceInterface />);
            wrapper.find("input").find({ type: "file" }).should.have.lengthOf(1);
        });
        it("Should have an onClick handler", () => {
            const wrapper: ShallowWrapper<SourceInterfaceProps, {}> = shallow(<SourceInterface />);
            const instance: SourceInterface = wrapper.instance() as SourceInterface;
            wrapper.find("div").find({ onClick: instance.showFileBrowser }).should.have.lengthOf(1);
        });
        it("Should show buttons to edit the source", () => {
            const wrapper: ShallowWrapper<SourceInterfaceProps, {}> = shallow(<SourceInterface source={{ _id: "sourceId" }} />);
            wrapper.find(SourceInterfaceButtons).should.have.lengthOf(1);
        });
        it("Should not show buttons to edit the source if there is no source", () => {
            const wrapper: ShallowWrapper<SourceInterfaceProps, {}> = shallow(<SourceInterface source={undefined} />);
            wrapper.find(SourceInterfaceButtons).should.have.lengthOf(0);
        });
        it("Should have be a drop target");
    });
    describe("Methods", () => {
        it("Should set the input property", () => {
            const wrapper: ShallowWrapper<SourceInterfaceProps, {}> = shallow(<SourceInterface />);
            const instance: SourceInterface = wrapper.instance() as SourceInterface;
            const input: HTMLInputElement = document.createElement("input");
            instance.setFileInput(input);
            instance.fileInput.should.equal(input);
        });
        it("Should show the file browser", () => {
            const clickSpy: sinon.SinonSpy = spy();
            const wrapper: ShallowWrapper<SourceInterfaceProps, {}> = shallow(<SourceInterface />);
            const instance: SourceInterface = wrapper.instance() as SourceInterface;
            instance.setFileInput({
                click: clickSpy
            } as any);
            instance.showFileBrowser();
            clickSpy.should.have.been.calledOnce;
        });
        it("Should set the src with the new file", () => {
            const setSrcSpy: sinon.SinonSpy = spy();
            const setFileSpy: sinon.SinonSpy = spy();
            const objectURL: string = "blob:http//localhost/aNiceFile";
            const createObjectURLSpy: sinon.SinonSpy = spy((file: File) => objectURL);
            const file: File = new File([new ArrayBuffer(100)], "file.jpeg", {
                type: "image/jpeg"
            });
            const wrapper: ShallowWrapper<SourceInterfaceProps, {}> = shallow(<SourceInterface setSrc={setSrcSpy} setFile={setFileSpy} />);
            const instance: SourceInterface = wrapper.instance() as SourceInterface;
            instance.setFileInput({
                files: [file]
            } as any);
            const originalCreateObjectURL: any = URL.createObjectURL;
            URL.createObjectURL = createObjectURLSpy;
            instance.handleFileChange();
            setSrcSpy.should.have.been.calledOnce;
            setSrcSpy.should.have.been.calledWith(undefined, objectURL);
            setFileSpy.should.have.been.calledOnce;
            setFileSpy.should.have.been.calledWith(objectURL, file);
            createObjectURLSpy.should.have.been.calledOnce;
            createObjectURLSpy.should.have.been.calledWith(file);
            URL.createObjectURL = originalCreateObjectURL;
        });
        it("Should set the source to edit", () => {
            const selectSourceSpy: sinon.SinonSpy = spy();
            const wrapper: ShallowWrapper<SourceInterfaceProps, {}> = shallow(<SourceInterface
                selectSource={selectSourceSpy}
                source={{ _id: "sourceId" }}
            />);
            const instance: SourceInterface = wrapper.instance() as SourceInterface;
            instance.selectThisSource();
            selectSourceSpy.should.have.been.calledOnce;
            selectSourceSpy.should.have.been.calledWith("sourceId");
        });
        it("Should move the source up a position", () => {
            const moveUpSpy: sinon.SinonSpy = spy();
            const wrapper: ShallowWrapper<SourceInterfaceProps, {}> = shallow(<SourceInterface
                moveUp={moveUpSpy}
                source={{ _id: "sourceId" }}
            />);
            const instance: SourceInterface = wrapper.instance() as SourceInterface;
            instance.moveUp();
            moveUpSpy.should.have.been.calledOnce;
            moveUpSpy.should.have.been.calledWith("sourceId");
        });
        it("Should move the source down a position", () => {
            const moveDownSpy: sinon.SinonSpy = spy();
            const wrapper: ShallowWrapper<SourceInterfaceProps, {}> = shallow(<SourceInterface
                moveDown={moveDownSpy}
                source={{ _id: "sourceId" }}
            />);
            const instance: SourceInterface = wrapper.instance() as SourceInterface;
            instance.moveDown();
            moveDownSpy.should.have.been.calledOnce;
            moveDownSpy.should.have.been.calledWith("sourceId");
        });
        describe("Lifecycle", () => {
            it("Should add the handler to the file input", () => {
                const addEventListenerSpy: sinon.SinonSpy = spy();
                const wrapper: ShallowWrapper<SourceInterfaceProps, {}> = shallow(<SourceInterface />);
                const instance: SourceInterface = wrapper.instance() as SourceInterface;
                instance.setFileInput({
                    addEventListener: addEventListenerSpy
                } as any);
                instance.componentDidMount();
                addEventListenerSpy.should.have.been.calledOnce;
                addEventListenerSpy.should.have.been.calledWith("change", instance.handleFileChange);
            });
            it("Should remove the handler from the file input", () => {
                const removeEventListenerSpy: sinon.SinonSpy = spy();
                const wrapper: ShallowWrapper<SourceInterfaceProps, {}> = shallow(<SourceInterface />);
                const instance: SourceInterface = wrapper.instance() as SourceInterface;
                instance.setFileInput({
                    removeEventListener: removeEventListenerSpy
                } as any);
                instance.componentWillUnmount();
                removeEventListenerSpy.should.have.been.calledOnce;
                removeEventListenerSpy.should.have.been.calledWith("change", instance.handleFileChange);
            });
        });
    });
});
