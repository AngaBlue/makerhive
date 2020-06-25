import { DashboardOutlined, AppstoreOutlined } from "@ant-design/icons";

export default [
    {
        name: "Inventory",
        icon: AppstoreOutlined,
        route: "/",
        authenticated: true
    },
    {
        name: "Dashboard",
        icon: DashboardOutlined,
        route: "/dashboard",
        authenticated: true
    }
];
