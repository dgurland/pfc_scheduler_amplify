import { Tabs, Tab } from "@mui/material";
import classNames from "classnames";
import React, { useState } from "react";

const GoogleForms = () => {
  const [tab, setTab] = useState(0)

  return (
    <div>
      <div className="lg:hidden">
        <Tabs value={tab} onChange={(event, newValue) => setTab(newValue)}>
          <Tab value={0} key={0} label="Maintenance"></Tab>
          <Tab value={1} key={1} label="Housekeeping"></Tab>
        </Tabs>
      </div>
      <div className="flex flex-col lg:flex-row">
        <div className={classNames("lg:flex w-full", { "hidden": tab != 0 })}>
          <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdNX5vBTekwXzyeAdea2t0ec-YknlrrEy7P_nGNb7QKdIbQMg/viewform?embedded=true" width="100%" height="689" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
        </div>
        <div className={classNames("lg:flex w-full", { "hidden": tab != 1 })}>
          <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSejHwA47pcm52m9ep1zZB8IpxQ_V0jNIn8ppG41ATDFC66lkQ/viewform?embedded=true" width="100%" height="689" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
        </div>
      </div>
    </div>
  )
}

export default GoogleForms;