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
import { AppBar, Box, Button, Link, Toolbar } from "@mui/material";


const App = ({ signOut }) => {

  const [userAttributes, setUserAttributes] = useState<FetchUserAttributesOutput>({});

  async function handleFetchUserAttributes() {
    try {
      const ua = await fetchUserAttributes();
      console.log(ua['custom:authLevel']);
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
      enabled: (userAttributes['custom:authLevel'] ?? '') == 'admin'
    },
    {
      path: "/schedule-edit",
      element: <ScheduleEditor />,
      name: "Edit Schedules",
      enabled: (userAttributes['custom:authLevel'] ?? '')
    },
    {
      path: "/",
      element: <div>Hello World</div>,
      enabled: true
    },
  ]
  const router = createBrowserRouter(routes);

  return (
    <div>
      <div className="bg-blue text-white w-full">
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              {routes.map((route) => {
                if (route.enabled) {
                  return (
                    <a href={route.path} className="text-white hover:underline">
                      {route.name}
                    </a>
                  )
                }
              })}
              <Button className="ml-auto" onClick={signOut}>Sign Out</Button>
            </Toolbar>
          </AppBar>
        </Box>
      </div>
      <RouterProvider router={router} />
    </div>
  );
};

export default withAuthenticator(App);