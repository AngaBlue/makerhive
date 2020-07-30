import React, { useEffect } from "react";
import styles from "./Dashboard.module.less";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "..";
import { getUser } from "../store/slices/user";
import { Typography, Row, Col, Avatar, Result, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getProfile } from "../store/slices/profile";
import { ReservationCard } from "../components/cards/ReservationCard";
import { LoanCard } from "../components/cards/LoanCard";
import CardContainer from "../components/cards/CardContainer";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import { UserProfile } from "../store/api/User";
import { AsyncState } from "../store/AsyncState";

export default function Dashboard(props: { profile?: AsyncState<UserProfile | null> }) {
    const dispatch = useDispatch();
    const breakpoints = useBreakpoint();
    const { user, profileState } = useSelector((state: RootState) => ({
        user: state.user,
        profileState: state.profile
    }));
    //If User Profile Data not Cached, Fetch
    let profile = props.profile ? props.profile : profileState;
    useEffect(() => {
        if (!user.loading) dispatch(getUser({ throttle: { requested: user.requested, timeout: 5 * 60 * 1000 } }));
        //Don't Fetch If Profile Props is Being Used
        if (user.data && (props.profile ? false : !profile.loading)) {
            dispatch(
                getProfile({
                    payload: user.data.id,
                    throttle: { requested: profile.requested, timeout: 30 * 1000 }
                })
            );
        }
    });
    if (!user.data) return null;
    return (
        <div className={styles.main}>
            <Row className={styles.user} align="middle" justify="space-between">
                <Col>
                    <Typography.Title>
                        {props.profile
                            ? profile.data
                                ? profile.data.name
                                : "Loading..."
                            : profile.data
                            ? profile.data.name
                            : user.data.name}
                    </Typography.Title>
                    <Typography.Paragraph>
                        {props.profile
                            ? profile.data
                                ? profile.data.email
                                : "Loading..."
                            : profile.data
                            ? profile.data.email
                            : user.data.email}
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                        {props.profile
                            ? profile.data
                                ? profile.data.rank.name
                                : "Loading..."
                            : profile.data
                            ? profile.data.rank.name
                            : user.data.rank.name}
                    </Typography.Paragraph>
                </Col>
                {breakpoints.sm && (
                    <Col>
                        <Avatar
                            src={`https://makerhive.anga.blue/static/images/user/${props.profile ? profile.data ? profile.data.image : "loading" : profile.data ? profile.data.image : user.data.image }.jpg`}
                            icon={<UserOutlined />}
                            size={128}
                        />
                    </Col>
                )}
            </Row>
            <Typography.Title level={2}>Loans</Typography.Title>
            {profile.data ? (
                profile.data.loans.length > 0 ? (
                    <CardContainer className={styles.loans}>
                        {profile.data.loans.map((loan) => (
                            <LoanCard {...loan} key={loan.id} />
                        ))}
                    </CardContainer>
                ) : (
                    <Result
                        title="No loans yet"
                        extra={
                            <Link to="/">
                                <Button>Browse Items</Button>
                            </Link>
                        }
                    />
                )
            ) : (
                <Loading className={styles.loading} />
            )}
            <Typography.Title level={2}>Reservations</Typography.Title>
            {profile.data ? (
                profile.data.reservations.length > 0 ? (
                    profile.data.reservations.map((reservation) => (
                        <CardContainer className={styles.reservations}>
                            <ReservationCard {...reservation} key={reservation.id} />
                        </CardContainer>
                    ))
                ) : (
                    <Result
                        title="No reservations yet"
                        extra={
                            <Link to="/">
                                <Button>Browse Items</Button>
                            </Link>
                        }
                    />
                )
            ) : (
                <Loading className={styles.loading} />
            )}
        </div>
    );
}
