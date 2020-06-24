import React, { useEffect } from "react";
import { Menu, Drawer, Avatar, Button, Typography, Skeleton } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import styles from "./Nav.module.less";
import { ClickParam } from "antd/lib/menu";
import navItems from "../constants/pages";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { getUser } from "../store/slices/user";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/reducer";
import { UserOutlined } from "@ant-design/icons";

export function MobileNav() {
  const [state, setState] = React.useState({ open: false });
  const close = () => setState({ open: false });
  return (
    <>
      <div className={styles.topNav}>
        <Link to="/">
          <img src="/banner.svg" alt="Makerhive" className={styles.banner} />
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
        bodyStyle={{ padding: 0 }}
      >
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
    if (!user.data && !user.loading) dispatch(getUser());
  });
  return (
    <div className={styles.nav}>
      <Link to="/">
        <img src="/banner.svg" alt="Makerhive" className={styles.banner} />
      </Link>
      {user.data ? (
        <div className={styles.user}>
          <Avatar src={user.data.image} icon={<UserOutlined />} size="large" />
          <Typography.Text className={styles.username}>
            {user.data.name}
          </Typography.Text>
        </div>
      ) : user.loading ? (
        <div className={styles.userSkeleton}>
          <Skeleton.Avatar active size="large" />
          <Skeleton.Input active size="small" className={styles.username} />
        </div>
      ) : (
        <Button>Login</Button>
      )}
      <Menu
        selectedKeys={[location.pathname]}
        mode="vertical"
        onClick={props.close}
        className={styles.menu}
      >
        {navItems.map((item) => {
          return (
            <Menu.Item
              key={item.route}
              icon={<item.icon />}
              className={styles.menuItem}
            >
              <Link to={item.route}>{item.name}</Link>
            </Menu.Item>
          );
        })}
      </Menu>
    </div>
  );
}

export default Nav;
