"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { RobotMascot } from "./robot-mascot"

export default function GlobalRobot() {
  const router = useRouter()

  return (
    <RobotMascot
      clickable
      onClick={() => router.push("/chatbot")}
    />
  )
}
