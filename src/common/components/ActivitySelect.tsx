import { Select, MenuItem, Modal, Button, Box, Checkbox, TextField } from "@mui/material";
import { Activity, DIVISIONS, ScheduleEntry } from "../../types"
import React, { useEffect, useState } from "react";
import "../../App.css";
import { deleteActivityScheduleEntry, createActivityScheduleEntry as createActivityScheduleEntryMutation } from "../../graphql/mutations";
import { generateClient } from "aws-amplify/api";
import classNames from "classnames";
type ActivityProps = {
	scheduleEntry: ScheduleEntry,
	activities: Activity[],
	onChange: any,
	facilityUsage: any,
	createScheduleEntry: Function,
	period: number,
	division: number
}


const ActivitySelect = (props: ActivityProps) => {
	const { scheduleEntry, activities, onChange, facilityUsage, createScheduleEntry, period, division } = props;
	const [isOpen, setIsOpen] = useState(false);
	const [selectedActivities, setSelectedActivities] = useState<Activity[]>([])
	const API = generateClient({ authMode: 'apiKey' });

	useEffect(() => {
		const selected = activities.filter((activity) => scheduleEntry.activities?.items?.find((item) => item.activity.id == activity.id));
		selected.forEach((activity) => {
			const existingEntry = scheduleEntry.activities?.items?.find((item) => item.activity.id == activity.id)
			if (existingEntry?.label) {
				activity.label = existingEntry.label;
			}
		})
		setSelectedActivities(selected);

	}, [scheduleEntry])
	const [hasChange, setHasChange] = useState(false);

	async function handleSubmit() {
		if (hasChange) {
			let scheduleEntryForSubmit = scheduleEntry;
			if (!scheduleEntry?.id) {
				const result = await createScheduleEntry(period, division);
				scheduleEntryForSubmit = result.data.createScheduleEntry;
			}
			else if (scheduleEntry.activities?.items?.length) {
				await Promise.all(scheduleEntry.activities.items.map((existingRelation) => {
					return deleteRelation(existingRelation.id);
				}))
			}
			await Promise.all(selectedActivities.map((a) => {
				return createScheduleEntryActivityRelation(scheduleEntryForSubmit.id, a.id, a.label);
			}))
			onChange();
		}
		setIsOpen(false);
	}

	async function deleteRelation(id) {
		return await API.graphql({ query: deleteActivityScheduleEntry, variables: { input: { id } } })
	}

	async function createScheduleEntryActivityRelation(entryId: string, activityId: string, label: string = "") {
		const data = {
			scheduleEntryActivitiesId: entryId,
			activityScheduleEntriesId: activityId,
			label: label,
		}
		return await API.graphql({
			query: createActivityScheduleEntryMutation,
			variables: { input: data },
		});
	}

	return (
		<>
			{isOpen
				?
				<Modal open={isOpen}>
					<div className="flex flex-col bg-white w-full sm:w-1/2 h-full rounded absolute top-0 sm:left-[25%] p-4 overflow-scroll">
						<div className="font-bold mb-2">
							Editing Period {scheduleEntry.period + 1} for Division {DIVISIONS[scheduleEntry.division]}
						</div>
						<div className="max-h-[90vh] overflow-auto">
							{activities.map((activity, i) => {
								return (
									<div key={activity.id} className="mb-4 flex items-center justify-between">
										<Checkbox
											key={i}
											checked={selectedActivities.includes(activity)}
											disabled={facilityUsage[activity.facility.name] + activity.usage > 100 && !selectedActivities.includes(activity)}
											onChange={(event) => {
												setHasChange(true)
												if (event.target.checked) {
													setSelectedActivities(selectedActivities.concat([activity]))
													facilityUsage[activity.facility.name] = facilityUsage[activity.facility.name] ? facilityUsage[activity.facility.name] + activity.usage : activity.usage;
												} else {
													setSelectedActivities(selectedActivities.filter((act) => act.id !== activity.id))
													facilityUsage[activity.facility.name] -= activity.usage;
												}
											}}
										/>
										<div className={classNames("flex flex-col flex-grow ml-4", { "text-gray": facilityUsage[activity.facility.name] + activity.usage > 100 && !selectedActivities.includes(activity) })}>
											{activity.name}
											{activity.facility?.name && (
												<span className="text-xs text-gray">{activity.facility.name}</span>
											)}
										</div>
										<TextField key={i} size="small" onChange={(event) => {
											const updatedActivities = [...selectedActivities];
											const activityIndex = updatedActivities.indexOf(activity)
											updatedActivities[activityIndex].label = event.target.value;
											setSelectedActivities(updatedActivities);
											setHasChange(true);
										}} placeholder="Note" value={selectedActivities.find((a) => a.id == activity.id)?.label} disabled={!selectedActivities.includes(activity)}></TextField>
									</div>
								)
							})}
						</div>
						<div className="mt-auto flex gap-4 justify-end">
							<Button onClick={() => setIsOpen(false)} variant="outlined">Cancel</Button>
							<Button variant="contained" onClick={() => handleSubmit()}>Submit</Button>
						</div>
					</div>
				</Modal>
				:
				<div className="flex flex-col items-start justify-start">
					<span>{scheduleEntry.activities?.items?.map((item) => `${item.activity.name}${item.label ? " (" + item.label + ")" : ''}`).join(', ')}</span>
					<Button onClick={() => setIsOpen(true)}>Edit</Button>
				</div>
			}

		</>
	)
}

export default ActivitySelect;

