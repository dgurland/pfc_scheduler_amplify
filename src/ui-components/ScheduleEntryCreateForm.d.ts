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
export declare type ScheduleEntryCreateFormInputValues = {
    date?: string;
    activityIds?: string[];
    division?: number;
    period?: number;
};
export declare type ScheduleEntryCreateFormValidationValues = {
    date?: ValidationFunction<string>;
    activityIds?: ValidationFunction<string>;
    division?: ValidationFunction<number>;
    period?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ScheduleEntryCreateFormOverridesProps = {
    ScheduleEntryCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    date?: PrimitiveOverrideProps<TextFieldProps>;
    activityIds?: PrimitiveOverrideProps<TextFieldProps>;
    division?: PrimitiveOverrideProps<TextFieldProps>;
    period?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ScheduleEntryCreateFormProps = React.PropsWithChildren<{
    overrides?: ScheduleEntryCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ScheduleEntryCreateFormInputValues) => ScheduleEntryCreateFormInputValues;
    onSuccess?: (fields: ScheduleEntryCreateFormInputValues) => void;
    onError?: (fields: ScheduleEntryCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ScheduleEntryCreateFormInputValues) => ScheduleEntryCreateFormInputValues;
    onValidate?: ScheduleEntryCreateFormValidationValues;
} & React.CSSProperties>;
export default function ScheduleEntryCreateForm(props: ScheduleEntryCreateFormProps): React.ReactElement;
