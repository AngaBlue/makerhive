import React, { useState, useEffect } from "react";
import styles from "./EditUser.module.less";
import { Typography, Form, Input, Button, notification, Select } from "antd";
import { Store } from "antd/lib/form/interface";
import { APIError } from "../../store/api/Error";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import Error from "../Error";
import { fetchUser, editUser, User, EditUserPayload } from "../../store/api/User";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../";
import { getRanks } from "../../store/slices/ranks";

export default function EditUser() {
    const dispatch = useDispatch()
    const ranks = useSelector((state: RootState) => state.ranks);
    const [user, setUser] = useState<{ loading: boolean; error: APIError | null; data: User | null }>({
        loading: false,
        error: null,
        data: null
    });
    const [state, setState] = useState<{ loading: boolean; error: APIError | null }>({ loading: false, error: null });
    const [form] = Form.useForm();
    //Fetch User to Edit
    const fetchDetails = async (id: number) => {
        setUser({ ...user, loading: true, error: null });
        let response = await fetchUser(id);
        if (response.error) return setUser({ ...user, loading: false, error: response.error });
        if (response.payload) return setUser({ ...user, loading: false, data: response.payload });
    };
    const submit = async (values: Store) => {
        //Find Difference
        let changedValues: Partial<EditUserPayload> = {
            id: user.data!.id
        };
        (Object.keys(values) as Array<keyof EditUserPayload>).forEach((key) => {
            if (values[key] !== user.data![key]) changedValues[key] = values[key];
        });
        //If no values changed
        if (Object.keys(changedValues).length === 1)
            return notification.info({
                placement: "bottomRight",
                message: "No values changed"
            });
        //Post Edit
        setState({ loading: true, error: null });
        let response = await editUser(changedValues);
        if (response.error) {
            //Handle Error Response
            setState({ loading: false, error: response.error });
            notification.error({
                placement: "bottomRight",
                message: response.error.name,
                description: response.error.message,
                duration: 8
            });
        }
        if (response.payload) {
            //Edit Success
            setState({ loading: false, error: null });
            notification.success({
                placement: "bottomRight",
                message: "User Updated"
            });
            //Update Form
            setUser({ ...user, data: response.payload });
            form.resetFields();
        }
    };
    const params = useParams<{ id: string; name: string }>();
    //Fetch User on Component Mount / When URL params change
    useEffect(() => {
        let id: number | null = null;
        try {
            id = parseInt(params.id);
        } catch (error) {}
        //No User ID
        if (id) fetchDetails(id);
        if (!ranks.loading) dispatch(getRanks({ throttle: { requested: ranks.requested, timeout: 5 * 60 * 1000 } }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);
    if (user.data && ranks.data) {
        return (
            <div className={styles.main}>
                <Typography.Title>Edit User</Typography.Title>
                <Form layout="vertical" className={styles.form} onFinish={submit} initialValues={{...user.data, rank: user.data.rank.id}} form={form}>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: "Please enter an user name." }]}>
                        <Input placeholder="User Name..." maxLength={64}/>
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Please enter an email." }]}>
                        <Input placeholder="Email..." type="email" maxLength={255}/>
                    </Form.Item>
                    <Form.Item label="Rank" name="rank" rules={[{ required: true, message: "Please select a rank." }]} className={styles.dropdown}>
                        <Select>
                            {ranks.data.map((r) => {
                                return <Select.Option value={r.id}>{r.name}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" disabled={state.loading} loading={state.loading}>
                            Save Changes
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
    if (user.loading || ranks.loading) return <Loading />;
    if (user.error) return <Error {...user.error} />;
    return <Error name="Not Found" message="This user was not found." />;
}
