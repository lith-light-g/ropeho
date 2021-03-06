/**
 * @file Tests for the MediaPreview components
 * @author François Nguyen <https://github.com/lith-light-g>
 */
/// <reference path="../../../test.d.ts" />
import { should, use } from "chai";
import { stub } from "sinon";
import * as sinonChai from "sinon-chai";
import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { MediaTypes, MediaPermissions } from "../../../enum";
import { v4 } from "uuid";
import hook from "../../helpers/cssModulesHook";
hook();
import { MediaPreview, MediaPreviewProps } from "./MediaPreview";
import MediaPreviewImage from "../MediaPreviewImage";
import MediaPreviewVideo from "../MediaPreviewVideo";
should();
use(sinonChai);

import Media = Ropeho.Models.Media;
import Source = Ropeho.Models.Source;

describe("MediaPreview", () => {
    const imageMedia: Media = {
        _id: v4(),
        delay: 0,
        description: "",
        sources: [{
            _id: v4(),
            fallback: "",
            fileSize: 0,
            posX: 0,
            posY: 0,
            preview: "imgPrev",
            src: "imgSrc",
            zoom: 1
        }],
        state: MediaPermissions.Public,
        type: MediaTypes.Image
    };
    const videoMedia: Media = {
        _id: v4(),
        delay: 0,
        description: "",
        sources: [{
            _id: v4(),
            fallback: "videoFallback",
            fileSize: 0,
            posX: 0,
            posY: 0,
            preview: "videoPrev",
            src: "videoSrc",
            zoom: 1
        }],
        state: MediaPermissions.Public,
        type: MediaTypes.Video
    };
    const slideshowMedia: Media = {
        _id: v4(),
        delay: 3,
        description: "",
        sources: [{
            _id: v4(),
            fallback: "",
            fileSize: 0,
            posX: 0,
            posY: 0,
            preview: "slidePrevA",
            src: "slideSrcA",
            zoom: 1
        }, {
            _id: v4(),
            fallback: "",
            fileSize: 0,
            posX: 0,
            posY: 0,
            preview: "slidePrevB",
            src: "slideSrcB",
            zoom: 1
        }],
        state: MediaPermissions.Public,
        type: MediaTypes.Slideshow
    };
    const textMedia: Media = {
        _id: v4(),
        delay: 3,
        description: "Just a well written text",
        sources: [],
        state: MediaPermissions.Public,
        type: MediaTypes.Text
    };
    it("Should use MediaPreviewImage if the media if of type Image", () => {
        const wrapper: ShallowWrapper<MediaPreviewProps, {}> = shallow(<MediaPreview media={imageMedia} />);
        wrapper.findWhere((mp: ShallowWrapper<any, any>) =>
            mp.type() === MediaPreviewImage && mp.prop("source") === wrapper.state("source")).should.have.lengthOf(1);
    });
    it("Should use MediaPreviewVideo if the media if of type Video", () => {
        const wrapper: ShallowWrapper<MediaPreviewProps, {}> = shallow(<MediaPreview media={videoMedia} />);
        wrapper.findWhere((mp: ShallowWrapper<any, any>) =>
            mp.type() === MediaPreviewVideo && mp.prop("source") === wrapper.state("source")).should.have.lengthOf(1);
    });
    it("Should use MediaPreviewImage if the media if of type Slideshow", () => {
        const wrapper: ShallowWrapper<MediaPreviewProps, {}> = shallow(<MediaPreview media={slideshowMedia} />);
        wrapper.setState({ source: slideshowMedia.sources[0] });
        wrapper.findWhere((mp: ShallowWrapper<any, any>) =>
            mp.type() === MediaPreviewImage && mp.prop("source") === wrapper.state("source")).should.have.lengthOf(1);
    });
    it("Should display the text if the media if of type text", () => {
        const wrapper: ShallowWrapper<MediaPreviewProps, {}> = shallow(<MediaPreview media={textMedia} />);
        wrapper.findWhere((mp: ShallowWrapper<any, any>) => {
            return mp.text() === textMedia.description;
        }).should.have.length.above(1);
    });
    describe("Slideshow interval", () => {
        it("Should set the current source to the next slideshow", () => {
            const wrapper: ShallowWrapper<MediaPreviewProps, {}> = shallow(<MediaPreview media={slideshowMedia} />);
            const instance: MediaPreview = wrapper.instance() as MediaPreview;
            instance.setCycle(1);
            instance.interval.should.be.ok;
        });
    });
    describe("Currently used source", () => {
        it("Should set the source of an image", () => {
            const wrapper: ShallowWrapper<MediaPreviewProps, {}> = shallow(<MediaPreview media={imageMedia} />);
            const instance: MediaPreview = wrapper.instance() as MediaPreview;
            const source: Source = imageMedia.sources[0];
            instance.cycleSource();
            wrapper.state("source").should.deep.equal(source);
        });
        it("Should set the source of a video", () => {
            const wrapper: ShallowWrapper<MediaPreviewProps, {}> = shallow(<MediaPreview media={videoMedia} />);
            const instance: MediaPreview = wrapper.instance() as MediaPreview;
            const source: Source = videoMedia.sources[0];
            instance.cycleSource();
            wrapper.state("source").should.deep.equal(source);
        });
        it("Should set the source to the next image of a slideshow", () => {
            const wrapper: ShallowWrapper<MediaPreviewProps, {}> = shallow(<MediaPreview media={slideshowMedia} />);
            const instance: MediaPreview = wrapper.instance() as MediaPreview;
            const [sourceA, sourceB]: Source[] = slideshowMedia.sources;
            wrapper.setState({
                source: sourceB
            });
            instance.cycleSource();
            wrapper.state("source").should.deep.equal(sourceA);
            instance.cycleSource();
            wrapper.state("source").should.deep.equal(sourceB);
        });
    });
    describe("Lifecycle", () => {
        it("Should set the source when mounting", () => {
            const wrapper: ShallowWrapper<MediaPreviewProps, {}> = shallow(<MediaPreview media={imageMedia} />);
            const instance: MediaPreview = wrapper.instance() as MediaPreview;
            const cycleSourceStub: sinon.SinonStub = stub(instance, "cycleSource");
            instance.componentWillMount();
            cycleSourceStub.should.have.been.calledOnce;
            cycleSourceStub.restore();
        });
        it("Should set interval after mounting", () => {
            const wrapper: ShallowWrapper<MediaPreviewProps, {}> = shallow(<MediaPreview media={slideshowMedia} />);
            const instance: MediaPreview = wrapper.instance() as MediaPreview;
            const setCycleStub: sinon.SinonStub = stub(instance, "setCycle");
            instance.componentDidMount();
            setCycleStub.should.have.been.calledOnce;
            setCycleStub.restore();
        });
        it("Should set the source when receiving props for an image or a video", () => {
            const wrapper: ShallowWrapper<MediaPreviewProps, {}> = shallow(<MediaPreview media={imageMedia} />);
            const instance: MediaPreview = wrapper.instance() as MediaPreview;
            const cycleSourceStub: sinon.SinonStub = stub(instance, "cycleSource");
            instance.componentWillReceiveProps({
                media: {
                    type: MediaTypes.Image,
                    sources: imageMedia.sources
                }
            });
            cycleSourceStub.should.have.been.calledOnce;
            cycleSourceStub.restore();
        });
        it("Should clear the interval when unmounting", () => {
            const wrapper: ShallowWrapper<MediaPreviewProps, {}> = shallow(<MediaPreview media={slideshowMedia} />);
            const instance: MediaPreview = wrapper.instance() as MediaPreview;
            instance.componentWillUnmount();
            should().not.exist(instance.interval);
        });
    });
});
