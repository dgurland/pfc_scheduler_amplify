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
export declare type FacilityUpdateFormInputValues = {
    name?: string;
};
export declare type FacilityUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type FacilityUpdateFormOverridesProps = {
    FacilityUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type FacilityUpdateFormProps = React.PropsWithChildren<{
    overrides?: FacilityUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    facility?: any;
    onSubmit?: (fields: FacilityUpdateFormInputValues) => FacilityUpdateFormInputValues;
    onSuccess?: (fields: FacilityUpdateFormInputValues) => void;
    onError?: (fields: FacilityUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: FacilityUpdateFormInputValues) => FacilityUpdateFormInputValues;
    onValidate?: FacilityUpdateFormValidationValues;
} & React.CSSProperties>;
export default function FacilityUpdateForm(props: FacilityUpdateFormProps): React.ReactElement;
