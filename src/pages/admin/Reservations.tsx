import React, { useEffect, useState } from "react";
import { Input, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/reducer";
import styles from "./Reservations.module.less";
import { getItems } from "../../store/slices/items";
import CardContainer from "../../components/cards/CardContainer";
import Card from "../../components/cards/Card";
import { EyeOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import URLSafe from "../../components/URLSafe";
import Loading from "../../components/Loading";
import { ReservationCard } from "../../components/cards/ReservationCard";
import { getReservations } from "../../store/slices/reservations";

export default function Reservations() {
    const dispatch = useDispatch();
    const reservations = useSelector((state: RootState) => state.reservations);
    //Fetch Items if Not Found / Cache Stale
    useEffect(() => {
        if (!reservations.loading) dispatch(getReservations({ throttle: { requested: reservations.requested, timeout: 60 * 1000 } }));
    });

    const [filters, setFilters] = useState({ name: "", sorting: "name-az" });
    let filteredReservations = [...(reservations.data || [])];
    if (filteredReservations) {
        //Filter Name
        if (filters.name) {
            filteredReservations = filteredReservations.filter((r) => r.item.name.toLowerCase().includes(filters.name));
        }
        //Sorting
        switch (filters.sorting) {
            case "name-az":
                filteredReservations.sort((a, b) => {
                    if (a.item.name.toLowerCase() < b.item.name.toLowerCase()) return -1;
                    if (a.item.name.toLowerCase() > b.item.name.toLowerCase()) return 1;
                    return 0;
                });
                break;
            case "name-za":
                filteredReservations.sort((a, b) => {
                    if (a.item.name.toLowerCase() > b.item.name.toLowerCase()) return -1;
                    if (a.item.name.toLowerCase() < b.item.name.toLowerCase()) return 1;
                    return 0;
                });
                break;
            case "quantity-desc":
                filteredReservations.sort((a, b) => b.quantity - a.quantity);
                break;
            case "quantity-asc":
                filteredReservations.sort((a, b) => a.quantity - b.quantity);
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
            {reservations.data ? (
                <CardContainer className={styles.items}>
                    {filteredReservations.map((reservation) => (
                        <ReservationCard {...reservation} remove={(id: number) => {}}/>
                    ))}
                </CardContainer>
            ) : (
                reservations.loading && <Loading />
            )}
        </div>
    );
}
