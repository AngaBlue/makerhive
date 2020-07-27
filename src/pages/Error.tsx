import React from "react";
import { Typography } from "antd";
import styles from "./Error.module.less";

export default function Error(error: { name: string; message: string }) {
    return (
        <div className={styles.main}>
            <Typography.Title>{error.name}</Typography.Title>
            <Typography.Text>{error.message}</Typography.Text>
        </div>
    );
}
