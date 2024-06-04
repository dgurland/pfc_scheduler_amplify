import { Button, TextField } from "@mui/material";
import { generateClient } from "aws-amplify/api";
import { Dispatch, SetStateAction, useState } from "react";

type PeriodInputProps = {
  value: string[];
  setValue: Dispatch<SetStateAction<string[]>>
  index: number;
}

const PeriodInput = (props: PeriodInputProps) => {
  const { value, setValue, index } = props;
  const initialValue = `${value}`; //use to see if has change
  const [isEditing, setIsEditing] = useState(false);
	const API = generateClient({ authMode: 'apiKey' });

  return (
    <div>
      {isEditing ?
        <TextField value={value[index]} onChange={(event) => {
          const newValue = value;
          newValue[index] = event.target.value;
          setValue([...newValue])
        }} />
        :
        <div>{value[index]}</div>
      }
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Save' : 'Edit'}
        </Button>
    </div>
  )
}

export default PeriodInput;