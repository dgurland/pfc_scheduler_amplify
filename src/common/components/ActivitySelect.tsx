import { Select, MenuItem, Modal, Button, Box, Checkbox, TextField } from "@mui/material";
import { Activity, DIVISIONS, ScheduleEntry } from "../../types"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import "../../App.css";
import { deleteActivityScheduleEntry, createActivityScheduleEntry as createActivityScheduleEntryMutation } from "../../graphql/mutations";
import { generateClient } from "aws-amplify/api";
import CloseIcon from '@mui/icons-material/Close';
import classNames from "classnames";
type ActivityProps = {
	scheduleEntries: ScheduleEntry[],
	activities: Activity[],
	onChange: any,
	facilityUsage: any,
	createScheduleEntry: Function,
	isOpen: boolean,
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	enableFacilityUsage: boolean;
}


const ActivitySelect = (props: ActivityProps) => {
	const { scheduleEntries, activities, onChange, facilityUsage, createScheduleEntry, isOpen, setIsOpen, enableFacilityUsage } = props;
	const [filterValue, setFilterValue] = useState("");
	const [selectedActivities, setSelectedActivities] = useState<Activity[]>([])
	const API = generateClient({ authMode: 'apiKey' });

	useEffect(() => {
		if (scheduleEntries.length == 1) {
			const scheduleEntry = scheduleEntries[0];
			const selected = activities.filter((activity) => scheduleEntry.activities?.items?.find((item) => item.activity.id == activity.id));
			selected.forEach((activity) => {
				const existingEntry = scheduleEntry.activities?.items?.find((item) => item.activity.id == activity.id)
				if (existingEntry?.label) {
					activity.label = existingEntry.label;
				}
			})
			setSelectedActivities(selected);
		}
	}, [scheduleEntries])
	const [hasChange, setHasChange] = useState(false);

	async function handleSubmit() {
		if (hasChange) {
			await Promise.all(scheduleEntries.map((scheduleEntry) => { return handleSubmitOneEntry(scheduleEntry)}))
			onChange();
		}
		setIsOpen(false);
		setSelectedActivities([]);
	}

	async function handleSubmitOneEntry(scheduleEntry: ScheduleEntry) {
		let scheduleEntryForSubmit = scheduleEntry;
		if (!scheduleEntry?.id) {
			const result = await createScheduleEntry(scheduleEntry.period, scheduleEntry.division);
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
						<div className="font-bold mb-2 flex flex-col lg:flex-row justify-between lg:items-center border-b border-gray pb-2 gap-4 lg:gap-2">
							{scheduleEntries.length == 1 ? (
								`Editing Period ${scheduleEntries[0].period + 1} for Division ${DIVISIONS[scheduleEntries[0].division]}`)
								: enableFacilityUsage ? (`Editing multiple items for period ${scheduleEntries[0].period + 1}`)
								:
								(
									`Warning: you are editing ${scheduleEntries.length} items from different periods right now. Facility usage checks are disabled.`
								)
							}
							<div className="lg:w-1/2 flex relative">
								<TextField className="w-full" key="filter" placeholder="Search..." value={filterValue} size="small"
									onChange={(event) => setFilterValue(event.target.value)} />
								<button className="absolute right-4 top-2" onClick={() => setFilterValue("")}><CloseIcon /></button>
							</div>
						</div>

						<div className="max-h-[90vh] overflow-auto">
							{activities.map((activity, i) => {
								return (
									<div key={activity.id} className={classNames("mb-4 flex items-center justify-between", { "hidden": !(activity.facility.name.toLowerCase().includes(filterValue.toLowerCase()) || activity.name.toLowerCase().includes(filterValue.toLowerCase())) })}>
										<Checkbox
											key={`checkbox-${activity.id}`}
											checked={selectedActivities.includes(activity)}
											disabled={((activity.usage * scheduleEntries.length) > 100 || facilityUsage[activity.facility.name] + (activity.usage * scheduleEntries.length) > 100) && !selectedActivities.includes(activity)}
											onChange={(event) => {
												setHasChange(true)
												if (event.target.checked) {
													setSelectedActivities(selectedActivities.concat([activity]))
													facilityUsage[activity.facility.name] = facilityUsage[activity.facility.name] ? facilityUsage[activity.facility.name] + (activity.usage * scheduleEntries.length) : (activity.usage * scheduleEntries.length);
												} else {
													setSelectedActivities(selectedActivities.filter((act) => act.id !== activity.id))
													facilityUsage[activity.facility.name] -= (activity.usage * scheduleEntries.length);
												}
											}}
										/>
										<div className={classNames("flex flex-col flex-grow ml-4", { "text-gray": ((activity.usage * scheduleEntries.length) > 100 || facilityUsage[activity.facility.name] + (activity.usage * scheduleEntries.length) > 100) && !selectedActivities.includes(activity)})}>
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
				<></>
			}
		</>
	)
}

export default ActivitySelect;

