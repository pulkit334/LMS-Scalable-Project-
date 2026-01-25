import * as icons from "react-icons/vsc";
import { NavLink, useLocation, matchPath } from "react-router-dom";

const SidebarLink = ({ link, iconsName }) => {
  const IconComponent = icons[iconsName];
  const location = useLocation();


  const matchRoute = (route)=>{
    return matchPath({path : route},location.pathname)
  }
  const isActive = matchRoute(link.path);

  return (
    <NavLink
      to={link.path}
      className={`relative flex items-center gap-x-3 rounded-md px-4 py-2 text-sm transition-all
        ${
          isActive
            ? "bg-yellow-400/10 text-yellow-400"
            : "text-slate-400 hover:bg-slate-800"
        }
      `}
    >
      {/* LEFT ACTIVE BAR */}
      <span
        className={`absolute left-0 top-0 h-full w-1 bg-yellow-400 transition-opacity
          ${isActive ? "opacity-100" : "opacity-0"}
        `}
      />

      {IconComponent && <IconComponent className="text-lg" />}
      <span>{link.name}</span>
    </NavLink>
  );
};

export default SidebarLink;
