import React, { useEffect, useState } from "react";
import styles from "./Users.module.less";
import { Typography, Table, Avatar, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/reducer";
import { getUsers } from "../../store/slices/users";
import Loading from "../../components/Loading";
import moment from "moment";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import URLSafe from "../../components/URLSafe";
import GhostButton from "../../components/GhostButton";

export default function Users() {
    const dispatch = useDispatch();
    const users = useSelector((state: RootState) => state.users);
    //Fetch Users if Not Found / Cache Stale
    useEffect(() => {
        if (!users.loading) dispatch(getUsers({ throttle: { requested: users.requested, timeout: 5 * 60 * 1000 } }));
    });
    //Search
    const [name, setName] = useState("")
    const setSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.toLowerCase().trim();        
        if (value !== name) setName(value)
    }
    let values = users.data || []
    if (name) {
        values = values.filter(v => v.name.toLowerCase().includes(name))
    }
    return (
        <div className={styles.main}>
            <Typography.Title>Users</Typography.Title>
            <div className={styles.filters}>
                <Input.Search placeholder="Search users..." onChange={setSearch} className={styles.search} />
            </div>
            {users.data ? (
                <Table
                    pagination={false}
                    dataSource={values}
                    columns={[
                        {
                            dataIndex: "image",
                            width: 32,
                            render: (image) => (
                                <Avatar
                                    src={`https://makerhive.anga.blue/static/images/user/${image}.jpg`}
                                    icon={<UserOutlined />}
                                    size="large"
                                />
                            )
                        },
                        {
                            title: "Name",
                            dataIndex: "name",
                            render: (name, user) => (
                                <Link to={`/admin/users/${user.id}/${URLSafe(user.name)}`} className={styles.link}>{user.name}</Link>
                            )
                        },
                        { title: "Email", dataIndex: "email", responsive: ["md"] },
                        {
                            title: "Joined",
                            dataIndex: "joined",
                            render: (v) => moment(v).format("Do MMM, YYYY"),
                            responsive: ["md"]
                        },
                        {
                            title: "Rank",
                            dataIndex: "rank",
                            width: 96,
                            responsive: ["sm"],
                            render: (rank) => rank.name
                        },
                        {
                            key: "action",
                            width: 96,
                            render: (text, user) => (
                                <>
                                    <Link to={`/admin/edit-user/${user.id}/${URLSafe(user.name)}`}>
                                        <GhostButton className={styles.iconButton} icon={<EditOutlined />} />
                                    </Link>
                                    <Link to={`/admin/users/${user.id}/${URLSafe(user.name)}`}>
                                        <GhostButton className={styles.iconButton} icon={<UserOutlined />} />
                                    </Link>
                                </>
                            )
                        }
                    ]}
                />
            ) : (
                <Loading className={styles.loading} />
            )}
        </div>
    );
}
