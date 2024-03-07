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
export declare type ActivityCreateFormInputValues = {
    name?: string;
    usage?: number;
};
export declare type ActivityCreateFormValidationValues = {
    name?: ValidationFunction<string>;
    usage?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ActivityCreateFormOverridesProps = {
    ActivityCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    usage?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ActivityCreateFormProps = React.PropsWithChildren<{
    overrides?: ActivityCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ActivityCreateFormInputValues) => ActivityCreateFormInputValues;
    onSuccess?: (fields: ActivityCreateFormInputValues) => void;
    onError?: (fields: ActivityCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ActivityCreateFormInputValues) => ActivityCreateFormInputValues;
    onValidate?: ActivityCreateFormValidationValues;
} & React.CSSProperties>;
export default function ActivityCreateForm(props: ActivityCreateFormProps): React.ReactElement;
