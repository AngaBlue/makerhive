import React, { useState } from "react";
import { deleteReservation, AdminReservation } from "../../store/api/Reservation";
import { Button, Typography, Popconfirm, Modal, notification } from "antd";
import Card from "./Card";
import moment from "moment";
import styles from "./AdminReservationCard.module.less";
import { EyeOutlined, DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import URLSafe from "../URLSafe";
import GhostButton from "../GhostButton";

export function AdminReservationCard(props: AdminReservation & { remove(id: number): any }) {
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
        if (!response.error) {
            notification.success({ placement: "bottomRight", message: "Reservation Deleted" });
            props.remove(props.id);
        }
    };
    return (
        <>
            <Card
                name={props.item.name}
                image={props.item.image}
                url={`/items/${props.item.id}/${URLSafe(props.item.name)}`}
                disabled={state.loading}
                actions={[
                    <GhostButton icon={<EyeOutlined />} className={styles.action} onClick={toggleDetails}>
                        Details
                    </GhostButton>,
                    <Popconfirm
                        title="Are you sure want to delete this reservation?"
                        onConfirm={deleteConfirm}
                        okText="Yes"
                        cancelText="No">
                        <GhostButton
                            icon={state.loading ? <LoadingOutlined /> : <DeleteOutlined />}
                            className={styles.action}>
                            Delete
                        </GhostButton>
                    </Popconfirm>
                ]}
                details={
                    <div className={styles.info}>
                        <Typography.Text>
                            <Typography.Text strong>User:</Typography.Text>{" "}
                            <Link
                                to={`/admin/users/${props.user.id}/${URLSafe(props.user.name)}`}
                                className={styles.link}
                                component={Typography.Link}>
                                {props.user.name}
                            </Link>
                        </Typography.Text>
                        <Typography.Text>
                            <Typography.Text strong>Quantity:</Typography.Text> {props.quantity}
                        </Typography.Text>
                        <Typography.Text>
                            <Typography.Text strong>Reserved: </Typography.Text>
                            {moment(props.reserved).fromNow()}
                        </Typography.Text>
                    </div>
                }
            />
            {/* Reservatiom Modal Details */}
            <Modal
                title="Reservation Details"
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
                    <Typography.Text strong>User: </Typography.Text>{" "}
                    <Link to={`/admin/users/${props.user.id}/${URLSafe(props.user.name)}`}>{props.user.name}</Link>
                    <br />
                    <Typography.Text strong>Position: </Typography.Text> #{props.position}
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
