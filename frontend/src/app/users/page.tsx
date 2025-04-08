import {FC} from "react";
import {Metadata} from "next";

import {IUsersResponse} from "@/common/interfaces/users.interfaces.ts";
import UsersClient from "@/app/users/UsersClient.tsx";
import {fetchUsers} from "@/app/api/helpers.ts";
import styles from "./index.module.css";

const UsersPage: FC = async () => {
    const response = await fetchUsers() as unknown as IUsersResponse;

    return (
        <div className={styles.absoluteContainer}>
            <UsersClient initialData={response}/>
        </div>
    );
};

export const metadata: Metadata = {
    title: "Users",
    description: "...",
};

export default UsersPage;
