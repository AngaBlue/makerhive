import React, { useState, useEffect } from "react";
import styles from "./EditItem.module.less";
import { Typography, Form, Input, InputNumber, Button, notification, Switch, Space, Popconfirm } from "antd";
import ImageUpload, { UploadStateType } from "../../components/ImageUpload";
import { Store } from "antd/lib/form/interface";
import { APIError } from "../../store/api/Error";
import { Item, fetchItem, editItem, deleteItem } from "../../store/api/Item";
import { useParams, useHistory } from "react-router-dom";
import Loading from "../../components/Loading";
import Error from "../Error";
import { useDispatch } from "react-redux";

export default function EditItem() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [item, setItem] = useState<{ loading: boolean; error: APIError | null; data: Item | null }>({
        loading: false,
        error: null,
        data: null
    });
    const [state, setState] = useState<{ loading: boolean; error: APIError | null }>({ loading: false, error: null });
    const [image, setImage] = useState(null as UploadStateType);
    const [form] = Form.useForm();
    //Fetch Item to Edit
    const fetchDetails = async (id: number) => {
        setItem({ ...item, loading: true, error: null });
        let response = await fetchItem(id);
        if (response.error) return setItem({ ...item, loading: false, error: response.error });
        if (response.payload) return setItem({ ...item, loading: false, data: response.payload });
    };
    const submit = async (values: Store) => {
        //Find Difference
        let changedValues: Partial<Item> = {
            id: item.data!.id
        };
        (Object.keys(values) as Array<keyof Item>).forEach((key) => {
            if (values[key] !== item.data![key]) changedValues[key] = values[key];
        });
        //If no values changed
        if (Object.keys(changedValues).length === 1 && !image)
            return notification.info({
                placement: "bottomRight",
                message: "No values changed"
            });
        //Post Edit
        setState({ loading: true, error: null });
        let response = await editItem(changedValues, undefined || (image as Blob));
        if (response.error) {
            //Handle Error Response
            setState({ loading: false, error: response.error });
            notification.error({
                placement: "bottomRight",
                message: response.error.name,
                description: response.error.message,
                duration: 8
            });
        } else {
            //Edit Success
            setState({ loading: false, error: null });
            notification.success({
                placement: "bottomRight",
                message: "Item Updated"
            });
            //Update Form
            setItem({ ...item, data: response.payload as Item });
            form.resetFields();
            setImage(null);
            //Save to Redux
            dispatch({
                type: "items/updateItem",
                payload: response.payload
            });
        }
    };
    const removeItem = async () => {
        if (!item.data) return;
        //Post Edit
        setState({ loading: true, error: null });
        let response = await deleteItem(item.data.id);
        if (response.error) {
            //Handle Error Response
            setState({ loading: false, error: response.error });
            notification.error({
                placement: "bottomRight",
                message: response.error.name,
                description: response.error.message,
                duration: 8
            });
        } else {
            //Edit Success
            setState({ loading: false, error: null });
            notification.success({
                placement: "bottomRight",
                message: "Item Deleted"
            });
            //Save to Redux
            dispatch({
                type: "items/removeItem",
                payload: item.data.id
            });
            history.goBack();
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
                <Typography.Title>Edit Item</Typography.Title>
                <Form layout="vertical" className={styles.form} onFinish={submit} initialValues={item.data} form={form}>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: "Please enter an item name." }]}>
                        <Input placeholder="Item Name..." maxLength={128} />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input.TextArea
                            placeholder="Item description..."
                            maxLength={1024}
                            autoSize={{ minRows: 3, maxRows: 5 }}
                        />
                    </Form.Item>
                    <Form.Item label="Location" name="location">
                        <Input placeholder="Item location..." maxLength={64} />
                    </Form.Item>
                    <Form.Item label="Image" name="image">
                        <ImageUpload
                            image={image}
                            setImage={setImage}
                            default={{
                                name: item.data.name,
                                url: `https://makerhive.anga.blue/static/images/item/${item.data.image}-thumb.jpg`
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Quantity"
                        name="quantity"
                        rules={[{ required: true, message: "Please enter an item quantity." }]}>
                        <InputNumber min={1} max={255} precision={0} />
                    </Form.Item>
                    <Form.Item name="hidden" label="Hidden">
                        <Switch defaultChecked={!!item.data.hidden} />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" disabled={state.loading} loading={state.loading}>
                                Save Changes
                            </Button>
                            <Popconfirm
                                title={
                                    <Typography.Text>
                                        <Typography.Text strong>Are you sure want to delete this item?</Typography.Text>
                                        <br />
                                        All past and active loans and reservations on this item will also be deleted.
                                    </Typography.Text>
                                }
                                onConfirm={removeItem}
                                okText="Delete"
                                cancelText="Cancel">
                                <Button danger disabled={state.loading} loading={state.loading}>
                                    Delete Item
                                </Button>
                            </Popconfirm>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        );
    }
    if (item.loading) return <Loading />;
    if (item.error) return <Error {...item.error} />;
    return <Error name="Not Found" message="This item was not found." />;
}
