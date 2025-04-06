import { ResizableWrapper } from "@/components/All/ResizableWrapper/ResizableWrapper.tsx";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import { FC } from "react";

interface IProps {
  children: React.ReactNode;
}

const SimpleAlert: FC<IProps> = ({ children }) => {
  return (
    <div className={"w-screen h-screen flex items-center justify-center"}>
      <ResizableWrapper>
        <Alert>
          <AlertDescription className={"flex flex-col text-center"}>
            {children}
          </AlertDescription>
        </Alert>
      </ResizableWrapper>
    </div>
  );
};

export default SimpleAlert;
