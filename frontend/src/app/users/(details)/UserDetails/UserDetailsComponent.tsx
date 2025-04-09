import clsx from "clsx";
import {FC} from "react";
import styles from "@/app/users/(details)/UserCard/index.module.css";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {IUserResponse} from "@/common/interfaces/users.interfaces.ts";



type IProps = { user: IUserResponse }

const UserDetailsComponent: FC<IProps> = async (props) => {
    const user = (await props).user

    return (
        <div className="pl-[400px] pt-[70px] pb-5 pr-5 w-screen h-[85%] flex gap-2 flex-wrap justify-items-start">
            <Card
                className={clsx(styles.card, "fixed top-[80px] left-[60px] w-auto h-[85%]")}
            >
                <div className="m-4 p-2 text-left">
                    <Avatar>
                        <AvatarImage src={user.image} alt="@shadcn"/>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
                <CardHeader>
                    <CardTitle>
                        {user.id}: {user.firstName} {user.lastName}
                    </CardTitle>
                    <CardDescription>Age: {user.age}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>{user.phone}</p>
                    <p>{user.role}</p>
                </CardContent>
                <CardFooter>
                    <p className="text-small">{user.email}</p>
                </CardFooter>
            </Card>

        </div>
    );
};

export default UserDetailsComponent;

