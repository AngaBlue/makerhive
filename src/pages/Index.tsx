import React, { useEffect, useState } from "react";
import { Input, Select, Typography, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/reducer";
import styles from "./Index.module.less";
import { getItems } from "../store/slices/items";
import CardContainer from "../components/cards/CardContainer";
import Card from "../components/cards/Card";
import { EyeOutlined, LogoutOutlined, EditOutlined, ReloadOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import URLSafe from "../components/URLSafe";
import Loading from "../components/Loading";
import GhostButton from "../components/GhostButton";

export default function Index() {
    //!!!Add Refresh Button
    const dispatch = useDispatch();
    const { items, user } = useSelector((state: RootState) => ({ items: state.items, user: state.user }));
    //Fetch Items if Not Found / Cache Stale
    useEffect(() => {
        if (!items.loading) dispatch(getItems({ throttle: { requested: items.requested, timeout: 3 * 60 * 1000 } }));
    });

    const [filters, setFilters] = useState({ name: "", sorting: "name-az" });
    let filteredItems = [...(items.data || [])];
    if (filteredItems) {
        //Filter Name
        if (filters.name) {
            filteredItems = filteredItems.filter((item) => item.name.toLowerCase().includes(filters.name));
        }
        //Sorting
        switch (filters.sorting) {
            case "name-az":
                filteredItems.sort((a, b) => {
                    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                    return 0;
                });
                break;
            case "name-za":
                filteredItems.sort((a, b) => {
                    if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;
                    if (a.name.toLowerCase() < b.name.toLowerCase()) return 1;
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

    //Force Refresh
    const refresh = () => {
        dispatch(getItems());
    };
    return (
        <div className={styles.index}>
            <div className={styles.filters}>
                <Input.Search
                    placeholder="Search items..."
                    onChange={setNameFilter}
                    className={styles.search}
                    aria-label="Search"
                />
                <Select defaultValue="name-az" onSelect={setSorting} className={styles.sorting} aria-label="Sort Items">
                    <Select.Option value="name-az">Name (A-Z)</Select.Option>
                    <Select.Option value="name-za">Name (Z-A)</Select.Option>
                    <Select.Option value="quantity-desc">Quantity (Desc)</Select.Option>
                    <Select.Option value="quantity-asc">Quantity (Asc)</Select.Option>
                </Select>
                <Button
                    icon={<ReloadOutlined />}
                    loading={items.loading}
                    onClick={refresh}
                    className={styles.refresh}
                />
            </div>
            {items.data ? (
                <CardContainer className={styles.items}>
                    {filteredItems.map((item) => (
                        <Card
                            name={item.name}
                            image={item.image}
                            url={`/items/${item.id}/${URLSafe(item.name)}`}
                            actions={[
                                <Link to={`/items/${item.id}/${URLSafe(item.name)}`}>
                                    <GhostButton icon={<EyeOutlined />} className={styles.action}>
                                        Details
                                    </GhostButton>
                                </Link>,
                                item.hidden ? (
                                    <Link to={`/admin/edit-item/${item.id}/${URLSafe(item.name)}`}>
                                        <GhostButton icon={<EditOutlined />} className={styles.action}>
                                            Edit
                                        </GhostButton>
                                    </Link>
                                ) : (
                                    <Link to={`/borrow/${item.id}/${URLSafe(item.name)}`}>
                                        <GhostButton icon={<LogoutOutlined />} className={styles.action}>
                                            Borrow
                                        </GhostButton>
                                    </Link>
                                )
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
                            editable={user.data && user.data.rank.permissions ? item.id : 0}
                            overlay={item.hidden ? "rgba(240, 242, 245, 0.6)" : undefined}
                        />
                    ))}
                </CardContainer>
            ) : (
                items.loading && <Loading />
            )}
        </div>
    );
}
