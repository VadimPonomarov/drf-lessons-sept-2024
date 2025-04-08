"use client";
import React, {FC, useEffect, useState} from 'react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {UseFormReset} from "react-hook-form";

import ComboBox from "@/components/All/ComboBox/ComboBox.tsx";
import {IUser, IUsersResponse} from "@/common/interfaces/users.interfaces.ts";
import {IItem} from "@/components/All/ComboBox/interfaces.ts";
import {IDummyAuth} from "@/common/interfaces/dummy.interfaces.ts";
import {apiUsers} from "@/services/apiUsers.ts";

interface IProps {
    reset?: UseFormReset<IDummyAuth>
}

const UsersComboBox: FC<IProps> = ({reset}) => {
    const [users, setUsers] = useState<IItem[]>([]);
    const {data} = useQuery<IUsersResponse>({
        queryKey: ["users"],
        queryFn: async () => await apiUsers.usersAll(),
        staleTime: Infinity,
    });

    const queryClient = useQueryClient();

    const onSelect = (id: number) => {
        const userData = queryClient.getQueryData<IUsersResponse>(['users']);
        if (userData) {
            const user = userData.users.find(user => user.id === id);
            if (user) {
                reset({
                    username: user.username,
                    password: user.password,
                    expiresInMins: 30
                })
            }
        }
    };

    useEffect(() => {
        if (data) {
            setUsers(
                data.users
                    .map((item: IUser) =>
                        ({
                            id: item.id,
                            label: [item.firstName, item.lastName].join(" "),
                            value: [item.firstName, item.lastName].join(" "),
                        } as IItem)
                    )
                    .sort((a, b) => (a.label > b.label ? 1 : -1)));
        }
    }, [data]);

    return (
        <ComboBox items={users} onSelect={onSelect}/>
    );
};

export default UsersComboBox;
