import React, { useState } from "react";
import { Reservation, deleteReservation } from "../../store/api/Reservation";
import { Button, Typography, Popconfirm, Modal } from "antd";
import Card from "./Card";
import moment from "moment";
import styles from "./ReservationCard.module.less";
import { EyeOutlined, DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import URLSafe from "../URLSafe";

export function ReservationCard(props: Reservation) {
    const dispatch = useDispatch();
    const [state, setState] = useState({
        loading: false
    });
    const [details, setDetails] = useState(false);
    const toggleDetails = () => {
        setDetails(!details);
    };
    const deleteConfirm = async () => {
        setState({ loading: true });
        const response = await deleteReservation(props.id);
        setState({ loading: false });
        if (!response.error)
            dispatch({
                type: "profile/removeReservation",
                payload: props.id
            });
    };
    return (
        <>
            <Card
                name={props.item.name}
                image={props.item.image}
                disabled={state.loading}
                actions={[
                    <Button type="ghost" icon={<EyeOutlined />} className={styles.action} onClick={toggleDetails}>
                        Details
                    </Button>,
                    <Popconfirm
                        title="Are you sure want to delete this reservation?"
                        onConfirm={deleteConfirm}
                        okText="Yes"
                        cancelText="No">
                        <Button
                            type="ghost"
                            icon={state.loading ? <LoadingOutlined /> : <DeleteOutlined />}
                            className={styles.action}>
                            Delete
                        </Button>
                    </Popconfirm>
                ]}
                details={
                    <div className={styles.info}>
                        <Typography.Text>
                            <Typography.Text strong>Quantity:</Typography.Text> {props.quantity}
                        </Typography.Text>
                        <Typography.Text>
                            <Typography.Text strong>Position:</Typography.Text> #{props.position}
                        </Typography.Text>
                        <Typography.Text>
                            <Typography.Text strong>Reserved: </Typography.Text>
                            {moment(props.reserved).fromNow()}
                        </Typography.Text>
                    </div>
                }
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
                    <Typography.Text strong>Position: </Typography.Text> {props.position}
                    <br />
                    <Typography.Text strong>Item: </Typography.Text>{" "}
                    <Link to={`/items/${props.item.id}/${URLSafe(props.item.name)}`}>{props.item.name}</Link>
                    <br />
                    <Typography.Text strong>Quantity: </Typography.Text> {props.quantity}
                    <br />
                    <Typography.Text strong>Note: </Typography.Text> {props.note || "No note recorded"}
                    <br />
                </Typography.Text>
            </Modal>
        </>
    );
}
