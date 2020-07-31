import React, { useState, useEffect } from "react";
import styles from "./Borrow.module.less";
import { Typography, Form, Input, InputNumber, Button, notification, Row, Col, Divider } from "antd";
import { Store } from "antd/lib/form/interface";
import { APIError } from "../store/api/Error";
import { Item } from "../store/api/Item";
import { fetchItem } from "../store/api/Item";
import { useParams, useHistory, Link } from "react-router-dom";
import { loanItem } from "../store/api/Loan";
import Loading from "../components/Loading";
import Error from "./Error";
import Img from "react-cool-img";
import logo from "../images/logo.svg";
import { useDispatch } from "react-redux";
import URLSafe from "../components/URLSafe";

export default function Borrow() {
    const dispatch = useDispatch();
    const history = useHistory();
    //Fetch Item to Edit
    const [item, setItem] = useState<{ loading: boolean; error: APIError | null; data: Item | null }>({
        loading: false,
        error: null,
        data: null
    });
    const fetchDetails = async (id: number) => {
        setItem({ ...item, loading: true, error: null });
        let response = await fetchItem(id);
        if (response.error) return setItem({ ...item, loading: false, error: response.error });
        if (response.payload) return setItem({ ...item, loading: false, data: response.payload });
    };
    const [state, setState] = useState<{ loading: boolean; error: APIError | null }>({ loading: false, error: null });
    const [form] = Form.useForm();
    const submit = async (values: Store) => {
        if (!item.data) return;
        setState({ loading: true, error: null });
        console.log(values)
        return/*
        let loan = {
            item: item.data.id,
            quantity: values.quantity,
            note: values.note || ""
        };
        //Post Loan
        let response = await loanItem(loan);
        if (response.error) {
            //Handle Error
            setState({ loading: false, error: response.error });
            notification.error({
                placement: "bottomRight",
                message: response.error.name,
                description: response.error.message,
                duration: 8
            });
        } else {
            //Loaned Item Successfully
            setState({ loading: false, error: null });
            notification.success({
                placement: "bottomRight",
                message: "Item Loaned"
            });
            form.resetFields();
            //Save to Redux
            dispatch({
                type: "profile/addLoan",
                payload: response.payload
            });
            //Redirect Back
            history.goBack();
        }*/
    };
    const params = useParams<{ id: string; name: string }>();
    //Fetch Item on Component Mount / When URL params change
    useEffect(() => {
        let id: number | null = null;
        try {
            id = parseInt(params.id);
        } catch (error) {}
        //No Item ID
        if (id) fetchDetails(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);
    if (item.data) {
        let available = parseInt(item.data.available);
        return (
            <div className={styles.main}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={8} className={styles.imageContainer}>
                        <Img
                            className={styles.image}
                            placeholder={logo}
                            src={`https://makerhive.anga.blue/static/images/item/${item.data.image}.jpg`}
                            alt={item.data.name}></Img>
                    </Col>
                    <Col xs={24} lg={16}>
                        <Typography.Title>{item.data.name}</Typography.Title>
                        <Typography.Paragraph>
                            {item.data.description || "No item description provided."}
                        </Typography.Paragraph>
                        <Typography.Text strong>Location:</Typography.Text> {item.data.location || "Unknown"} <br />
                        <Typography.Text strong>Quantity:</Typography.Text> {item.data.quantity} <br />
                        <Typography.Text strong>Available:</Typography.Text> {item.data.available}
                        <Divider />
                        <Typography.Title level={2}>Loan Item</Typography.Title>
                        <Form
                            layout="vertical"
                            className={styles.form}
                            onFinish={submit}
                            initialValues={{ quantity: 1 }}
                            form={form}>
                            <Form.Item
                                label="Quantity"
                                name="quantity"
                                rules={[{ required: true, message: "Please enter an item quantity." }]}>
                                <InputNumber min={1} max={available} precision={0} />
                            </Form.Item>
                            <Form.Item label="Note" name="note">
                                <Input.TextArea placeholder="Loan note..." maxLength={1024} autoSize={{ minRows: 3, maxRows: 5 }} />
                                <Typography.Paragraph>
                                    If the item is numbered or labelled, please include the label in the notes.
                                </Typography.Paragraph>
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    disabled={state.loading || available === 0 || item.data.hidden}
                                    loading={state.loading}>
                                    Borrow
                                </Button>
                            </Form.Item>
                            {!!item.data.hidden && (
                                <Typography.Paragraph type="danger">
                                    This item is currently hidden and cannot be borrowed.  To make this item available, please unhide it by{" "}
                                    <Link to={`/admin/edit-item/${item.data.id}/${URLSafe(item.data.name)}`}>editing</Link>{" "}
                                    this item.
                                </Typography.Paragraph>
                            )}
                            {available === 0 && (
                                <Typography.Paragraph type="danger">
                                    Sorry, this item is currently unavailable. Please try{" "}
                                    <Link to={`/reserve/${item.data.id}/${URLSafe(item.data.name)}`}>reserving</Link>{" "}
                                    this item instead.
                                </Typography.Paragraph>
                            )}
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
    if (item.loading) return <Loading />;
    if (item.error) return <Error {...item.error} />;
    return <Error name="Not Found" message="This item was not found." />;
}
