/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createScheduleEntry } from "../graphql/mutations";
const client = generateClient();
export default function ScheduleEntryCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    period: "",
    division: "",
  };
  const [period, setPeriod] = React.useState(initialValues.period);
  const [division, setDivision] = React.useState(initialValues.division);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setPeriod(initialValues.period);
    setDivision(initialValues.division);
    setErrors({});
  };
  const validations = {
    period: [{ type: "Required" }],
    division: [{ type: "Required" }],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          period,
          division,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: createScheduleEntry.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "ScheduleEntryCreateForm")}
      {...rest}
    >
      <TextField
        label="Period"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={period}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              period: value,
              division,
            };
            const result = onChange(modelFields);
            value = result?.period ?? value;
          }
          if (errors.period?.hasError) {
            runValidationTasks("period", value);
          }
          setPeriod(value);
        }}
        onBlur={() => runValidationTasks("period", period)}
        errorMessage={errors.period?.errorMessage}
        hasError={errors.period?.hasError}
        {...getOverrideProps(overrides, "period")}
      ></TextField>
      <TextField
        label="Division"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={division}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              period,
              division: value,
            };
            const result = onChange(modelFields);
            value = result?.division ?? value;
          }
          if (errors.division?.hasError) {
            runValidationTasks("division", value);
          }
          setDivision(value);
        }}
        onBlur={() => runValidationTasks("division", division)}
        errorMessage={errors.division?.errorMessage}
        hasError={errors.division?.hasError}
        {...getOverrideProps(overrides, "division")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
