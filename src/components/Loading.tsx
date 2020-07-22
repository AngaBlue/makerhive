import React from "react";
import styles from "./Loading.module.less";
import { Spin } from "antd";

export default function Loading() {
    return (
        <div className={styles.loading}>
            <Spin size={"large"} style={{ height: "128px" }} />
        </div>
    );
}
