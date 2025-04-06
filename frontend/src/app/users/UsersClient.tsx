"use client";
import {FC} from "react";
import {IUser, IUsersResponse} from "@/common/interfaces/users.interfaces.ts";
import {UserCard} from "@/app/users/(details)/UserCard/UserCard.tsx";
import InfiniteScroll from "@/components/All/InfiniteScroll/InfiniteScroll.tsx";
import {PaginationComponent} from "@/components/All/PaginationComponent/PaginationComponent.tsx";
import UniversalFilter from "@/components/All/UniversalFilter/FilterInput.tsx";
import DialogModal from "@/components/All/DialogModal/DialogModal.tsx";
import {useSearchParams} from "next/navigation";
import {motion} from "framer-motion";

import {useUsers} from "./useUsers.ts";

interface IProps {
    initialData: IUsersResponse;
}

const UsersClient: FC<IProps> = ({initialData}) => {
    const baseUrl = "/users";
    const searchParams = useSearchParams();
    const limit = searchParams.get("limit");
    const skip = searchParams.get("skip");
    const {filteredUsers, handleNextPage, isFetchingNextPage, hasNextPage, total, filterUsers} = useUsers({
        initialData,
    });

    return (
        <>
            <div className={"fixed top-[60px] z-50"}>
                <PaginationComponent total={total} baseUrl={baseUrl}/>
            </div>
            <div className="w-screen flex items-center justify-center">
                <DialogModal>
                    <UniversalFilter<IUser>
                        queryKey={["users", limit, skip]}
                        filterKeys={[
                            "id",
                            "username",
                            "firstName",
                            "lastName",
                            "email",
                            "age",
                            "gender",
                            "role",
                            "phone",
                        ]}
                        cb={filterUsers}
                        targetArrayKey="users"
                    />
                </DialogModal>
            </div>
            <InfiniteScroll isLoading={isFetchingNextPage} hasMore={!!hasNextPage} next={handleNextPage}>
                <motion.div className={"flex flex-wrap gap-8 justify-center"}
                            initial={{opacity: 0, scale: 0.5}}
                            animate={{opacity: 1, scale: 1}}
                            transition={{
                                duration: 0.8,
                                delay: 0.5,
                                ease: [0, 0.71, 0.2, 1.01],
                            }}>
                    {filteredUsers.sort((a, b) => a.id > b.id ? 1 : -1).map((user: IUser) => (
                        <div key={user.id}>
                            <UserCard item={user}/>
                        </div>
                    ))}
                </motion.div>
            </InfiniteScroll>
        </>
    );
};

export default UsersClient;

