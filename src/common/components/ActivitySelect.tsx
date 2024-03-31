import { Select, MenuItem } from "@mui/material";
import { Activity, ScheduleEntry } from "../../types"
import React, { useEffect, useState } from "react";
type ActivityProps = {
	scheduleEntry: ScheduleEntry,
	activities: Activity[],
	onChange: any
}


const ActivitySelect = (props: ActivityProps) => {
	const { scheduleEntry, activities, onChange } = props;
	const [selectedActivities, setSelectedActivities] = useState<Activity[]>([])
	useEffect(() => {
		setSelectedActivities(activities.filter((activity) => scheduleEntry.activityIds.includes(activity.id)));
	}, [scheduleEntry])
	const [hasChange, setHasChange] = useState(false);
	return (
		<Select label="" value={selectedActivities.map((activity) => activity.id)} multiple
			onChange={(event) => {
				setSelectedActivities(activities.filter((activity) => event.target.value.includes(activity.id)))
				setHasChange(true)
			}}
			onClose={() => {
				if (hasChange) {
					onChange({ ...scheduleEntry, activities: [], activityIds: selectedActivities.map((activity) => activity.id) })
				}
			}}>
			{activities.map((activity: Activity) => {
				return (
					<MenuItem value={activity.id} key={activity.id}>{activity.name}</MenuItem>
				)
			})}
		</Select>
	)
}

export default ActivitySelect;

