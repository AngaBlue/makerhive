import React, { useEffect, useState } from "react";
import styles from "./Item.module.less";
import { useParams } from "react-router-dom";
import Error from "./Error";
import { APIError } from "../store/api/Error";
import { DetailedItem, fetchItem } from "../store/api/Item";
import { Row, Col, Typography, Table } from "antd";
import Loading from "../components/Loading";
import { RootState } from "../";
import { useSelector } from "react-redux";
import moment from "moment";
import { ColumnsType } from "antd/lib/table";
import { Reservation } from "../store/api/Reservation";
import { Loan } from "../store/api/Loan";
import logo from "../images/logo.svg";

export default function Item() {
    const [state, setState] = useState<{ loading: boolean; error: APIError | null; data: DetailedItem | null }>({
        loading: false,
        error: null,
        data: null
    });
    const user = useSelector((state: RootState) => state.user.data);
    const params = useParams<{ id: string; name: string }>();

    const fetchDetails = async (id: number) => {
        setState({ ...state, loading: true, error: null });
        let response = await fetchItem(id);
        if (response.error) return setState({ ...state, loading: false, error: response.error });
        if (response.payload) return setState({ ...state, loading: false, data: response.payload });
    };

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
        const reservationColumns: ColumnsType<Reservation> = [
            { title: "Position", dataIndex: "position", render: (_v, _r, i) => `#${i + 1}`, responsive: ["md"] },
            { title: "Quantity", dataIndex: "quantity" },
            { title: "Reserved", dataIndex: "reserved", render: (v) => moment(v).fromNow() },
            { title: "Note", dataIndex: "note", responsive: ["md"] }
        ];
        if (user && user.rank.permissions >= 5)
            reservationColumns.push({ title: "User", dataIndex: "user", render: (v) => v.name });
        const loanColumns: ColumnsType<Loan> = [
            { title: "Quantity", dataIndex: "quantity" },
            { title: "Borrowed", dataIndex: "borrowed", render: (v) => moment(v).fromNow() },
            { title: "Note", dataIndex: "note", responsive: ["md"] }
        ];
        if (user && user.rank.permissions >= 5)
            loanColumns.push({ title: "User", dataIndex: "user", render: (v) => v.name });
        return (
            <div className={styles.main}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={8} className={styles.imageContainer}>
                        <div
                            className={styles.image}
                            style={{
                                backgroundImage: `url(https://makerhive.anga.blue/static/images/item/${state.data.image}.jpg), url(${logo})`
                            }}></div>
                    </Col>
                    <Col xs={24} lg={16}>
                        <Typography.Title>{state.data.name}</Typography.Title>
                        <Typography.Paragraph>
                            {state.data.description || "No item description provided."}
                        </Typography.Paragraph>
                        <Typography.Text strong>Location:</Typography.Text> {state.data.location || "Unknown"} <br />
                        <Typography.Text strong>Quantity:</Typography.Text> {state.data.quantity} <br />
                        <Typography.Text strong>Available:</Typography.Text> {state.data.available}
                    </Col>
                </Row>
                <Typography.Title level={2}>Loans</Typography.Title>
                <Table dataSource={state.data.loans} columns={loanColumns} pagination={false} />
                <Typography.Title level={2}>Reservations</Typography.Title>
                <Table dataSource={state.data.reservations} columns={reservationColumns} pagination={false} />
            </div>
        );
    }
    if (state.loading) return <Loading />;
    if (state.error) return <Error {...state.error} />;
    return <Error name="Not Found" message="This item was not found." />;
}
