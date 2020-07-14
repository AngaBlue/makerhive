import React from "react";
import { Card, Col, Button, Typography } from "antd";
import styles from "./ItemCard.module.less";
import { EyeOutlined, LogoutOutlined } from "@ant-design/icons";
import { Loan } from "../store/api/Loan";

export default function LoanCard(props: Loan) {
    return (
        <Col className={styles.col}>
            <Card
                size="small"
                className={styles.card}
                cover={
                    <div
                        style={{
                            backgroundImage: `url(https://makerhive.anga.blue/static/images/item/${props.item.image}-thumb.jpg)`
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
                <Card.Meta title={props.item.name}></Card.Meta>
                <div className={styles.info}>
                    <Typography.Text>
                        <Typography.Text strong>Quantity:</Typography.Text> {props.item.quantity}
                    </Typography.Text>
                    <Typography.Text>
                        <Typography.Text strong>Available:</Typography.Text> {props.item.available}
                    </Typography.Text>
                    <Typography.Text className={styles.location}>
                        <Typography.Text strong>Location:</Typography.Text> {props.item.location || "Unknown"}
                    </Typography.Text>
                </div>
            </Card>
        </Col>
    );
}
