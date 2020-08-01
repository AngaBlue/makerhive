import React from "react";
import styles from "./CardContainer.module.less";
import { Row, Col, Result } from "antd";
import { RowProps } from "antd/lib/row";
import Card from "./Card";

export default function CardContainer(props: RowProps & { children: ReturnType<typeof Card>[] }) {
    if (props.children.length === 0) return <Result title="Nothing here yet" />;
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
