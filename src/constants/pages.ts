import { DashboardOutlined, AppstoreOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { Page } from "./Page";
import React from "react";

const Index = React.lazy(() => import("../pages/Index"));
const AddItem = React.lazy(() => import("../pages/admin/AddItem"));
const Dashboard = React.lazy(() => import("../pages/Dashboard"));
const Item = React.lazy(() => import("../pages/Item"));
const EditItem = React.lazy(() => import("../pages/admin/EditItem"));
const Users = React.lazy(() => import("../pages/admin/Users"));

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
        name: "Edit Item",
        component: EditItem,
        route: "/admin/edit-item/:id/:name",
        authenticated: true,
        permissions: 5
    }),
    new Page({
        name: "Item",
        component: Item,
        route: "/items/:id/:name"
    }),
    new Page({
        name: "Users",
        component: Users,
        route: "/admin/users",
        authenticated: true,
        permissions: 5,
        nav: true,
        icon: UserOutlined
    })
];
export default pages;
