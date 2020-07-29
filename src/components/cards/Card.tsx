import React from "react";
import { Card as AntCard, Col, Button } from "antd";
import styles from "./Card.module.less";
import logo from "../../images/logo.svg";
import { EditOutlined } from "@ant-design/icons";
import URLSafe from "../URLSafe";
import { Link } from "react-router-dom";

export default function Card(props: {
    name: string;
    image?: string;
    actions?: React.ReactNode[];
    details?: React.ReactNode;
    overlay?: string;
    editable?: number;
    disabled?: boolean;
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
                <AntCard.Meta
                    title={
                        <div className={styles.title}>
                            {props.name}
                            {!!props.editable && (
                                <Link to={`/admin/edit-item/${props.editable}/${URLSafe(props.name)}`}>
                                    <Button type="ghost" icon={<EditOutlined />} className={styles.edit}/>
                                </Link>
                            )}
                        </div>
                    }></AntCard.Meta>
                {props.details}
                {props.overlay ? <div className={styles.overlay} style={{ backgroundColor: props.overlay }} /> : null}
                {props.disabled ? <div className={styles.disabled} /> : null}
            </AntCard>
        </Col>
    );
}
