import { ACCOUNT_TYPE } from "../../utils/constants";

export const AdminSideBarLink = [
  {
    _id: 1,
    name: "Insights",
    path: "/admin/insight",
    icon: "VscGraph",
  },
  {
    _id: 2,
    name: "Instructor Management",
    path: "/admin/instructors",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscOrganization",
  },
  {
    _id: 3,
    name: "User Management",
    path: "/admin/users",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscAccount",
  },
  {
    _id: 4,
    name: "Course Management",
    path: "/admin/courses",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscBook",
  },
];
