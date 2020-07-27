import React, { useEffect } from "react";
import styles from "./Dashboard.module.less";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "..";
import { getUser } from "../store/slices/user";
import { Typography, Row, Col, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getProfile } from "../store/slices/profile";
import { ReservationCard } from "../components/cards/ReservationCard";
import { LoanCard } from "../components/cards/LoanCard";
import CardContainer from "../components/cards/CardContainer";

export default function Dashboard() {
    const dispatch = useDispatch();
    const { user, profile } = useSelector((state: RootState) => ({ user: state.user, profile: state.profile }));
    //If User Profile Data not Cached, Fetch
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
                {(profile.data ? profile.data.reservations : []).map((reservation) => (
                    <ReservationCard {...reservation} key={reservation.id} />
                ))}
            </CardContainer>
        </div>
    );
}
