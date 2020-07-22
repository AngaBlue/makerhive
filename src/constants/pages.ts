import { DashboardOutlined, AppstoreOutlined, PlusOutlined } from "@ant-design/icons";
import { Page } from "./Page";
import React from "react";

const Index = React.lazy(() => import("../pages/Index"));
const AddItem = React.lazy(() => import("../pages/admin/AddItem"));
const Dashboard = React.lazy(() => import("../pages/Dashboard"));
const Item = React.lazy(() => import("../pages/Item"));

const pages: Page[] = [
    new Page({
        name: "Inventory",
        component: Index,
        icon: AppstoreOutlined,
        route: "/",
        nav: true
    }),
    new Page({
        name: "Dashboard",
        component: Dashboard,
        icon: DashboardOutlined,
        route: "/dashboard",
        nav: true,
        authenticated: true
    }),
    new Page({
        name: "Add Item",
        component: AddItem,
        icon: PlusOutlined,
        route: "/admin/add-item",
        authenticated: true,
        permissions: 5,
        nav: true
    }),
    new Page({
        name: "Item",
        component: Item,
        route: "/items/:id/:name"
    })
];
export default pages;
