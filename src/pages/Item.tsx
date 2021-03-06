import React, { useEffect, useState } from "react";
import styles from "./Item.module.less";
import { useParams, Link } from "react-router-dom";
import Error from "./Error";
import { APIError } from "../store/api/Error";
import { DetailedItem, fetchDetailedItem } from "../store/api/Item";
import { Row, Col, Typography, Table, Button, Space } from "antd";
import Loading from "../components/Loading";
import { RootState } from "../";
import { useSelector } from "react-redux";
import moment from "moment";
import { ColumnsType } from "antd/lib/table";
import { Reservation } from "../store/api/Reservation";
import { Loan } from "../store/api/Loan";
import logo from "../images/logo.svg";
import Img from "react-cool-img";
import URLSafe from "../components/URLSafe";

export default function Item() {
    const [state, setState] = useState<{ loading: boolean; error: APIError | null; data: DetailedItem | null }>({
        loading: false,
        error: null,
        data: null
    });
    const user = useSelector((state: RootState) => state.user.data);
    const params = useParams<{ id: string; name: string }>();
    //Fetch Item
    const fetchDetails = async (id: number) => {
        setState({ ...state, loading: true, error: null });
        let response = await fetchDetailedItem(id);
        if (response.error) return setState({ ...state, loading: false, error: response.error });
        if (response.payload) return setState({ ...state, loading: false, data: response.payload });
    };

    //Fetch Item on Mount / URL Param Change
    useEffect(() => {
        let id: number | null = null;
        try {
            id = parseInt(params.id);
        } catch (error) {}
        //No Item ID
        if (id) fetchDetails(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);

    if (state.data) {
        //Reservation Table Columns
        const reservationColumns: ColumnsType<Reservation> = [
            { title: "Position", dataIndex: "position", render: (_v, _r, i) => `#${i + 1}`, responsive: ["md"] },
            { title: "Quantity", dataIndex: "quantity" },
            { title: "Reserved", dataIndex: "reserved", render: (v) => moment(v).fromNow() },
            { title: "Note", dataIndex: "note", responsive: ["md"] }
        ];
        if (user && user.rank.permissions >= 5)
            reservationColumns.splice(1, 0, {
                title: "User",
                dataIndex: "user",
                render: (user) => (
                    <Link to={`/admin/users/${user.id}/${URLSafe(user.name)}`} className={styles.link}>
                        {user.name}
                    </Link>
                )
            });
        //Loan Table Columns
        const loanColumns: ColumnsType<Loan> = [
            { title: "Quantity", dataIndex: "quantity" },
            { title: "Borrowed", dataIndex: "borrowed", render: (v, user) => moment(v).fromNow() },
            { title: "Note", dataIndex: "note", responsive: ["md"] }
        ];
        if (user && user.rank.permissions >= 5)
            loanColumns.splice(1, 0, {
                title: "User",
                dataIndex: "user",
                render: (user) => (
                    <Link to={`/admin/users/${user.id}/${URLSafe(user.name)}`} className={styles.link}>
                        {user.name}
                    </Link>
                )
            });
        return (
            <div className={styles.main}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={8} className={styles.imageContainer}>
                        <Img
                            className={styles.image}
                            placeholder={logo}
                            src={`https://makerhive.anga.blue/static/images/item/${state.data.image}.jpg`}
                            alt={state.data.name}></Img>
                    </Col>
                    <Col xs={24} lg={16}>
                        <Typography.Title>{state.data.name}</Typography.Title>
                        <Typography.Paragraph>
                            {state.data.description || "No item description provided."}
                        </Typography.Paragraph>
                        <Typography.Text strong>Location:</Typography.Text> {state.data.location || "Unknown"} <br />
                        <Typography.Text strong>Quantity:</Typography.Text> {state.data.quantity} <br />
                        <Typography.Text strong>Available:</Typography.Text> {state.data.available} <br />
                        <br />
                        <Space>
                            <Link to={`/borrow/${state.data.id}/${URLSafe(state.data.name)}`}>
                                <Button type="primary">Borrow</Button>
                            </Link>
                            <Link to={`/reserve/${state.data.id}/${URLSafe(state.data.name)}`}>
                                <Button>Reserve</Button>
                            </Link>
                        </Space>
                    </Col>
                </Row>
                <Typography.Title level={2}>Loans</Typography.Title>
                <Table
                    dataSource={state.data.loans}
                    columns={loanColumns}
                    pagination={false}
                    className={styles.table}
                />
                <Typography.Title level={2}>Reservations</Typography.Title>
                <Table
                    dataSource={state.data.reservations}
                    columns={reservationColumns}
                    pagination={false}
                    className={styles.table}
                />
            </div>
        );
    }
    if (state.loading) return <Loading />;
    if (state.error) return <Error {...state.error} />;
    return <Error name="Not Found" message="This item was not found." />;
}
