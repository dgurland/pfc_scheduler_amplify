import { useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type CollapsibleCellProps = {
  value: string;
  truncateAfter?: number;
}

const CollapsibleCell = (props: CollapsibleCellProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const truncateAfter = props.truncateAfter ?? 50;
  return (
    <div className="flex">
      {isCollapsed ? props.value.substring(0, Math.min(truncateAfter, props.value.length)) : props.value}{isCollapsed ? '...' : ''}
      {props.value.length > truncateAfter && (
        <button onClick={() => setIsCollapsed(!isCollapsed)}>
          <ExpandMoreIcon className={isCollapsed ? "" : "rotate-180"} />
        </button>
      )}
    </div>
  )
}

export default CollapsibleCell;