import React, { useState } from "react";
import { Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { UploadFile, UploadChangeParam } from "antd/lib/upload/interface";
import styles from "./ImageUpload.module.less";

export type UploadStateType = File | null;

export default function ImageUpload(props: {
    image: UploadStateType;
    setImage: React.Dispatch<React.SetStateAction<UploadStateType>>;
}) {
    const [fileList, setFileList] = useState([] as UploadFile<any>[]);
    const onRemove = () => {
        props.setImage(null);
    };
    const beforeUpload = (file: UploadFile) => {
        props.setImage((file as unknown) as File);
        return false;
    };

    const onChange = (info: UploadChangeParam<UploadFile<any>>) => {
        if (info.file.status !== "removed") {
            setFileList([info.file]);
        } else {
            setFileList([]);
        }
    };
    return (
        <Upload.Dragger
            onRemove={onRemove}
            beforeUpload={beforeUpload}
            onChange={onChange}
            fileList={fileList}
            accept="image/jpeg, image/png;capture=camera">
            {props.image ? (
                <img src={(window.URL || window.webkitURL).createObjectURL(props.image)} alt={props.image.name} className={styles.image} />
            ) : (
                <>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Please upload landscape images as portrait images will be cropped into the correct aspect ratio.
                    </p>
                </>
            )}
        </Upload.Dragger>
    );
}
