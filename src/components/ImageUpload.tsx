import React, { useState } from "react";
import { Upload, Typography } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { UploadFile, UploadChangeParam } from "antd/lib/upload/interface";
import styles from "./ImageUpload.module.less";

export type UploadStateType = File | null;

//Image Upload Component used in Add Item + Edit item
//Extends Functionality of antd image uploader, providing an image preview, default image, and upload tips.

export default function ImageUpload(props: {
    image: UploadStateType;
    setImage: React.Dispatch<React.SetStateAction<UploadStateType>>;
    default?: {
        name: string;
        url: string;
    };
}) {
    const [fileList, setFileList] = useState([] as UploadFile<any>[]);
    const onRemove = () => {
        props.setImage(null);
    };
    const beforeUpload = (file: UploadFile) => {
        props.setImage((file as unknown) as File);
        return false;
    };

    //Update stored image when Uploader status changes
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
            accept="image/jpeg, image/png;capture=camera"
            className={styles.upload}>
            {props.image || props.default ? (
                //If Image Present
                <>
                    <img
                        src={
                            props.image
                                ? (window.URL || window.webkitURL).createObjectURL(props.image)
                                : props.default?.url
                        }
                        alt={props.image ? props.image.name : props.default?.name}
                        className={styles.image}
                    />
                    <Typography.Paragraph style={{ margin: 0 }}>
                        Click to replace image. All images will be cropped to the 4:3 aspect ratio.
                    </Typography.Paragraph>
                </>
            ) : (
                //If Image not Present
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
