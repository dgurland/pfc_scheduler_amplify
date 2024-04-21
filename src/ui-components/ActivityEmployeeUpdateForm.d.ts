/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps } from "@aws-amplify/ui-react";
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
export declare type ActivityEmployeeUpdateFormInputValues = {};
export declare type ActivityEmployeeUpdateFormValidationValues = {};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ActivityEmployeeUpdateFormOverridesProps = {
    ActivityEmployeeUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
} & EscapeHatchProps;
export declare type ActivityEmployeeUpdateFormProps = React.PropsWithChildren<{
    overrides?: ActivityEmployeeUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    activityEmployee?: any;
    onSubmit?: (fields: ActivityEmployeeUpdateFormInputValues) => ActivityEmployeeUpdateFormInputValues;
    onSuccess?: (fields: ActivityEmployeeUpdateFormInputValues) => void;
    onError?: (fields: ActivityEmployeeUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ActivityEmployeeUpdateFormInputValues) => ActivityEmployeeUpdateFormInputValues;
    onValidate?: ActivityEmployeeUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ActivityEmployeeUpdateForm(props: ActivityEmployeeUpdateFormProps): React.ReactElement;
