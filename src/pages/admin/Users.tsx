import React, { useEffect } from "react";
import styles from "./AddItem.module.less";
import { Typography, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/reducer";
import { getUsers } from "../../store/slices/users";
import Loading from "../../components/Loading";
import moment from "moment";

export default function Users() {
    const dispatch = useDispatch();
    const users = useSelector((state: RootState) => state.users);
    //Fetch Users if Not Found / Cache Stale
    useEffect(() => {
        if (!users.loading) dispatch(getUsers({ throttle: { requested: users.requested, timeout: 5 * 60 * 1000 } }));
    });
    return (
        <div className={styles.main}>
            <Typography.Title>Users</Typography.Title>
            {users.data ? (
                <Table
                    pagination={false}
                    dataSource={users.data}
                    columns={[
                        { title: "Name", dataIndex: "name" },
                        { title: "Email", dataIndex: "email" },
                        {
                            title: "Joined",
                            dataIndex: "joined",
                            render: (v) => moment(v).fromNow(),
                            responsive: ["md"]
                        },
                        { title: "Rank", dataIndex: "rank", render: (rank) => rank.name }
                    ]}
                />
            ) : (
                <Loading />
            )}
        </div>
    );
}
