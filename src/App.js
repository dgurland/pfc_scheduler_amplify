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

const App = ({ signOut }) => {
  
  const router = createBrowserRouter([
    {
      path: "/activities-and-facilities",
      element: <ActivityFacility />,
    },
    {
      path: "/",
      element: <div>Hello World</div>,
    },
  ]);

  return (
    <div>
      <div className="bg-blue text-white m-8 w-full">
        <Link href="/activities-and-facilities">Activities and Facilities</Link>
      </div>
    <RouterProvider router={router} />
    </div>
  );
};

export default withAuthenticator(App);