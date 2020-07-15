import React from "react";
import { Card as AntCard, Col } from "antd";
import styles from "./Card.module.less";
import logo from "../images/logo.svg";

export default function Card(props: {
    name: string,
    image?: string,
    actions?: React.ReactNode[],
    details?: React.ReactNode,
    overlay?: string
}) {
    return (
        <Col className={styles.col}>
            <AntCard
                size="small"
                className={styles.card}
                cover={
                    <div
                        style={{
                            backgroundImage: `url(https://makerhive.anga.blue/static/images/item/${props.image}-thumb.jpg),
                            url(${logo})`
                        }}
                        className={styles.image}
                    />
                }
                actions={props.actions}>
                <AntCard.Meta title={props.name}></AntCard.Meta>
                {props.details}
                {props.overlay ? <div className={styles.overlay} style={{backgroundColor: props.overlay}}/> : null }
            </AntCard>
        </Col>
    );
}
