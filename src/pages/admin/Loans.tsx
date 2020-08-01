import React, { useEffect, useState } from "react";
import { Input, Select, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/reducer";
import styles from "./Loans.module.less";
import CardContainer from "../../components/cards/CardContainer";
import Loading from "../../components/Loading";
import { getLoans } from "../../store/slices/loans";
import { AdminLoanCard } from "../../components/cards/AdminLoanCard";
import { ReloadOutlined } from "@ant-design/icons";

export default function Loans() {
    const dispatch = useDispatch();
    const loans = useSelector((state: RootState) => state.loans);
    //Fetch Items if Not Found / Cache Stale
    useEffect(() => {
        if (!loans.loading) dispatch(getLoans({ throttle: { requested: loans.requested, timeout: 3 * 60 * 1000 } }));
    });

    const [filters, setFilters] = useState({ name: "", sorting: "time-desc" });
    let filteredloans = [...(loans.data || [])];
    if (filteredloans) {
        //Filter Name
        if (filters.name) {
            filteredloans = filteredloans.filter((r) => r.item.name.toLowerCase().includes(filters.name));
        }
        //Sorting
        switch (filters.sorting) {
            case "name-az":
                filteredloans.sort((a, b) => {
                    if (a.item.name.toLowerCase() < b.item.name.toLowerCase()) return -1;
                    if (a.item.name.toLowerCase() > b.item.name.toLowerCase()) return 1;
                    return 0;
                });
                break;
            case "name-za":
                filteredloans.sort((a, b) => {
                    if (a.item.name.toLowerCase() > b.item.name.toLowerCase()) return -1;
                    if (a.item.name.toLowerCase() < b.item.name.toLowerCase()) return 1;
                    return 0;
                });
                break;
            case "time-desc":
                filteredloans.sort((a, b) => new Date(b.borrowed).getTime() - new Date(a.borrowed).getTime());
                break;
            case "time-asc":
                filteredloans.sort((a, b) => new Date(a.borrowed).getTime() - new Date(b.borrowed).getTime());
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

    const removeLoan = (id: number) => {
        dispatch({
            type: "loans/removeLoan",
            payload: id
        });
    };

    //Force Refresh
    const refresh = () => {
        dispatch(getLoans());
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
                    loading={loans.loading}
                    onClick={refresh}
                    className={styles.refresh}
                />
            </div>
            {loans.data ? (
                <CardContainer className={styles.items}>
                    {filteredloans.map((reservation) => (
                        <AdminLoanCard {...reservation} remove={removeLoan} />
                    ))}
                </CardContainer>
            ) : (
                loans.loading && <Loading />
            )}
        </div>
    );
}
