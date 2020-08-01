import {
    DashboardOutlined,
    AppstoreOutlined,
    PlusOutlined,
    UserOutlined,
    LogoutOutlined,
    LockOutlined
} from "@ant-design/icons";
import { Page } from "./Page";
import React from "react";

const Index = React.lazy(() => import("../pages/Index"));
const AddItem = React.lazy(() => import("../pages/admin/AddItem"));
const Dashboard = React.lazy(() => import("../pages/Dashboard"));
const Item = React.lazy(() => import("../pages/Item"));
const EditItem = React.lazy(() => import("../pages/admin/EditItem"));
const Users = React.lazy(() => import("../pages/admin/Users"));
const Borrow = React.lazy(() => import("../pages/Borrow"));
const Reserve = React.lazy(() => import("../pages/Reserve"));
const EditUser = React.lazy(() => import("../pages/admin/EditUser"));
const User = React.lazy(() => import("../pages/admin/User"));
const Reservations = React.lazy(() => import("../pages/admin/Reservations"));
const Loans = React.lazy(() => import("../pages/admin/Loans"));

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
    }),
    new Page({
        name: "Borrow",
        component: Borrow,
        route: "/borrow/:id/:name",
        authenticated: true,
        permissions: 0
    }),
    new Page({
        name: "Reserve",
        component: Reserve,
        route: "/reserve/:id/:name",
        authenticated: true,
        permissions: 0
    }),
    new Page({
        name: "Edit User",
        component: EditUser,
        route: "/admin/edit-user/:id/:name",
        authenticated: true,
        permissions: 5
    }),
    new Page({
        name: "User Profile",
        component: User,
        route: "/admin/users/:id/:name",
        authenticated: true,
        permissions: 5
    }),
    new Page({
        name: "Loans",
        component: Loans,
        route: "/admin/loans",
        authenticated: true,
        permissions: 5,
        nav: true,
        icon: LogoutOutlined
    }),
    new Page({
        name: "Reservations",
        component: Reservations,
        route: "/admin/reservations",
        authenticated: true,
        permissions: 5,
        nav: true,
        icon: LockOutlined
    })
];
export default pages;
