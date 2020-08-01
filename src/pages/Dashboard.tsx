import React, { useEffect } from "react";
import styles from "./Dashboard.module.less";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "..";
import { getUser } from "../store/slices/user";
import { Typography, Row, Col, Avatar, Result, Button, Space } from "antd";
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
import GhostButton from "../components/GhostButton";
import { EditOutlined, ReloadOutlined } from "@ant-design/icons";
import URLSafe from "../components/URLSafe";

export default function Dashboard(props: {
    profile: AsyncState<UserProfile | null>;
    removeReservation?(id: number): any;
    removeLoan?(id: number): any;
    refresh?(): any;
}) {
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

    const removeReservation = (id: number) =>
        dispatch({
            type: "profile/removeReservation",
            payload: id
        });

    const removeLoan = (id: number) =>
        dispatch({
            type: "profile/removeLoan",
            payload: id
        });

    const refresh = () => {
        if (props.refresh) return props.refresh();
        if (user.data)
            dispatch(
                getProfile({
                    payload: user.data.id
                })
            );
    };

    if (!user.data) return null;
    let data = props.profile
        ? props.profile.data
            ? props.profile.data
            : { name: "Loading...", id: 0, image: "Loading...", email: "Loading...", rank: { name: "Loading" } }
        : profile.data
        ? profile.data
        : user.data;
    return (
        <div className={styles.main}>
            <Row className={styles.user} align="middle" justify="space-between">
                <Col>
                    <Typography.Title>
                        <Space>
                            {data.name}
                            {user.data.rank.permissions > 5 && (
                                <Link to={`/admin/edit-user/${data.id}/${URLSafe(data.name)}`} className={styles.link}>
                                    <GhostButton
                                        icon={<EditOutlined style={{ fontSize: 32, color: "rgba(0, 0, 0, 0.85)" }} />}
                                    />
                                </Link>
                            )}
                        </Space>
                    </Typography.Title>
                    <Typography.Paragraph>{data.email}</Typography.Paragraph>
                    <Typography.Paragraph>{data.rank.name}</Typography.Paragraph>
                </Col>
                {breakpoints.sm && (
                    <Col>
                        <Avatar
                            src={`https://makerhive.anga.blue/static/images/user/${data.image}.jpg`}
                            icon={<UserOutlined />}
                            size={128}
                        />
                    </Col>
                )}
            </Row>
            <Typography.Title level={2} className={styles.loansTitle}>
                Loans
                <Button
                    icon={<ReloadOutlined />}
                    loading={props.profile ? props.profile.loading : profile.loading}
                    onClick={refresh}
                    className={styles.refresh}
                />
            </Typography.Title>
            {profile.data ? (
                profile.data.loans.length > 0 ? (
                    <CardContainer className={styles.loans}>
                        {profile.data.loans.map((loan) => (
                            <LoanCard {...loan} remove={props.removeLoan || removeLoan} key={loan.id} />
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
                    <CardContainer className={styles.reservations}>
                        {profile.data.reservations.map((reservation) => (
                            <ReservationCard
                                {...reservation}
                                remove={props.removeReservation || removeReservation}
                                key={reservation.id}
                            />
                        ))}
                    </CardContainer>
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
