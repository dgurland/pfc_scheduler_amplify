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
export declare type FacilityCreateFormInputValues = {
    name?: string;
};
export declare type FacilityCreateFormValidationValues = {
    name?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type FacilityCreateFormOverridesProps = {
    FacilityCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type FacilityCreateFormProps = React.PropsWithChildren<{
    overrides?: FacilityCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: FacilityCreateFormInputValues) => FacilityCreateFormInputValues;
    onSuccess?: (fields: FacilityCreateFormInputValues) => void;
    onError?: (fields: FacilityCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: FacilityCreateFormInputValues) => FacilityCreateFormInputValues;
    onValidate?: FacilityCreateFormValidationValues;
} & React.CSSProperties>;
export default function FacilityCreateForm(props: FacilityCreateFormProps): React.ReactElement;
