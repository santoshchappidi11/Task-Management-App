import React from "react";
import { Card, Input, Button } from "@nextui-org/react";

const Login = () => {
  return (
    <div className="w-screen flex justify-center items-center">
      <Card className="w-6/12 my-12 py-10 px-10 rounded-md" shadow="sm">
        <div className="h-8 w-full mb-5">
          <h2 className="text-2xl font-semibold">LOGIN</h2>
        </div>
        <div>
          <div className="flex flex-col w-full flex-wrap md:flex-nowrap gap-4">
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
              placeholder="Enter Your Password"
              name="password"
            />
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <Button
                className="w-2/12 "
                color="danger"
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

export default Login;
