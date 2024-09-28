import { FC } from "react";

interface test {
  // Define your props here
  title: string;
}

const test: FC<test> = () => {
  return (
    <div>
      <h1>Hello</h1>
      {/* Rest of your component */}
    </div>
  );
};

export default test;
