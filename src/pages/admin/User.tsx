import React, { useState, useEffect } from "react";
import AsyncState from "../../store/AsyncState";
import { UserProfile, fetchUserProfile } from "../../store/api/User";
import { useParams } from "react-router-dom";
import Dashboard from "../Dashboard";

export default function User() {
    const [profile, setProfile] = useState(AsyncState(null as UserProfile | null));
    const fetchDetails = async (id: number) => {
        setProfile({ ...profile, loading: true, error: null });
        let response = await fetchUserProfile(id);
        if (response.error) return setProfile({ ...profile, loading: false, error: response.error });
        if (response.payload) return setProfile({ ...profile, loading: false, data: response.payload });
    };
    const params = useParams<{ id: string; name: string }>();
    //Fetch User Profile on Component Mount / When URL params change
    useEffect(() => {
        let id: number | null = null;
        try {
            id = parseInt(params.id);
        } catch (error) {}
        //User ID
        if (id) fetchDetails(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);
    //Force Refresh
    const refresh = () => {
        let id: number | null = null;
        try {
            id = parseInt(params.id);
        } catch (error) {}
        //User ID
        if (id) fetchDetails(id);
    };
    const removeReservation = (id: number) => {
        if (profile.data) {
            let index = profile.data.reservations.findIndex((v) => v.id === id);
            setProfile({
                ...profile,
                data: {
                    ...profile.data,
                    reservations: [
                        ...profile.data.reservations.slice(0, index),
                        ...profile.data.reservations.slice(index + 1)
                    ]
                }
            });
        }
    };

    const removeLoan = (id: number) => {
        if (profile.data) {
            let index = profile.data.loans.findIndex((v) => v.id === id);
            setProfile({
                ...profile,
                data: {
                    ...profile.data,
                    loans: [...profile.data.loans.slice(0, index), ...profile.data.loans.slice(index + 1)]
                }
            });
        }
    };
    return (
        <Dashboard profile={profile} removeLoan={removeLoan} removeReservation={removeReservation} refresh={refresh} />
    );
}
