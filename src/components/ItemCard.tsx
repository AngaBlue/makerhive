import React from "react";
import { Card, Col, Button, Typography } from "antd";
import { Item } from "../store/api/Item";
import styles from "./ItemCard.module.less";
import { EyeOutlined, LogoutOutlined } from "@ant-design/icons";

export default function ItemCard(props: Item) {
    return (
        <Col className={styles.col}>
            <Card
                size="small"
                className={styles.card}
                cover={
                    <div
                        style={{
                            backgroundImage: `url(https://makerhive.anga.blue/static/images/item/${props.image}-thumb.jpg)`
                        }}
                        className={styles.image}
                    />
                }
                actions={[
                    <Button type="ghost" icon={<EyeOutlined />} className={styles.action}>
                        Details
                    </Button>,
                    <Button type="ghost" icon={<LogoutOutlined />} className={styles.action}>
                        Borrow
                    </Button>
                ]}>
                <Card.Meta title={props.name}></Card.Meta>
                <div className={styles.info}>
                    <Typography.Text>
                        <Typography.Text strong>Quantity:</Typography.Text> {props.quantity}
                    </Typography.Text>
                    <Typography.Text>
                        <Typography.Text strong>Available:</Typography.Text> {props.available}
                    </Typography.Text>
                    <Typography.Text className={styles.location}>
                        <Typography.Text strong>Location:</Typography.Text> {props.location || "Unknown"}
                    </Typography.Text>
                </div>
            </Card>
        </Col>
    );
}
