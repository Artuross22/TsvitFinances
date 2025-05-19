import Link from "next/link";
import React from "react";

type Props = {
  userName: string;
};

function Navbar({ userName }: Props) {
  return (
    <header className="bg-[#282c34] p-2.5 text-white flex justify-between items-center">
      <nav>
        <ul className="list-none flex gap-2.5">
          <li>
            <Link href="/" passHref>
              <span className="text-white no-underline">
                Home
              </span>
            </Link>
          </li>
          <li>
            <Link href="/about" passHref>
              <span className="text-white no-underline">
                About
              </span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <span className="text-white">Welcome {userName} to Tsvit</span>
      </div>
      <nav>
        <ul className="list-none flex gap-2.5">
          <li className="relative group">
            <span className="text-white no-underline cursor-pointer">
              Menu
            </span>
            <div className="absolute hidden group-hover:block bg-[#282c34] p-2 min-w-[200px] shadow-lg rounded-md right-0 z-50 top-full">
              <ul className="space-y-2">
                <li>
                  <Link href="/services" passHref>
                    <span className="text-white no-underline hover:text-gray-300">Services</span>
                  </Link>
                </li>
                <li>
                  <Link href="/userManagement/View">
                    <span className="text-white no-underline hover:text-gray-300">User Management</span>
                  </Link>
                </li>
                <li>
                  <Link href="/ai/investmentGoal">
                    <span className="text-white no-underline hover:text-gray-300">Investment Goal</span>
                  </Link>
                </li>
                <li>
                  <Link href="/investmentIdea/ListIdeas">
                    <span className="text-white no-underline hover:text-gray-300">Ideas</span>
                  </Link>
                </li>
                <li>
                  <Link href="/investing">
                    <span className="text-white no-underline hover:text-gray-300">Investing</span>
                  </Link>
                </li>
                <li>
                  <Link href="/strategy" passHref>
                    <span className="text-white no-underline hover:text-gray-300">Strategy</span>
                  </Link>
                </li>
                <li>
                  <Link href="/macroeconomic" passHref>
                    <span className="text-white no-underline hover:text-gray-300">Macroeconomic</span>
                  </Link>
                </li>
                <li>
                  <Link href="/contact" passHref>
                    <span className="text-white no-underline hover:text-gray-300">Trading</span>
                  </Link>
                </li>
                <li>
                  <Link href="/login" passHref>
                    <span className="text-white no-underline hover:text-gray-300">Algorithms</span>
                  </Link>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
