import React, { useEffect, useState } from "react";
import styles from "./Item.module.less";
import { useParams } from "react-router-dom";
import Error from "./Error";
import { request } from "../store/api/api";
import { APIError } from "../store/api/Error";
import { Item as ItemType } from "../store/api/Item";
import { Row, Col, Typography } from "antd";
import Loading from "../components/Loading";

export default function Item() {
    const [state, setState] = useState<{ loading: boolean; error: APIError | null; data: ItemType | null }>({
        loading: false,
        error: null,
        data: null
    });
    const params = useParams<{ id: string; name: string }>();
    const fetchItem = async (id: number) => {
        setState({ ...state, loading: true, error: null });
        let response = await request({
            type: "GET_ITEM",
            payload: id
        });
        if (response.error) return setState({ ...state, loading: false, error: response.error });
        if (response.payload) return setState({ ...state, loading: false, data: response.payload });
    };

    useEffect(() => {
        let id: number | null = null;
        try {
            id = parseInt(params.id);
        } catch (error) {}
        //No Item ID
        if (id) fetchItem(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);
    if (state.data)
        return (
            <div className={styles.main}>
                <Row gutter={[16, 16]}>
                    <Col md={8} className={styles.image}>
                        <img
                            alt={state.data.name}
                            src={`https://makerhive.anga.blue/static/images/item/${state.data.image}.jpg`}></img>
                    </Col>
                    <Col md={16}>
                        <Typography.Title level={2}>{state.data.name}</Typography.Title>
                        <Typography.Paragraph>{state.data.description}</Typography.Paragraph>
                        <Typography.Text strong>Quantity:</Typography.Text> {state.data.quantity}
                        <Typography.Text strong>Available:</Typography.Text> {state.data.available}
                    </Col>
                </Row>
            </div>
        );
    if (state.loading) return <Loading />;
    if (state.error) return <Error {...state.error} />;
    return <Error name="Not Found" message="This item was not found." />;
}