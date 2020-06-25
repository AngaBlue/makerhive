import React, { useEffect, useState } from "react";
import { Row, Col, Input, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/reducer";
import { getUser } from "../store/slices/items";
import ItemCard from "../components/ItemCard";
import styles from "./Index.module.less";

export default function Index() {
    const dispatch = useDispatch();
    const items = useSelector((state: RootState) => state.items);

    useEffect(() => {
        if (!items.data && !items.loading) dispatch(getUser());
    });

    const [filters, setFilters] = useState({ name: "", sorting: "name-az" });
    let filteredItems = items.data;
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
                <Input.Search placeholder="Search items..." onChange={setNameFilter} style={{ width: 200 }} />
                <div>
                    <Select defaultValue="name-az" onSelect={setSorting} className={styles.sorting}>
                        <Select.Option value="name-az">Name (A-Z)</Select.Option>
                        <Select.Option value="name-za">Name (Z-A)</Select.Option>
                        <Select.Option value="quantity-desc">Quantity (Desc)</Select.Option>
                        <Select.Option value="quantity-asc">Quantity (Asc)</Select.Option>
                    </Select>
                </div>
            </div>
            <Row className={styles.items}>
                {filteredItems && filteredItems.map((item) => <ItemCard item={item} key={item.id} />)}
                {Array(10)
                    .fill(null)
                    .map((_, i) => (
                        <Col className={styles.itemFiller} key={i} />
                    ))}
            </Row>
        </div>
    );
}
