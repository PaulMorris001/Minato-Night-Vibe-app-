import React from "react";
import { Redirect } from "expo-router";

export default function Index() {
  const isLoggedIn = false;

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/home" />;
}
