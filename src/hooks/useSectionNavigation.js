import { useLocation, useNavigate } from "react-router-dom";

export function useSectionNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTarget: sectionId } });
      return;
    }

    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };
}
