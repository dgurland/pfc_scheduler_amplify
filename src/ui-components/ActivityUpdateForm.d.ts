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
export declare type ActivityUpdateFormInputValues = {
    name?: string;
    usage?: number;
};
export declare type ActivityUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    usage?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ActivityUpdateFormOverridesProps = {
    ActivityUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    usage?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ActivityUpdateFormProps = React.PropsWithChildren<{
    overrides?: ActivityUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    activity?: any;
    onSubmit?: (fields: ActivityUpdateFormInputValues) => ActivityUpdateFormInputValues;
    onSuccess?: (fields: ActivityUpdateFormInputValues) => void;
    onError?: (fields: ActivityUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ActivityUpdateFormInputValues) => ActivityUpdateFormInputValues;
    onValidate?: ActivityUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ActivityUpdateForm(props: ActivityUpdateFormProps): React.ReactElement;
