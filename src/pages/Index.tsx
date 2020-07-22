import React, { useEffect, useState } from "react";
import { Input, Select, Button, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/reducer";
import styles from "./Index.module.less";
import { getItems } from "../store/slices/items";
import CardContainer from "../components/cards/CardContainer";
import Card from "../components/cards/Card";
import { EyeOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import URLSafe from "../components/URLSafe";

export default function Index() {
    const dispatch = useDispatch();
    const items = useSelector((state: RootState) => state.items);
    useEffect(() => {
        if (!items.loading) dispatch(getItems({ throttle: { requested: items.requested, timeout: 5 * 60 * 1000 } }));
    });

    const [filters, setFilters] = useState({ name: "", sorting: "name-az" });
    let filteredItems = [...(items.data || [])];
    if (filteredItems) {
        //Filter Name
        if (filters.name) {
            filteredItems = filteredItems.filter((item) => item.name.toLowerCase().includes(filters.name));
        }
        //Sort
        switch (filters.sorting) {
            case "name-az":
                filteredItems.sort((a, b) => {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    return 0;
                });
                break;
            case "name-za":
                filteredItems.sort((a, b) => {
                    if (a.name > b.name) return -1;
                    if (a.name < b.name) return 1;
                    return 0;
                });
                break;
            case "quantity-desc":
                filteredItems.sort((a, b) => b.quantity - a.quantity);
                break;
            case "quantity-asc":
                filteredItems.sort((a, b) => a.quantity - b.quantity);
                break;
        }
    }

    const setNameFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        let name = e.target.value.toLowerCase().trim();
        if (name !== filters.name) setFilters({ ...filters, name });
    };

    const setSorting = (sorting: string) => {
        if (sorting !== filters.sorting) setFilters({ ...filters, sorting });
    };
    return (
        <div className={styles.index}>
            <div className={styles.filters}>
                <Input.Search placeholder="Search items..." onChange={setNameFilter} className={styles.search} />
                <Select defaultValue="name-az" onSelect={setSorting} className={styles.sorting}>
                    <Select.Option value="name-az">Name (A-Z)</Select.Option>
                    <Select.Option value="name-za">Name (Z-A)</Select.Option>
                    <Select.Option value="quantity-desc">Quantity (Desc)</Select.Option>
                    <Select.Option value="quantity-asc">Quantity (Asc)</Select.Option>
                </Select>
            </div>
            <CardContainer className={styles.items}>
                {filteredItems &&
                    filteredItems.map((item) => (
                        <Card
                            name={item.name}
                            image={item.image}
                            actions={[
                                <Link to={`/items/${item.id}/${URLSafe(item.name)}`}>
                                    <Button type="ghost" icon={<EyeOutlined />} className={styles.action}>
                                        Details
                                    </Button>
                                </Link>,
                                <Button type="ghost" icon={<LogoutOutlined />} className={styles.action}>
                                    Borrow
                                </Button>
                            ]}
                            details={
                                <div className={styles.info}>
                                    <Typography.Text>
                                        <Typography.Text strong>Quantity:</Typography.Text> {item.quantity}
                                    </Typography.Text>
                                    <Typography.Text>
                                        <Typography.Text strong>Available:</Typography.Text> {item.available}
                                    </Typography.Text>
                                    <Typography.Text className={styles.location}>
                                        <Typography.Text strong>Location:</Typography.Text> {item.location || "Unknown"}
                                    </Typography.Text>
                                </div>
                            }
                            key={item.id}
                        />
                    ))}
            </CardContainer>
        </div>
    );
}
