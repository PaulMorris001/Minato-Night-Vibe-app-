import React from "react";
import { Redirect } from "expo-router";

export default function Index() {
  // for now, assume the user is NOT logged in
  const isLoggedIn = false;

  if (!isLoggedIn) {
    // redirect to the login page
    return <Redirect href="/login" />;
  }

  // if logged in, show home (we’ll move your old home code into /home.tsx)
  return <Redirect href="/home" />;
}
