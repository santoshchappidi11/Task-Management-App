import React from "react";

import { Card, Input, Button } from "@nextui-org/react";

const Register = () => {
  return (
    <div className="w-screen flex justify-center items-center">
      <Card className="w-6/12 my-12 py-10 px-10 rounded-md" shadow="sm">
        <div className="h-8 w-full mb-5">
          <h2 className="text-2xl font-semibold">Register</h2>
        </div>
        <div>
          <div className="flex flex-col w-full flex-wrap md:flex-nowrap gap-4">
            <Input
              radius="sm"
              type="text"
              label="Name"
              placeholder="Enter your Name"
              name="name"
            />
            <Input
              radius="sm"
              type="email"
              label="Email"
              placeholder="Enter your Email"
              name="email"
            />
            <Input
              radius="sm"
              type="password"
              label="Password"
              placeholder="Enter Password"
              name="password"
            />
            <Input
              radius="sm"
              type="password"
              label="Confirm Passwordd"
              placeholder="Enter Confirm Password"
              name="confirmPassword"
            />
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <Button
                className="w-2/12 "
                color="success"
                variant="ghost"
                radius="sm"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Register;
