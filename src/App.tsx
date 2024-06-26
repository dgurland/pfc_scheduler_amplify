import React, { useEffect, useState } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import {
  Heading,
  withAuthenticator
} from "@aws-amplify/ui-react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ActivityFacility from "./templates/ActivityFacility";
import ScheduleEditLayout from "./templates/ScheduleEdit/ScheduleEditLayout";
import { FetchUserAttributesOutput, fetchUserAttributes } from 'aws-amplify/auth';
import { AppBar, Box, Button, Drawer, Toolbar } from "@mui/material";
import ScheduleDisplay from "./templates/ScheduleDisplay/ScheduleDisplay";
import { DIVISIONS, Schedule, USER_TYPE } from "./types";
import { listSchedules } from "./graphql/custom-queries";
import { generateClient } from "aws-amplify/api";
import dayjs from "dayjs";
import MenuIcon from '@mui/icons-material/Menu';
import GoogleForms from "./templates/GoogleForms";
import EmployeeManagerLayout from "./templates/EmployeeManager/EmployeeManagerLayout";
import EventsCalendar from "./templates/Events/EventsCalendar";
import Exporter from "./templates/Exporter";

const App = ({ signOut }) => {

  const [userAttributes, setUserAttributes] = useState<FetchUserAttributesOutput>({});
  const [allSchedules, setAllSchedules] = useState<Schedule[]>([]);
  const [allFilteredSchedules, setAllFilteredSchedules] = useState<Schedule[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const API = generateClient({ authMode: 'apiKey' });

  async function handleFetchUserAttributes() {
    try {
      const ua = await fetchUserAttributes();
      // console.log(ua);
      setUserAttributes(ua);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleFetchUserAttributes();
    getExistingSchedules();
  }, [])

  async function getExistingSchedules() {
    const apiData = await API.graphql({ query: listSchedules });
    const schedulesFromAPI = apiData.data.listSchedules.items;
    const sortedSchedules = schedulesFromAPI.filter((a) => dayjs().isSame(dayjs(a.date, "MM/DD/YYYY"), "day") || dayjs().isBefore(dayjs(a.date, "MM/DD/YYYY"))).sort((a, b) => dayjs(a.date, "MM/DD/YYYY").isAfter(dayjs(b.date, "MM/DD/YYYY")) ? 1 : -1);
    setAllFilteredSchedules(sortedSchedules);
    setAllSchedules(schedulesFromAPI);
  }

  const routes = [
    {
      path: "/activities-and-facilities",
      element: <ActivityFacility />,
      name: "Activities and Facilities",
      enabled: (userAttributes['custom:authLevel'] ?? '') == USER_TYPE.ADMIN,
      order: 3
    },
    {
      path: "/schedule-edit",
      element: <ScheduleEditLayout />,
      name: "Edit Schedules",
      enabled: (userAttributes['custom:authLevel'] ?? '') == USER_TYPE.ADMIN,
      order: 2
    },
    {
      path: "/upcoming",
      name: "Tomorrow's Schedule",
      element: <ScheduleDisplay key={allFilteredSchedules.length > 1 ? allFilteredSchedules[1]?.id : "schedule1"} schedule={allFilteredSchedules.length > 1 ? allFilteredSchedules[1] : undefined} defaultDivision={userAttributes['custom:division'] ? parseInt(userAttributes['custom:division']) as DIVISIONS : 0} defaultActivities={userAttributes['custom:activity'] ? userAttributes['custom:activity'].split(',') : []} />,
      enabled: allFilteredSchedules.length > 1,
      order: 1
    },
    {
      path: "/calendar",
      name: "Summer Calendar",
      element: <EventsCalendar key={userAttributes['custom:authLevel']} isAdmin={(userAttributes['custom:authLevel'] ?? '') == USER_TYPE.ADMIN} />,
      enabled: true,
      order: 4
    },
    {
      path: "/forms",
      element: <GoogleForms />,
      name: "Maintenace Request",
      enabled: true,
      order: 6
    },
    // {
    //   path: "/staff",
    //   name: "Manage Staff",
    //   element: <EmployeeManagerLayout key={userAttributes['custom:division']} divisions={userAttributes['custom:division'] ? [parseInt(userAttributes['custom:division']) as DIVISIONS] : Object.keys(DIVISIONS).filter((key) => !isNaN(Number(key)))}/>,
    //   enabled: (userAttributes['custom:authLevel'] ?? '') == USER_TYPE.ADMIN || (userAttributes['custom:authLevel'] ?? '') == USER_TYPE.DIVISION_LEADER,
    //   order: 5
    // },
    {
      path: "/export",
      name: "Print Schedules",
      element:  <Exporter schedules={allSchedules}/>,
      enabled: (userAttributes['custom:authLevel'] ?? '') == USER_TYPE.ADMIN,
      order: 7
    },
    {
      path: "/",
      name: "Today's Schedule",
      element: <ScheduleDisplay key={allFilteredSchedules[0] ? allFilteredSchedules[0].id : "schedule0"} schedule={allFilteredSchedules[0]} defaultDivision={userAttributes['custom:division'] ? parseInt(userAttributes['custom:division']) as DIVISIONS : undefined} defaultActivities={userAttributes['custom:activity'] ? userAttributes['custom:activity'].split(',') : []} />,
      enabled: true,
      order: 0
    },
  ]
  const router = createBrowserRouter(routes);

  return (
    <div>
      <div className="bg-blue text-white w-full">
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar className="flex">
              <button className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
                <MenuIcon />
              </button>
              <span className="hidden lg:flex gap-4">
                {routes.sort((a, b) => a.order - b.order).map((route) => {
                  if (route.enabled) {
                    return (
                      <a href={route.path} className="text-white hover:underline">
                        {route.name}
                      </a>
                    )
                  }
                })}
              </span>
              <div className="ml-auto flex gap-4 items-center">
                <span className="text-white">Welcome <span className="font-bold">{userAttributes['name'] ?? userAttributes['username']}</span></span>
                <Button className="text-white" onClick={signOut} color='inherit' variant='outlined'>Sign Out</Button>
              </div>
            </Toolbar>
            <Drawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
              <div className="flex flex-col gap-4 p-4">
                {routes.sort((a, b) => a.order - b.order).map((route) => {
                  if (route.enabled) {
                    return (
                      <a href={route.path} className="text-black hover:underline">
                        {route.name}
                      </a>
                    )
                  }
                })}
              </div>
            </Drawer>
          </AppBar>
        </Box>
      </div>
      <RouterProvider router={router} />
    </div>
  );
};

export default withAuthenticator(App);