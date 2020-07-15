import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.less";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "..";
import { getUser } from "../store/slices/user";
import { Typography, Row, Col, Avatar, Modal, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getProfile } from "../store/slices/profile";
import CardContainer from "../components/CardContainer";
import moment from "moment";
import Card from "../components/Card";
import { Loan } from "../store/api/Loan";
import { EyeOutlined, LogoutOutlined } from "@ant-design/icons";

export default function Dashboard() {
    const dispatch = useDispatch();
    const { user, profile } = useSelector((state: RootState) => ({ user: state.user, profile: state.profile }));
    useEffect(() => {
        if (!user.loading) dispatch(getUser({ throttle: { requested: user.requested, timeout: 5 * 60 * 1000 } }));
        else {
            if (user.data && !profile.loading)
                dispatch(
                    getProfile({
                        payload: user.data.id,
                        throttle: { requested: profile.requested, timeout: 60 * 1000 }
                    })
                );
        }
    });
    if (!user.data) return null;
    return (
        <div className={styles.main}>
            <Row className={styles.user} align="middle" justify="space-between">
                <Col>
                    <Typography.Title level={2}>{user.data.name}</Typography.Title>
                    <Typography.Paragraph>{user.data.email}</Typography.Paragraph>
                    <Typography.Paragraph>{user.data.rank.name}</Typography.Paragraph>
                </Col>
                <Col>
                    <Avatar
                        src={`https://makerhive.anga.blue/static/images/user/${user.data.image}.jpg`}
                        icon={<UserOutlined />}
                        size={128}
                    />
                </Col>
            </Row>
            <Typography.Title level={2}>Loans</Typography.Title>
            <CardContainer className={styles.loans}>
                {(profile.data ? profile.data.loans : []).map((loan) => (
                    <LoanCard {...loan} key={loan.id} />
                ))}
            </CardContainer>
            <Typography.Title level={2}>Reservations</Typography.Title>
            <CardContainer>
                {(profile.data ? profile.data.loans : []).map((loan) => (
                    <LoanCard {...loan} key={loan.id} />
                ))}
            </CardContainer>
        </div>
    );
}

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
                    <Typography.Text strong>Item: </Typography.Text> {props.item.name}
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
