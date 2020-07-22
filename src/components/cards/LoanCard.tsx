import { Loan } from "../../store/api/Loan";
import React, { useState } from "react";
import moment from "moment";
import { Button, Typography, Modal } from "antd";
import Card from "./Card";
import { EyeOutlined, LogoutOutlined } from "@ant-design/icons";
import styles from "./LoanCard.module.less";
import { Link } from "react-router-dom";
import URLSafe from "../URLSafe";

enum LoanStatus {
    ACTIVE = "Active",
    RETURNED = "Returned",
    OVERDUE = "Overdue"
}

export function LoanCard(props: Loan) {
    const [details, setDetails] = useState(false);
    const toggleDetails = () => {
        setDetails(!details);
    };
    let status = LoanStatus.ACTIVE;
    if (props.returned) status = LoanStatus.RETURNED;
    if (moment(props.borrowed).add(14, "days").isBefore(Date.now())) status = LoanStatus.OVERDUE;
    return (
        <>
            <Card
                name={props.item.name}
                image={props.item.image}
                actions={[
                    <Button type="ghost" icon={<EyeOutlined />} className={styles.action} onClick={toggleDetails}>
                        Details
                    </Button>,
                    <Button type="ghost" icon={<LogoutOutlined />} className={styles.action}>
                        Return
                    </Button>
                ]}
                details={
                    <div className={styles.info}>
                        <Typography.Text>
                            <Typography.Text strong>Quantity:</Typography.Text> {props.quantity}
                        </Typography.Text>
                        <Typography.Text>
                            <Typography.Text strong>Due: </Typography.Text>
                            {moment(props.borrowed).add(14, "days").fromNow()}
                        </Typography.Text>
                    </div>
                }
                overlay={status === LoanStatus.OVERDUE ? "rgba(255,0,0,0.2)" : undefined}
            />
            <Modal
                title="Loan Details"
                visible={details}
                onCancel={toggleDetails}
                onOk={toggleDetails}
                footer={[
                    <Button type="primary" onClick={toggleDetails}>
                        Hide Details
                    </Button>
                ]}>
                <Typography.Text>
                    <Typography.Text strong>ID: </Typography.Text> {props.id}
                    <br />
                    <Typography.Text strong>Item: </Typography.Text>{" "}
                    <Link to={`/items/${props.item.id}/${URLSafe(props.item.name)}`}>{props.item.name}</Link>
                    <br />
                    <Typography.Text strong>Quantity: </Typography.Text> {props.quantity}
                    <br />
                    <Typography.Text strong>Note: </Typography.Text> {props.note || "No note recorded"}
                    <br />
                    <Typography.Text strong>Status: </Typography.Text> {status}
                    <br />
                    <Typography.Text strong>Borrowed: </Typography.Text>{" "}
                    {moment(props.borrowed).format("h:mma, Do MMM, YYYY")}
                    <br />
                    <Typography.Text strong>Returned: </Typography.Text>{" "}
                    {props.returned ? moment(props.returned).format("h:mma, Do MMM, YYYY") : "Not returned"}
                    <br />
                </Typography.Text>
            </Modal>
        </>
    );
}
