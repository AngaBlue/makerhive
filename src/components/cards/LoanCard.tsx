import { Loan, returnLoan } from "../../store/api/Loan";
import React, { useState } from "react";
import moment from "moment";
import { Button, Typography, Modal, Popconfirm, notification } from "antd";
import Card from "./Card";
import { EyeOutlined, LogoutOutlined, LoadingOutlined } from "@ant-design/icons";
import styles from "./LoanCard.module.less";
import { Link } from "react-router-dom";
import URLSafe from "../URLSafe";
import GhostButton from "../GhostButton";

enum LoanStatus {
    ACTIVE = "Active",
    RETURNED = "Returned",
    OVERDUE = "Overdue"
}

export function LoanCard(props: Loan & { remove(id: number): any }) {
    const [details, setDetails] = useState(false);
    const [state, setState] = useState({
        loading: false
    });
    const toggleDetails = () => {
        setDetails(!details);
    };
    const returnConfirm = async () => {
        setState({ loading: true });
        const response = await returnLoan(props.id);
        setState({ loading: false });
        if (!response.error) {
            notification.success({ placement: "bottomRight", message: "Loan Returned" });
            props.remove(props.id);
        }
    };
    let status = LoanStatus.ACTIVE;
    if (props.returned) status = LoanStatus.RETURNED;
    if (moment(props.borrowed).add(14, "days").isBefore(Date.now())) status = LoanStatus.OVERDUE;
    return (
        <>
            <Card
                name={props.item.name}
                image={props.item.image}
                url={`/items/${props.item.id}/${URLSafe(props.item.name)}`}
                actions={[
                    <GhostButton icon={<EyeOutlined />} className={styles.action} onClick={toggleDetails}>
                        Details
                    </GhostButton>,
                    <Popconfirm
                        title="Are you sure want to mark this loan as returned?"
                        onConfirm={returnConfirm}
                        okText="Yes"
                        cancelText="No">
                        <GhostButton
                            icon={state.loading ? <LoadingOutlined /> : <LogoutOutlined />}
                            className={styles.action}>
                            Return
                        </GhostButton>
                    </Popconfirm>
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
                disabled={state.loading}
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
