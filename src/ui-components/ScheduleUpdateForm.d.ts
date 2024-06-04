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
export declare type ScheduleUpdateFormInputValues = {
    date?: string;
    periods?: number;
    periodNames?: string[];
};
export declare type ScheduleUpdateFormValidationValues = {
    date?: ValidationFunction<string>;
    periods?: ValidationFunction<number>;
    periodNames?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ScheduleUpdateFormOverridesProps = {
    ScheduleUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    date?: PrimitiveOverrideProps<TextFieldProps>;
    periods?: PrimitiveOverrideProps<TextFieldProps>;
    periodNames?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ScheduleUpdateFormProps = React.PropsWithChildren<{
    overrides?: ScheduleUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    schedule?: any;
    onSubmit?: (fields: ScheduleUpdateFormInputValues) => ScheduleUpdateFormInputValues;
    onSuccess?: (fields: ScheduleUpdateFormInputValues) => void;
    onError?: (fields: ScheduleUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ScheduleUpdateFormInputValues) => ScheduleUpdateFormInputValues;
    onValidate?: ScheduleUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ScheduleUpdateForm(props: ScheduleUpdateFormProps): React.ReactElement;
