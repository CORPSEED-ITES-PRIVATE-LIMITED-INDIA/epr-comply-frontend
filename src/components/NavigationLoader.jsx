import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader";

export default function NavigationLoader() {
  const location = useLocation();
  const first = useRef(true);
  const [visible, setVisible] = useState(true); // Show by default initially
  const navActive = useRef(false);
  const navTimer = useRef(null);
  const showTimer = useRef(null);

  // read common loading flags from slices
  const serviceLoading = useSelector((s) => s.service?.loading);
  const blogLoading = useSelector((s) => s.blogs?.loading);
  const settingLoading = useSelector((s) => s.setting?.loading);
  const authLoading = useSelector((s) => s.auth?.loading);

  const anyPending =
    serviceLoading === "pending" ||
    blogLoading === "pending" ||
    settingLoading === "pending" ||
    authLoading === true;

  // Hide initial loader after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (first.current) {
        setVisible(false);
        first.current = false;
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // When location changes, activate watch window for navigation loads
  useEffect(() => {
    if (first.current) return;

    navActive.current = true;
    const maxWatch = 1200;
    if (navTimer.current) clearTimeout(navTimer.current);
    navTimer.current = setTimeout(() => {
      navActive.current = false;
    }, maxWatch);

    return () => {
      if (navTimer.current) clearTimeout(navTimer.current);
    };
  }, [location]);

  // Show loader if pending during navigation
  useEffect(() => {
    if (!first.current) {
      const showDelay = 200;

      if (anyPending && navActive.current) {
        if (showTimer.current) clearTimeout(showTimer.current);
        showTimer.current = setTimeout(() => {
          if (anyPending && navActive.current) setVisible(true);
        }, showDelay);
      }

      if (!anyPending) {
        if (showTimer.current) {
          clearTimeout(showTimer.current);
          showTimer.current = null;
        }
        setVisible(false);
        navActive.current = false;
      }
    }

    return () => {
      if (showTimer.current) clearTimeout(showTimer.current);
    };
  }, [anyPending]);

  if (!visible) return null;
  return <Loader />;
}
