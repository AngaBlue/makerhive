import React, { useState } from "react";
import styles from "./AddItem.module.less";
import { Typography, Form, Input, InputNumber, Button, notification, Switch } from "antd";
import ImageUpload, { UploadStateType } from "../../components/ImageUpload";
import { Store } from "antd/lib/form/interface";
import { APIError } from "../../store/api/Error";
import { useDispatch } from "react-redux";
import { Item, addItem } from "../../store/api/Item";

export default function AddItem() {
    const dispatch = useDispatch();
    const [state, setState] = useState<{ loading: boolean; error: APIError | null }>({ loading: false, error: null });
    const [image, setImage] = useState(null as UploadStateType);
    const [form] = Form.useForm();
    const submit = async (values: Store) => {
        setState({ loading: true, error: null });
        //Post Item
        let response = await addItem(values as Item, undefined || (image as Blob));
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
            //Item Added Successfully
            setState({ loading: false, error: null });
            notification.success({
                placement: "bottomRight",
                message: "Item Added"
            });
            form.resetFields();
            setImage(null);
            //Save to Redux
            dispatch({
                type: "items/addItem",
                payload: response.payload
            });
        }
    };
    return (
        <div className={styles.main}>
            <Typography.Title>Add Item</Typography.Title>
            <Form
                layout="vertical"
                className={styles.form}
                onFinish={submit}
                initialValues={{ quantity: 1 }}
                form={form}>
                <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter an item name." }]}>
                    <Input placeholder="Item Name..." />
                </Form.Item>
                <Form.Item label="Description" name="description">
                    <Input.TextArea placeholder="Item description..." autoSize={{ minRows: 3, maxRows: 5 }} />
                </Form.Item>
                <Form.Item label="Location" name="location">
                    <Input placeholder="Item location..." />
                </Form.Item>
                <Form.Item label="Image" name="image">
                    <ImageUpload image={image} setImage={setImage} />
                </Form.Item>
                <Form.Item
                    label="Quantity"
                    name="quantity"
                    rules={[{ required: true, message: "Please enter an item quantity." }]}>
                    <InputNumber min={1} max={999} precision={0} />
                </Form.Item>
                <Form.Item name="hidden" label="Hidden">
                    <Switch defaultChecked={false} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={state.loading} loading={state.loading}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
