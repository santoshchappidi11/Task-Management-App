import { Button } from "@nextui-org/react";
import React from "react";

const Home = () => {
  return (
    <div className="flex gap-4 items-center">
      <Button color="primary" size="sm">
        Small
      </Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  );
};

export default Home;
