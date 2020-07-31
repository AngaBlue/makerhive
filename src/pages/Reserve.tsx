import React, { useState, useEffect } from "react";
import styles from "./Reserve.module.less";
import { Typography, Form, Input, InputNumber, Button, notification, Row, Col, Divider } from "antd";
import { Store } from "antd/lib/form/interface";
import { APIError } from "../store/api/Error";
import { Item } from "../store/api/Item";
import { fetchItem } from "../store/api/Item";
import { useParams, useHistory } from "react-router-dom";
import Loading from "../components/Loading";
import Error from "./Error";
import Img from "react-cool-img";
import logo from "../images/logo.svg";
import { useDispatch } from "react-redux";
import { reserveItem } from "../store/api/Reservation";

export default function Reserve() {
    const dispatch = useDispatch()
    const history = useHistory()
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
        if (!item.data) return
        setState({ loading: true, error: null });
        let reservation = {
            item: item.data.id,
            quantity: values.quantity,
            note: values.note || ""
        }
        //Post Reservation
        let response = await reserveItem(reservation);
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
                message: "Item Reserved"
            });
            form.resetFields();
            //Save to Redux
            dispatch({
                type: "profile/addReservation",
                payload: response.payload
            });
            //Redirect Back
            history.goBack()
        }
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
                        <Typography.Title level={2}>Reserve Item</Typography.Title>
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
                                <InputNumber min={1} max={item.data.quantity} precision={0} />
                            </Form.Item>
                            <Form.Item label="Reservation" name="note">
                                <Input.TextArea
                                    placeholder="Reservation note..."
                                    maxLength={1024}
                                    autoSize={{ minRows: 3, maxRows: 5 }}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    disabled={state.loading}
                                    loading={state.loading}>
                                    Reserve
                                </Button>
                            </Form.Item>
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
