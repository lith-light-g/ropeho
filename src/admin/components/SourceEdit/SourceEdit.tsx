/**
 * @file Source edit component
 * @author François Nguyen <https://github.com/lith-light-g>
 */
/// <reference path="../../typings.d.ts" />
import * as React from "react";
import { SourceEditMetaData } from "../SourceEditMetaData";
import MediaPreviewImage from "../MediaPreviewImage";
import MediaPreviewVideo from "../MediaPreviewVideo";
import MediaPreviewPointer from "../MediaPreviewPointer";
import { MediaTypes } from "../../../enum";
import { sourcePreview } from "./styles.css";

import Source = Ropeho.Models.Source;

export interface SourceEditProps {
    source?: Source;
    setSource?: (source: Source) => any;
    type?: MediaTypes;
}

export class SourceEdit extends React.Component<SourceEditProps, {}> {
    constructor(props: SourceEditProps) {
        super(props);
    }
    render(): JSX.Element {
        const { source, setSource, type }: SourceEditProps = this.props;
        if (source && source._id) {
            let mediaPreview: JSX.Element;
            switch (type) {
                case MediaTypes.Image:
                    mediaPreview = <MediaPreviewImage source={source} />;
                    break;
                case MediaTypes.Video:
                    mediaPreview = <MediaPreviewVideo source={source} />;
                    break;
                case MediaTypes.Slideshow:
                    break;
            }
            return <div>
                {
                    mediaPreview ? <div className={sourcePreview}>
                        {mediaPreview}
                        <MediaPreviewPointer source={source} type={type} setSource={setSource} />
                    </div> : ""
                }
                <SourceEditMetaData source={source} setSource={setSource} />
            </div>;
        } else {
            return <div></div>;
        }
    }
}

export default SourceEdit;
