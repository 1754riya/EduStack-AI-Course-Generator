"use client";
import React from "react";
import AddCourse from "./_components/AddCourse";
import Usercourselist from "./_components/UserCourseList";
import { motion } from "motion/react";

function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AddCourse />
      <Usercourselist />
    </motion.div>
  );
}

export default Dashboard;
