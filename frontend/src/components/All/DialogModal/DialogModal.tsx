import { FC } from "react";
import { FaFilter } from 'react-icons/fa'; // Import the filter icon from react-icons

import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import styles from "./index.module.css";

interface IProps {
  children?: React.ReactNode;
  label?: React.ReactNode; // Changed type to React.ReactNode to accept JSX elements
}

const DialogModal: FC<IProps> = ({ children, label = <FaFilter /> }) => { // Use FaFilter as the default icon
  return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className={styles.button} variant="link">
            {label}
          </Button>
        </DialogTrigger>
        <DialogContent className={styles.dialogContent}>
          <DialogHeader>
            <DialogTitle>Filter</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
  );
};

export default DialogModal;


