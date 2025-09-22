'use client'

import React, { useState, useEffect, useContext } from 'react';
import Dropdown, { DropdownOption } from '@/components/ui/form/base-component/dropdown';
import { EAlertType, useAlert } from '@/contexts/alert-context';
import { DataListViewMutators, DataListViewContext } from '@/components/ui/view/datal-list-view';

interface EditableCellDropdownProps<T, K extends keyof T> {
    value: T;
    rowId: string;
    updateKey: K;
    apiUpdateFn: (rowId: string, value: T[K]) => Promise<any>;
    options: DropdownOption<T[K]>[];
    dropdownProps?: Omit<React.ComponentProps<typeof Dropdown<T[K]>>, 'options' | 'value' | 'onChange'>;
    buttonRender?: React.ReactNode;
    onUpdated?: (newValue: T[K]) => void;
}

export function EditableCellDropdown<T, K extends keyof T>({
    value,
    rowId,
    updateKey,
    apiUpdateFn,
    options,
    dropdownProps,
    buttonRender,
    onUpdated,
}: EditableCellDropdownProps<T, K>) {
    const [displayValue, setDisplayValue] = useState<T[K]>(value[updateKey]);
    const showAlert = useAlert();
    const mutators = useContext(DataListViewContext) as DataListViewMutators<T> | null;

    useEffect(() => {
        setDisplayValue(value[updateKey]);
    }, [value, updateKey]);

    const handleSave = async (newValue: T[K]) => {
        if (newValue !== displayValue) {
            const response = await apiUpdateFn(rowId, newValue);

            if (!response.meta?.success) {
                showAlert(response.meta?.external_message || 'Update failed', EAlertType.ERROR);
            } else {
                setDisplayValue(newValue);
                if (mutators?.updateItemById) {
                    mutators.updateItemById({ id: rowId, [updateKey]: newValue } as Partial<T> & { id: string });
                }
                if (onUpdated) {
                    onUpdated(newValue);
                }
            }
        }
    };

    return (
        <Dropdown<T[K]>
            options={options}
            value={displayValue}
            onChange={handleSave}
            size="sm"
            buttonRender={buttonRender}
            {...dropdownProps}
        />
    );
}
