/**
 * @file Element that accepts a file or a URL to be used as a source
 * @author François Nguyen <https://github.com/lith-light-g>
 */
/// <reference path="../../typings.d.ts" />
import * as React from "react";
import { container, preview } from "./styles.css";
import { ErrorCodes } from "../../../enum";
import SourceInterfaceButtons from "../SourceInterfaceButtons";

export interface SourceInterfaceState {
    showForm?: boolean;
}

export interface SourceInterfaceProps {
    source?: Ropeho.Models.Source;
    setSrc?: (source: Ropeho.Models.Source, src: string) => any;
    setError?: (error: Ropeho.IErrorResponse) => any;
    isVideo?: boolean;
    selectSource?: (sourceId: string) => any;
    moveUp?: (sourceId: string) => any;
    moveDown?: (sourceId: string) => any;
}

export class SourceInterface extends React.Component<SourceInterfaceProps, SourceInterfaceState> {
    fileInput: HTMLInputElement;
    constructor(props: SourceInterfaceProps) {
        super(props);
        this.state = {
            showForm: false
        };
    }
    handleFileChange: () => void = (): void => {
        if (this.fileInput.files.length > 0) {
            const { setSrc, setError, isVideo, source }: SourceInterfaceProps = this.props;
            const file: File = this.fileInput.files[0];
            if (isVideo) {
                if (document.createElement("video").canPlayType(file.type)) {
                    setSrc(source, URL.createObjectURL(file));
                } else {
                    setError({
                        errorCode: ErrorCodes.InvalidRequest,
                        developerMessage: "Invalid video",
                        userMessage: "Ce fichier ne peut pas être utilisé comme vidéo"
                    });
                }
            } else {
                setSrc(source, URL.createObjectURL(file));
            }
        }
    }
    setFileInput: (input: HTMLInputElement) => void = (input: HTMLInputElement): void => {
        this.fileInput = input;
    }
    showFileBrowser: () => void = (): void => {
        this.fileInput.click();
    }
    componentDidMount(): void {
        this.fileInput.addEventListener("change", this.handleFileChange);
    }
    componentWillUnmount(): void {
        this.fileInput.removeEventListener("change", this.handleFileChange);
    }
    selectThisSource: () => void = (): void => {
        const { selectSource, source }: SourceInterfaceProps = this.props;
        selectSource(source._id);
    }
    moveDown: () => void = (): void => {
        const { moveDown, source }: SourceInterfaceProps = this.props;
        moveDown(source._id);
    }
    moveUp: () => void = (): void => {
        const { moveUp, source }: SourceInterfaceProps = this.props;
        moveUp(source._id);
    }
    render(): JSX.Element {
        const { source }: SourceInterfaceProps = this.props;
        return <div className={container}>
            <div role="img" onClick={this.showFileBrowser} className={preview}>
                <input type="file" style={{ display: "none" }} ref={this.setFileInput} />
                <p>+</p>
            </div>
            {
                source ?
                    <SourceInterfaceButtons onMoveDown={this.moveDown} onMoveUp={this.moveUp} onSelect={this.selectThisSource} /> : ""
            }
        </div>;
    }
}

export default SourceInterface;