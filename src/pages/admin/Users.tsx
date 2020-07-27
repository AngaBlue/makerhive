import React from "react";
import styles from "./AddItem.module.less";
import { Typography } from "antd";
//import { useDispatch } from "react-redux";

export default function Users() {
    //const dispatch = useDispatch();
    return (
        <div className={styles.main}>
            <Typography.Title>Users</Typography.Title>
        </div>
    );
}
