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
export declare type CalendarEventCreateFormInputValues = {
    date?: string;
    title?: string;
    category?: number;
};
export declare type CalendarEventCreateFormValidationValues = {
    date?: ValidationFunction<string>;
    title?: ValidationFunction<string>;
    category?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CalendarEventCreateFormOverridesProps = {
    CalendarEventCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    date?: PrimitiveOverrideProps<TextFieldProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    category?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type CalendarEventCreateFormProps = React.PropsWithChildren<{
    overrides?: CalendarEventCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: CalendarEventCreateFormInputValues) => CalendarEventCreateFormInputValues;
    onSuccess?: (fields: CalendarEventCreateFormInputValues) => void;
    onError?: (fields: CalendarEventCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: CalendarEventCreateFormInputValues) => CalendarEventCreateFormInputValues;
    onValidate?: CalendarEventCreateFormValidationValues;
} & React.CSSProperties>;
export default function CalendarEventCreateForm(props: CalendarEventCreateFormProps): React.ReactElement;
