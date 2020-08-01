import React, { useEffect, useState } from "react";
import { Input, Select, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/reducer";
import styles from "./Reservations.module.less";
import CardContainer from "../../components/cards/CardContainer";
import Loading from "../../components/Loading";
import { getReservations } from "../../store/slices/reservations";
import { AdminReservationCard } from "../../components/cards/AdminReservationCard";
import { ReloadOutlined } from "@ant-design/icons";

export default function Reservations() {
    const dispatch = useDispatch();
    const reservations = useSelector((state: RootState) => state.reservations);
    //Fetch Items if Not Found / Cache Stale
    useEffect(() => {
        if (!reservations.loading)
            dispatch(getReservations({ throttle: { requested: reservations.requested, timeout: 60 * 1000 } }));
    });

    const [filters, setFilters] = useState({ name: "", sorting: "time-desc" });
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
            case "time-desc":
                filteredReservations.sort((a, b) => new Date(b.reserved).getTime() - new Date(a.reserved).getTime());
                break;
            case "time-asc":
                filteredReservations.sort((a, b) => new Date(a.reserved).getTime() - new Date(b.reserved).getTime());
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

    const removeReservation = (id: number) => {
        dispatch({
            type: "reservations/removeReservation",
            payload: id
        });
    };

    //Force Refresh
    const refresh = () => {
        dispatch(getReservations());
    };
    return (
        <div className={styles.index}>
            <div className={styles.filters}>
                <Input.Search placeholder="Search items..." onChange={setNameFilter} className={styles.search} />
                <Select defaultValue="time-desc" onSelect={setSorting} className={styles.sorting}>
                    <Select.Option value="time-desc">Newest First</Select.Option>
                    <Select.Option value="time-asc">Oldest First</Select.Option>
                    <Select.Option value="name-az">Name (A-Z)</Select.Option>
                    <Select.Option value="name-za">Name (Z-A)</Select.Option>
                </Select>
                <Button
                    icon={<ReloadOutlined />}
                    loading={reservations.loading}
                    onClick={refresh}
                    className={styles.refresh}
                />
            </div>
            {reservations.data ? (
                <CardContainer className={styles.items}>
                    {filteredReservations.map((reservation) => (
                        <AdminReservationCard {...reservation} remove={removeReservation} />
                    ))}
                </CardContainer>
            ) : (
                reservations.loading && <Loading />
            )}
        </div>
    );
}
