import React from "react";
import styles from "./CardContainer.module.less";
import { Row, Col } from "antd";
import { RowProps } from "antd/lib/row";

export default function CardContainer(props: RowProps) {
    return (
        <Row justify="center" {...props} className={[styles.container, props.className || ""].join(" ")}>
            {props.children}
            {Array(10)
                .fill(null)
                .map((_, i) => (
                    <Col className={styles.filler} key={i} />
                ))}
        </Row>
    );
}
