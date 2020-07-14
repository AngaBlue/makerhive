import React, { useEffect } from "react";
import { Menu, Drawer, Avatar, Button, Typography, Skeleton } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import styles from "./Nav.module.less";
import { ClickParam } from "antd/lib/menu";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { getUser } from "../store/slices/user";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/reducer";
import { UserOutlined } from "@ant-design/icons";
import banner from "../images/banner.svg";
import pages from "../constants/pages";

export function MobileNav() {
    const [state, setState] = React.useState({ open: false });
    const close = () => setState({ open: false });
    return (
        <>
            <div className={styles.topNav}>
                <Link to="/">
                    <img src={banner} alt="Makerhive" className={styles.banner} />
                </Link>
                <MenuOutlined
                    onClick={() => setState({ open: !state.open })}
                    style={{ fontSize: "32px", height: "max-content" }}
                />
            </div>
            <Drawer
                onClose={close}
                visible={state.open}
                placement="left"
                forceRender={true}
                closable={false}
                bodyStyle={{ padding: 0 }}>
                <Nav close={close} />
            </Drawer>
        </>
    );
}

export function Nav(props: { close?: (param: ClickParam) => void }) {
    const location = useLocation();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    useEffect(() => {
        if (!user.loading) dispatch(getUser({ throttle: { requested: user.requested, timeout: 5 * 60 * 1000 } }));
    });
    let userPerms = user.data ? user.data.rank.permissions : -10;
    let navPages = pages.filter((p) => {
        if (!p.nav) return false;
        if (p.authenticated && !user.data) return false;
        if (p.permissions !== null && userPerms < p.permissions) return false;
        return true;
    });
    return (
        <div className={styles.nav}>
            <Link to="/" style={{ display: "contents" }}>
                <img src={banner} alt="Makerhive" className={styles.banner} />
            </Link>
            {user.data ? (
                <div className={styles.user}>
                    <Avatar
                        src={`https://makerhive.anga.blue/static/images/user/${user.data.image}.jpg`}
                        icon={<UserOutlined />}
                        size="large"
                    />
                    <Typography.Text className={styles.username}>{user.data.name}</Typography.Text>
                </div>
            ) : user.loading ? (
                <div className={styles.userSkeleton}>
                    <Skeleton.Avatar active size="large" className={styles.avatar} />
                    <Skeleton.Input active size="small" className={styles.username} />
                </div>
            ) : (
                <div className={styles.login}>
                    <Link to="/auth/google">
                        <Button>Login</Button>
                    </Link>
                </div>
            )}
            <Menu selectedKeys={[location.pathname]} mode="vertical" onClick={props.close} className={styles.menu}>
                {navPages.map((page) => {
                    return (
                        <Menu.Item
                            key={page.route}
                            icon={page.icon !== null ? <page.icon /> : null}
                            className={styles.menuItem}>
                            <Link to={page.route}>{page.name}</Link>
                        </Menu.Item>
                    );
                })}
            </Menu>
        </div>
    );
}

export default Nav;
