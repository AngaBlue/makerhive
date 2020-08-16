import React, { Suspense } from "react";
import styles from "./Layout.module.less";
import { Nav, MobileNav } from "./Nav";
import { Layout as AntLayout } from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import ScrollTop from "./ScrollTop";

export function Layout(props: { children: React.ReactNode }) {
    const breakpoints = useBreakpoint();
    return (
        <AntLayout className={styles.layout}>
            {breakpoints.lg ? (
                // Desktop
                <AntLayout.Sider width={240}>
                    <Nav />
                </AntLayout.Sider>
            ) : (
                // Mobile
                <AntLayout.Header className={styles.header}>
                    <MobileNav />
                </AntLayout.Header>
            )}
            <ScrollTop>
                <AntLayout.Content className={styles.dashboard}>
                    <Suspense fallback={<span>Loading...</span>}>{props.children}</Suspense>
                </AntLayout.Content>
            </ScrollTop>
        </AntLayout>
    );
}

export default Layout;
