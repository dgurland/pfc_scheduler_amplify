/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type ScheduleEntryUpdateFormInputValues = {
    date?: string;
    activityIds?: string[];
    division?: number;
    period?: number;
};
export declare type ScheduleEntryUpdateFormValidationValues = {
    date?: ValidationFunction<string>;
    activityIds?: ValidationFunction<string>;
    division?: ValidationFunction<number>;
    period?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ScheduleEntryUpdateFormOverridesProps = {
    ScheduleEntryUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    date?: PrimitiveOverrideProps<TextFieldProps>;
    activityIds?: PrimitiveOverrideProps<TextFieldProps>;
    division?: PrimitiveOverrideProps<TextFieldProps>;
    period?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ScheduleEntryUpdateFormProps = React.PropsWithChildren<{
    overrides?: ScheduleEntryUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    scheduleEntry?: any;
    onSubmit?: (fields: ScheduleEntryUpdateFormInputValues) => ScheduleEntryUpdateFormInputValues;
    onSuccess?: (fields: ScheduleEntryUpdateFormInputValues) => void;
    onError?: (fields: ScheduleEntryUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ScheduleEntryUpdateFormInputValues) => ScheduleEntryUpdateFormInputValues;
    onValidate?: ScheduleEntryUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ScheduleEntryUpdateForm(props: ScheduleEntryUpdateFormProps): React.ReactElement;
