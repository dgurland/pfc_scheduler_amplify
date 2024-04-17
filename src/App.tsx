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
import ScheduleDisplay from "./templates/ScheduleDisplay";
import { Schedule } from "./types";
import { listSchedules } from "./graphql/custom-queries";
import { generateClient } from "aws-amplify/api";
import dayjs from "dayjs";
import MenuIcon from '@mui/icons-material/Menu';
import Calendar from "./templates/Calendar";

const App = ({ signOut }) => {

  const [userAttributes, setUserAttributes] = useState<FetchUserAttributesOutput>({});
  const [allSchedules, setAllSchedules] = useState<Schedule[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const API = generateClient({ authMode: 'apiKey' });

  async function handleFetchUserAttributes() {
    try {
      const ua = await fetchUserAttributes();
      // console.log(ua);
      setUserAttributes(ua)
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
    const sortedSchedules = schedulesFromAPI.filter((a) => dayjs().isSame(dayjs(a.date, "MM/DD/YYYY"), "day") || dayjs().isBefore(dayjs(a.date, "MM/DD/YYYY"))).sort((a, b) => dayjs(a, "MM/DD/YYYY").isAfter(dayjs(b, "MM/DD/YYYY") ? 1 : -1));
    setAllSchedules(sortedSchedules);
  }

  const routes = [
    {
      path: "/activities-and-facilities",
      element: <ActivityFacility />,
      name: "Activities and Facilities",
      enabled: (userAttributes['custom:authLevel'] ?? '') == 'admin',
      order: 3
    },
    {
      path: "/schedule-edit",
      element: <ScheduleEditLayout />,
      name: "Edit Schedules",
      enabled: (userAttributes['custom:authLevel'] ?? ''),
      order: 2
    },
    {
      path: "/upcoming",
      name: "Upcoming Schedule",
      element: <ScheduleDisplay schedule={allSchedules.length > 1 ? allSchedules[1] : {}} />,
      enabled: true,
      order: 1
    },
    {
      path: "/calendar",
      name: "Summer Calendar",
      element: <Calendar />,
      enabled: true,
      order: 4
    },
    {
      path: "/",
      name: "Home",
      element: <ScheduleDisplay schedule={allSchedules[0]} />,
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