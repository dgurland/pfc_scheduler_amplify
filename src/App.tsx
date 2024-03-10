import React from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import {
  Link,
  withAuthenticator
} from "@aws-amplify/ui-react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ActivityFacility from "./templates/ActivityFacility";
import ScheduleEditor from "./templates/ScheduleEditor";

const App = ({ signOut }) => {
  const routes = [
    {
      path: "/activities-and-facilities",
      element: <ActivityFacility />,
    },
    {
      path: "/schedule-edit",
      element: <ScheduleEditor />
    },
    {
      path: "/",
      element: <div>Hello World</div>,
    },
  ]
  const router = createBrowserRouter(routes);

  return (
    <div>
      <div className="bg-blue text-white m-8 w-full">
        {routes.map((route) => (
        <Link href={route.path}>{route.path}</Link>
        ))}
      </div>
    <RouterProvider router={router} />
    </div>
  );
};

export default withAuthenticator(App);