/**
 * @file Element that displays an image. Zooms and moves the image accordingly to show only the relevant part
 * @author François Nguyen <https://github.com/lith-light-g>
 */
import * as React from "react";
import { MediaPreviewProps, mediaPreview } from "../MediaPreviewCore";
import { isEqual } from "lodash";

export class MediaPreviewImage extends React.Component<MediaPreviewProps, {}> {
    constructor(props?: MediaPreviewProps) {
        super(props);
    }
    componentWillMount(): void {
        const { noFit, shouldFit, scale, setScale }: MediaPreviewProps = this.props;
        if (noFit) {
            shouldFit(false);
        }
        if (typeof scale === "number" && isFinite(scale) && !isNaN(scale)) {
            setScale(scale);
        }
        this.loadSource();
    }
    componentWillReceiveProps(nextProps: MediaPreviewProps): void {
        const { noFit, source, shouldFit, scale, setScale }: MediaPreviewProps = this.props;
        if (source !== nextProps.source) {
            this.loadSource();
        }
        if (noFit !== nextProps.noFit) {
            shouldFit(!nextProps.noFit);
        }
        if (scale !== nextProps.scale && typeof nextProps.scale === "number" && isFinite(nextProps.scale) && !isNaN(nextProps.scale)) {
            setScale(nextProps.scale);
        }
    }
    shouldComponentUpdate(nextProps: MediaPreviewProps): boolean {
        return !isEqual(nextProps, this.props);
    }
    loadSource: () => void = (): void => {
        const { source, setDimensions }: MediaPreviewProps = this.props;
        if (source && setDimensions) {
            const imgElement: HTMLImageElement = new Image();
            imgElement.onload = () => {
                setDimensions(imgElement.width, imgElement.height);
            };
            imgElement.src = source.preview;
        }
    }
    render(): JSX.Element {
        const { source, computedHeight, computedWidth, offsetX, offsetY }: MediaPreviewProps = this.props;
        if (source) {
            return <div style={{
                background: `url(${source.preview}) ${offsetX * -1}px ${offsetY * -1}px / ${`${computedWidth}px` || "auto"} ${`${computedHeight}px` || "auto"} no-repeat`,
                width: "100%",
                height: "100%"
            }}></div>;
        } else {
            return null;
        }
    }
}

export default mediaPreview<MediaPreviewProps, {}>(MediaPreviewImage);
