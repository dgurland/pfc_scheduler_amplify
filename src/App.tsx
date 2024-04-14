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
import ScheduleEditor from "./templates/ScheduleEditor";
import { FetchUserAttributesOutput, fetchUserAttributes } from 'aws-amplify/auth';
import { AppBar, Box, Button, Toolbar } from "@mui/material";
import ScheduleDisplay from "./templates/ScheduleDisplay";


const App = ({ signOut }) => {

  const [userAttributes, setUserAttributes] = useState<FetchUserAttributesOutput>({});

  async function handleFetchUserAttributes() {
    try {
      const ua = await fetchUserAttributes();
      console.log(ua);
      setUserAttributes(ua)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleFetchUserAttributes();
  }, [])

  const routes = [
    {
      path: "/activities-and-facilities",
      element: <ActivityFacility />,
      name: "Activities and Facilities",
      enabled: (userAttributes['custom:authLevel'] ?? '') == 'admin',
      order: 2
    },
    {
      path: "/schedule-edit",
      element: <ScheduleEditor />,
      name: "Edit Schedules",
      enabled: (userAttributes['custom:authLevel'] ?? ''),
      order: 1
    },
    {
      path: "/",
      name: "Home",
      element: <ScheduleDisplay date="04/14/2024" />,
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
            <Toolbar className="flex gap-4">
              {routes.sort((a, b) => a.order - b.order).map((route) => {
                if (route.enabled) {
                  return (
                    <a href={route.path} className="text-white hover:underline">
                      {route.name}
                    </a>
                  )
                }
              })}
              <div className="ml-auto flex gap-4 items-center">
                <span className="text-white">Welcome <span className="font-bold">{userAttributes['name'] ?? userAttributes['username']}</span></span>
                <Button className="text-white" onClick={signOut} color='inherit' variant='outlined'>Sign Out</Button>
              </div>
            </Toolbar>
          </AppBar>
        </Box>
      </div>
      <RouterProvider router={router} />
    </div>
  );
};

export default withAuthenticator(App);