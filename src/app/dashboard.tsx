import { FC } from "react";

interface dashboardProps {
  title: string;
}

const dashboard: FC<dashboardProps> = ({ title }) => {
  return (
    <div>
      <h1>{title}</h1>
      {}
    </div>
  );
};

export default dashboardProps;
