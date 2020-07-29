import React from "react";
import styles from "./Loading.module.less";
import { Spin } from "antd";

export default function Loading(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
    return (
        <div {...props} className={[styles.loading, props.className || ""].join(" ")}>
            <Spin size={"large"} />
        </div>
    );
}
