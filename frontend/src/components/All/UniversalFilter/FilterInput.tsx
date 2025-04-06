import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

import styles from "./index.module.css";
import useUniversalFilter from "./useUniversalFilter";
import {IProps} from "./index.interfaces";

const UniversalFilter = <T, >({
                                  queryKey,
                                  filterKeys,
                                  targetArrayKey,
                                  cb
                              }: IProps<T>) => {
    const {inputValues, handleInputChange, handleFocus, handleReset} =
        useUniversalFilter<T>({
            queryKey,
            filterKeys,
            targetArrayKey,
            cb
        });


    return (
        <div className={styles.container}>
            {filterKeys.map(key => (
                <div key={String(key)} className={styles.inputContainer}>
                    <label htmlFor={String(key)} className={styles.label}>
                        {String(key)}
                    </label>
                    <Input
                        id={String(key)}
                        value={inputValues[key] || ""}
                        onChange={e => handleInputChange(key, e.target.value)}
                        onFocus={handleFocus}
                        placeholder={`...`}
                        className={styles.input}
                    />
                </div>
            ))}
            <Button onClick={handleReset} className={styles.button}>
                Reset
            </Button>
        </div>
    );
};

export default UniversalFilter;
